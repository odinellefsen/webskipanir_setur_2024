// server/routes.js
const express = require("express");
const pool = require("./db");

const router = express.Router();

// Endpoint to handle POST requests
router.post("/data", async (req, res) => {
    const { fullName, sex, dob, email } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (username, sex, date_of_birth, email) VALUES ($1, $2, $3, $4) RETURNING *",
            [fullName, sex, dob, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to handle GET requests
router.get("/data", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
