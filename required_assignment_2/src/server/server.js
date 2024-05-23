const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const routes = require("./routes");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use helmet to set appropriate security headers, including CSP
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'"],
                "style-src": [
                    "'self'",
                    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
                    "'unsafe-inline'",
                ],
                "font-src": [
                    "'self'",
                    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
                ],
            },
        },
    })
);

// Serving static files from "src/public"
app.use(express.static(path.join(__dirname, "../public")));

// Redirect root to index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

// Redirect person profile to /profile/
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/profile.html"));
});

// Use routes defined in routes.js
app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
