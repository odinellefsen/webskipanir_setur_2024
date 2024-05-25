// server/routes.js
const express = require("express");
const pool = require("./db");

const router = express.Router();

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
        const result = await pool.query("SELECT * FROM people_table");
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
