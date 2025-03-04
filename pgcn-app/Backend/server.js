require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.VITE_DB_HOST,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
    database: process.env.VITE_DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});
  
app.use(
    cors({
        origin: "http://192.168.1.248:5173", // Allow only your frontend
        credentials: true, // Allow cookies & sessions
    })
);
 
app.use(session({
    secret: process.env.VITE_SESSION_KEY,
    resave: false, 
    saveUninitialized: false,
    cookie: {
        secure: false, // Set `true` if using HTTPS
        httpOnly: true, 
        sameSite: "lax" // Adjust if cross-site requests are needed
    }
})); 

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

            // Store user details in session
            req.session.user = { account_id: user.account_id, email: user.email };

            // Force save the session
            /* req.session.save((err) => {
                if (err) {
                    console.error("Session Save Error:", err);
                    return res.status(500).json({ error: "Session not saved properly." });
                }
                console.log("Session Created:", req.session.user);
                res.json({ message: "Login successful", account_id: user.account_id });
            }); */

            /* res.json({ loggedIn: true, user: req.session.user }); */

            // Console log session details
            console.log("Session Created:", req.session.user);

            res.json({ message: "Login successful", account_id: user.account_id, email: user.email });
        });
    });
});

app.get("/session", (req, res) => {
    if (req.session.user) {
        console.log("Active Session:", req.session); // Log full session data
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        console.log("No active session");
        res.json({ loggedIn: false });
    }
});

// Logout
app.post("/logout", (req, res) => {
    if (!req.session) {
        return res.status(400).json({ error: "No active session" });
    }
    
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ message: "Logged out successfully" });
    });
});


app.post("/insert_hospital_bill", (req, res) => {
    const { 
        account_id, // Fixed variable name (was localUserId)
        patientFirstName, patientMiddleName, patientLastName, patientExtName, 
        patientPurok, patientBarangay, patientMunicipality, patientProvince, patientHospital,
        claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact, claimantAmount 
    } = req.body;     
 
    const sanitizedHospital = patientHospital && patientHospital.trim() !== "" ? patientHospital : null;
    const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

    const insertHospitalBillQuery = `
        INSERT INTO hospital_bill
        (account_id, patient_fname, patient_mname, patient_lname, patient_ext_name, 
        patient_purok, patient_barangay, patient_municipality, patient_province, 
        patient_hospital, claimant_fname, claimant_mname, claimant_lname, claimant_extname, claimant_relationship, claimant_contact, 
        claimant_amount, datetime_added) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({ error: "Transaction initialization failed." });
        }
 
        db.query(insertHospitalBillQuery, [
            account_id, // Fixed here
            patientFirstName, patientMiddleName, patientLastName, patientExtName,
            patientPurok, patientBarangay, patientMunicipality, patientProvince, patientHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact, 
            claimantAmount, currentDateTime
        ], (err, result) => {        
            if (err) {
                console.error("Hospital Bill Insertion Error:", err.sqlMessage || err);
                return db.rollback(() => res.status(500).json({ error: "Failed to insert hospital bill." }));
            }

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

app.post("/update_hospital_bill", (req, res) => {
    const { 
        billId, account_id, // Ensured `account_id` is extracted properly
        patientFirstName, patientMiddleName, patientLastName, patientExtName, 
        patientPurok, patientBarangay, patientMunicipality, patientProvince, patientHospital,
        claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact, claimantAmount 
    } = req.body;     

    const sanitizedHospital = patientHospital && patientHospital.trim() !== "" ? patientHospital : null;
    const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

    const updateHospitalBillQuery = `
        UPDATE hospital_bill
        SET 
            account_id = ?, 
            patient_fname = ?, 
            patient_mname = ?, 
            patient_lname = ?, 
            patient_ext_name = ?, 
            patient_purok = ?,
            patient_barangay = ?,
            patient_municipality = ?,
            patient_province = ?, 
            patient_hospital = ?, 
            claimant_fname = ?, 
            claimant_mname = ?, 
            claimant_lname = ?, 
            claimant_extname = ?, 
            claimant_relationship = ?, 
            claimant_contact = ?, 
            claimant_amount = ?, 
            datetime_added = ?
        WHERE hospital_bill_id = ?; 
    `;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({ error: "Transaction initialization failed." });
        }

        db.query(updateHospitalBillQuery, [
            account_id, // Fixed here
            patientFirstName, patientMiddleName, patientLastName, patientExtName, 
            patientPurok, patientBarangay, patientMunicipality, patientProvince, patientHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact, 
            claimantAmount, currentDateTime, billId
        ], (err, result) => {
            if (err) {
                console.error("Hospital Bill Update Error:", err.sqlMessage || err);
                return db.rollback(() => res.status(500).json({ error: "Failed to update hospital bill." }));
            }

            db.commit((err) => {
                if (err) {
                    console.error("Transaction Commit Error:", err);
                    return db.rollback(() => res.status(500).json({ error: "Transaction commit failed." }));
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Hospital bill not found for update." });
                }

                res.json({ message: "Hospital bill updated successfully!", bill_id: billId });
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

app.post("/delete_hospital_bill", (req, res) => {
    const { billId } = req.body;
 

    // Ensure that billId is provided
    if (!billId) {
        return res.status(400).json({ error: "billId is required." });
    }

    // SQL query to delete the hospital bill by billId
    const deleteHospitalBillQuery = "DELETE FROM hospital_bill WHERE hospital_bill_id = ?";

    // Execute the DELETE query
    db.query(deleteHospitalBillQuery, [billId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        // If no rows were affected, it means no record with the given billId was found
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Hospital bill not found." });
        }

        // Successfully deleted the hospital bill
        res.json({ message: "Hospital bill deleted successfully!" });
    });
});

app.listen(process.env.VITE_PORT, () => console.log(`Server running on port ${process.env.VITE_PORT}`));
