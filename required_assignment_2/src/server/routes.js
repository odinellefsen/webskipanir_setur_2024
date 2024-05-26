// server/routes.js
const express = require("express");
const pool = require("./db");

const router = express.Router();

// GET requests for profile and related information
// Endpoint to get profile by ID
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

router.delete("/profile/:personId/emails/:emailId/delete", async (req, res) => {
    const { personId, emailId } = req.params;

    // Parse the IDs to ensure they are integers (validation)
    const parsedPersonId = parseInt(personId, 10);
    const parsedEmailId = parseInt(emailId, 10);

    if (isNaN(parsedPersonId) || isNaN(parsedEmailId)) {
        return res.status(400).send("Invalid IDs provided.");
    }

    try {
        const result = await pool.query(
            "DELETE FROM email_table WHERE email_id = $1 AND person_id = $2 RETURNING *",
            [parsedEmailId, parsedPersonId] // Correct the order of parameters
        );

        if (result.rows.length === 0) {
            return res
                .status(404)
                .send(
                    "Email not found or does not belong to the specified person."
                );
        }

        res.status(200).json({
            message: "Email deleted successfully",
            deletedEmail: result.rows[0],
        });
    } catch (err) {
        console.error("Error deleting email:", err);
        res.status(500).send("Server error occurred while deleting email.");
    }
});

// Endpoint to post multiple emails for each person
router.post("/profile/:id/person-emails/send", async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).send("Invalid ID");
    }
    const { email } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO email_table (person_id, email) VALUES ($1, $2) RETURNING *",
            [id, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Endpoint to get emails associated with a profile by ID
router.get("/profile/:id/person-emails", async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).send("Invalid ID");
    }

    try {
        const result = await pool.query(
            "SELECT email_id, person_id, email FROM email_table WHERE person_id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send("Person not found");
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to get all profiles
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, sex, TO_CHAR(date_of_birth, 'DD-MM-YYYY') AS date_of_birth FROM people_table"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// PUT requests for updating information
// Endpoint to handle updating user profile
router.put("/profile/:id/user-photo", async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).send("Invalid ID");
    }
    const { photo } = req.body;

    try {
        const result = await pool.query(
            "UPDATE people_table SET photo = $1 WHERE id = $2 RETURNING *",
            [photo, id]
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

// POST requests for creating new records
// Endpoint to handle POST requests of basic person info
router.post("/basic-info", async (req, res) => {
    const { name, sex, dob } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO people_table (name, sex, date_of_birth) VALUES ($1, $2, $3) RETURNING *",
            [name, sex, dob]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// DELETE requests for removing records
// Endpoint to handle DELETE requests by ID
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
