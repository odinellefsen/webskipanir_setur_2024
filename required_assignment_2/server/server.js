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
                "style-src": ["'self'", "https://use.fontawesome.com"],
                "font-src": ["'self'", "https://use.fontawesome.com"],
            },
        },
    })
);

// Serve static files
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/html", express.static(path.join(__dirname, "../html")));

// Redirect root to index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/index.html"));
});

// Use routes defined in routes.js
app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
