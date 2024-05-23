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
                    "https://use.fontawesome.com",
                    "'unsafe-inline'",
                ],
                "font-src": ["'self'", "https://use.fontawesome.com"],
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

// Redirect user profile to /profile/
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/profile.html"));
});

// Use routes defined in routes.js
app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
