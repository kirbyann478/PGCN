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

app.get("/basic_information", (req, res) => {
    db.query("SELECT * FROM basic_information", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

const bcrypt = require("bcrypt");

app.post("/create_account", (req, res) => {
    const { firstName, middleName, lastName, extName, gender, birthday, phoneNumber, address, membership, email, password, currentDate } = req.body;

    // Check if the email already exists
    db.query("SELECT * FROM accounts WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Email Check Error:", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        // If email already exists, return an error
        if (results.length > 0) {
            return res.status(400).json({ error: "Email is already taken." });
        }

        // Hash the password before saving it
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Password Hashing Error:", err);
                return res.status(500).json({ error: "Failed to hash password." });
            }

            // If email doesn't exist, proceed with the insert
            const insertAccountQuery = "INSERT INTO accounts (email, password, user_level, date_added) VALUES (?, ?, ?, ?)";
            const insertBasicInfoQuery = "INSERT INTO basic_information (account_id, fname, mname, lname, ext, gender, bdate, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            db.beginTransaction((err) => {
                if (err) {
                    console.error("Transaction Error:", err);
                    return res.status(500).json({ error: err.message });
                }

                // Insert into accounts table with hashed password
                db.query(insertAccountQuery, [email, hashedPassword, membership, currentDate], (err, accountResult) => {
                    if (err) {
                        console.error("Account Insertion Error:", err);
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }

                    const accountId = accountResult.insertId;

                    // Insert into basic_information table with the account_id
                    db.query(insertBasicInfoQuery, [accountId, firstName, middleName, lastName, extName, gender, birthday, phoneNumber, address], (err, infoResult) => {
                        if (err) {
                            console.error("Basic Information Insertion Error:", err);
                            return db.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }

                        // Commit transaction
                        db.commit((err) => {
                            if (err) {
                                console.error("Commit Error:", err);
                                return db.rollback(() => {
                                    res.status(500).json({ error: err.message });
                                });
                            }
                            res.json({ message: "Account created successfully", account_id: accountId });
                        });
                    });
                });
            });
        });
    });
});


app.listen(process.env.VITE_FIREBASE_PORT, () => console.log(`Server running on port ${process.env.VITE_FIREBASE_PORT}`));
