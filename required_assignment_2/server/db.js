// server/db.js
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "webskipanirdatabase.c92gw0ogyh2h.us-east-1.rds.amazonaws.com",
    database: "webskipanirDatabase",
    password: "BoatBoatMofo123",
    port: 5432,
});

module.exports = pool;
