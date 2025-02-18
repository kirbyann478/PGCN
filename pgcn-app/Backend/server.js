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

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if the email exists in the accounts table
    db.query("SELECT * FROM accounts WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        // If the email doesn't exist
        if (results.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Password Comparison Error:", err);
                return res.status(500).json({ error: "Internal server error." });
            }

            // If the password does not match
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid email or password." });
            }

            // If email and password are correct, you can return a success message or generate a token (e.g., JWT)
            res.json({ message: "Login successful", account_id: user.account_id });
        });
    });
});  

app.post("/insert_hospital_bill", (req, res) => {
    const { 
        patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, patientHospital,
        claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact, claimantAmount 
    } = req.body;    
 
    console.log("Received Data:", patientFirstName);
 
    const sanitizedHospital = patientHospital && patientHospital.trim() !== "" ? patientHospital : null;
 
    const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

    const insertHospitalBillQuery = `
        INSERT INTO hospital_bill
        (patient_fname, patient_mname, patient_lname, patient_ext_name, patient_address, patient_hospital, 
        claimant_fname, claimant_mname, claimant_lname, claimant_extname, claimant_relationship, claimant_contact, 
        claimant_amount, datetime_added) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({ error: "Transaction initialization failed." });
        }
 
        db.query(insertHospitalBillQuery, [
            patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, sanitizedHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact, 
            claimantAmount, currentDateTime
        ], (err, result) => {        
            if (err) {
                console.error("Hospital Bill Insertion Error:", err.sqlMessage || err);
                return db.rollback(() => res.status(500).json({ error: "Failed to insert hospital bill." }));
            }

            // Commit the transaction
            db.commit((err) => {
                if (err) {
                    console.error("Transaction Commit Error:", err);
                    return db.rollback(() => res.status(500).json({ error: "Transaction commit failed." }));
                }

                res.json({ message: "Hospital bill inserted successfully!", bill_id: result.insertId });
            });
        });
    });
}); 
 
app.get("/retrieve_hospital_bill", (req, res) => {
    db.query("SELECT * FROM hospital_bill", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.listen(process.env.VITE_FIREBASE_PORT, () => console.log(`Server running on port ${process.env.VITE_FIREBASE_PORT}`));
