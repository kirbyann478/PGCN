require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.VITE_FIREBASE_DB_HOST,
    user: process.env.VITE_FIREBASE_DB_USER,
    password: process.env.VITE_FIREBASE_DB_PASSWORD,
    database: process.env.VITE_FIREBASE_DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

app.get("/accounts", (req, res) => {
    db.query("SELECT * FROM accounts", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.listen(process.env.VITE_FIREBASE_PORT, () => console.log(`Server running on port ${process.env.VITE_FIREBASE_PORT}`));
