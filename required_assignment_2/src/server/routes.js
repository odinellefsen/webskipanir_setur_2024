// server/routes.js
const express = require("express");
const pool = require("./db");

const router = express.Router();

router.get("/profile/:id", async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10); // parsing the id as an integer
    if (isNaN(parsedId)) {
        return res.status(400).send("Invalid ID");
    }

    try {
        const result = await pool.query(
            "SELECT * FROM people_table WHERE id = $1",
            [parsedId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send("Person not found");
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to handle updating user profile
router.put("/profile/:id", async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10); // parsing id as int
    if (isNaN(parsedId)) {
        return res.status(400).send("Invalid ID");
    }
    const { photo } = req.body;

    try {
        const result = await pool.query(
            "UPDATE people_table SET photo = $1 WHERE id = $2 RETURNING *",
            [photo, parsedId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send("Person not found");
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to handle POST requests
router.post("/", async (req, res) => {
    const { name, sex, dob, email } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO people_table (name, sex, date_of_birth, email) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, sex, dob, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to handle GET requests
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, sex, TO_CHAR(date_of_birth, 'DD-MM-YYYY') AS date_of_birth, email FROM people_table"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to handle DELETE requests
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (isNaN(id)) {
            return res.status(400).send("Invalid ID");
        }

        const result = await pool.query(
            "DELETE FROM people_table WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send("Person not found");
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
