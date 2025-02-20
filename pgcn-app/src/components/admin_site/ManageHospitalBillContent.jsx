import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

function ManageHospitalBillContent(){

    // Variables for inputs ------------------------------------------------------------
    const [billId, setHospitalId] = useState('');
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientMiddleName, setPatientMiddleName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [patientExtName, setPatientExtName] = useState('');
    const [patientAddress, setPatientAddress] = useState('');
    const [patientHospital, setPatientHospital] = useState('');

    const [claimantFirstname, setClaimantFname] = useState('');
    const [claimantMiddlename, setClaimantMname] = useState('');
    const [claimantLastname, setClaimantLname] = useState('');
    const [claimantExtName, setClaimantExtName] = useState('');
    const [claimantRelationship, setClaimantRelationship] = useState('');
    const [claimantContact, setClaimantContact] = useState('');
    const [claimantAmount, setClaimantAmount] = useState('');
    // Variables for inputs ------------------------------------------------------------

    // Variables for hospital bills -------------------------------
    const [hospitalBills, setHospitalBills] = useState([]);
    // Variables for hospital bills -------------------------------

    // Variables for pagination -------------------------------
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalName, setModalName] = useState();
    // Variables for pagination -------------------------------

    const handleAddHospitalBill = async (e) => {
        e.preventDefault();
    
        // Get current date-time in yyyy-mm-dd HH:mm:ss format
        const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    
        console.log("Submitting hospital bill with data:", {
            patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, patientHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact,
            claimantAmount, currentDateTime
        });
    
        try {
            const response = await fetch("http://192.168.1.248:5000/insert_hospital_bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, patientHospital,
                    claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact,
                    claimantAmount, currentDateTime
                })                
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to insert hospital bill.");
            }
    
            Swal.fire({
                icon: "success",
                title: "Transaction Successful",
                text: "Hospital bill has been recorded successfully!",
            });
    
            ResetForms();
    
        } catch (err) {
            console.error("Error:", err.message);
            Swal.fire({
                icon: "error",
                title: "Transaction Failed",
                text: err.message || "An error occurred while saving the hospital bill.",
            });
        }
    }; 

    const handleDeleteHospitalBill = async (e, billId) => {
        e.preventDefault();
    
        console.log("Testtt", billId); // Ensure billId is being passed correctly
    
        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the hospital bill record permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        }).then(async (swalResult) => {
            if (swalResult.isConfirmed) {
                try {
                    // Sending DELETE request to the backend
                    const response = await fetch('http://192.168.1.248:5000/delete_hospital_bill', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ billId }) // Send the billId to the server
                    });
    
                    const serverResult = await response.json(); // Renamed result to serverResult
    
                    if (response.ok) { 
                        Swal.fire('Deleted!', serverResult.message, 'success'); // Success message 
                    } else { 
                        Swal.fire('Error!', serverResult.error, 'error');  
                    }
                } catch (error) {
                    console.error("Error deleting hospital bill:", error);
                    Swal.fire('Error!', 'An error occurred while deleting the bill.', 'error');
                }
            } else {
                // If canceled
                Swal.fire('Cancelled', 'The hospital bill was not deleted.', 'info');
            }
        });
    };
    
    

    const handleUpdateHospitalBill = async (e) => {
        e.preventDefault();
    
        // Get current date-time in yyyy-mm-dd HH:mm:ss format
        const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    
        console.log("Submitting hospital bill with data:", {
            billId,
            patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, patientHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact,
            claimantAmount, currentDateTime
        });
    
        try {
            const response = await fetch("http://192.168.1.248:5000/update_hospital_bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    billId,
                    patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, patientHospital,
                    claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact,
                    claimantAmount, currentDateTime
                })                
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to insert hospital bill.");
            }
    
            Swal.fire({
                icon: "success",
                title: "Transaction Successful",
                text: "Hospital bill has been updated successfully!",
            }); 
    
        } catch (err) {
            console.error("Error:", err.message);
            Swal.fire({
                icon: "error",
                title: "Transaction Failed",
                text: err.message || "An error occurred while saving the hospital bill.",
            });
        }
    }; 

    const fetchHospitalBills = async () => {
        try {
            const response = await fetch("http://192.168.1.248:5000/retrieve_hospital_bill");
            const data = await response.json();
            setHospitalBills(data);
 
        } catch (error) {
            console.error("Error fetching hospital bills:", error);
        }
    };

    // Handle any real-time updates (for example, using WebSockets or polling)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchHospitalBills(); // Refresh the records periodically
        }, 2000); // Refresh every 5 seconds (you can adjust the time)

        return () => clearInterval(interval); // Cleanup interval when the component unmounts
    }, []); 

    // Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = hospitalBills.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(hospitalBills.length / recordsPerPage);

    // Open modal and set selected bill
    const handleOpenModal = (bill, editMode = false, modalName) => {
        setSelectedBill(bill);
        setIsEditMode(editMode);
        setModalName(modalName);
        PopulateForms(bill);

        console.log("ID:", bill['hospital_bill_id'])
    };
 
    const handleAddRecord = (editMode = false, modalName) => { 
        ResetForms();
        setIsEditMode(editMode);
        setModalName(modalName)  
    };

    const PopulateForms = (bill) => {
        setHospitalId(bill['hospital_bill_id']);
        setPatientFirstName(bill['patient_fname']);
        setPatientMiddleName(bill['patient_mname']);
        setPatientLastName(bill['patient_lname']);
        setPatientExtName(bill['patient_ext_name']);
        setPatientAddress(bill['patient_address']);
        setPatientHospital(bill['patient_hospital']);
        setClaimantFname(bill['claimant_fname']);
        setClaimantMname(bill['claimant_mname']);
        setClaimantLname(bill['claimant_lname']);
        setClaimantExtName(bill['claimant_extname']);
        setClaimantRelationship(bill['claimant_relationship']);
        setClaimantContact(bill['claimant_contact']);
        setClaimantAmount(bill['claimant_amount']); 
    }

    const ResetForms = () => {
        // ✅ Reset all input fields after successful save
        setPatientFirstName('');
        setPatientMiddleName('');
        setPatientLastName('');
        setPatientExtName('');
        setPatientAddress('');
        setPatientHospital('');
        setClaimantFname('');
        setClaimantMname('');
        setClaimantLname('');
        setClaimantExtName('');
        setClaimantRelationship('');
        setClaimantContact('');
        setClaimantAmount('');
        
    } 

    return(
        <>
            <main id="main" className="main">
                <div className="content">
                    <h1>Manage Hospital Bill</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a>Admin</a>
                            </li>
                            <li className="breadcrumb-item active">Manage Hospital Bill</li>
                        </ol>
                    </nav>
                </div>

                <hr />

                <main className="py-6  ">
                    <div className="container-fluid">
                        <section className="section dashboard">
                            <div className="row">

                                <div className="col-lg-12">
                                    <div className="row">
                                        <div className="col-xxl-12 col-md-12">
                                            <div className="card info-card sales-card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="card-title">List of Hospital Bill</h5>
                                                    </div>

                                                    {/* Filter and Search Section */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-3">
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="searchInput"
                                                                    placeholder="Search Patient Name"
                                                                    /* onChange={handleSearch} */
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6"></div>
                                                        <div className="col-sm-3">
                                                            <div className="input-group d-flex justify-content-end">
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#addHospitalBillModal"  
                                                                    onClick={() => handleAddRecord(true, "Add")}
                                                                >
                                                                    + Add Hospital Bil
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="table-responsive">
                                                        <table className="table datatable table-custom">
                                                            <thead>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>Patient Name</th>
                                                                    <th>Claimant Name</th>
                                                                    <th>Contact</th>
                                                                    <th>Date Registered</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentRecords.length > 0 ? (
                                                                    currentRecords.map((bill, index) => (
                                                                        <tr key={bill.id}>
                                                                            <td>{indexOfFirstRecord + index + 1}</td>
                                                                            <td>{`${bill.patient_fname} ${bill.patient_mname} ${bill.patient_lname} ${bill.patient_ext_name || ""}`}</td>
                                                                            <td>{`${bill.claimant_fname} ${bill.claimant_mname} ${bill.claimant_lname} ${bill.claimant_extname || ""}`}</td>
                                                                            <td>{bill.claimant_contact}</td>
                                                                            <td>{new Date(bill.datetime_added).toLocaleString()}</td>
                                                                            <td>
                                                                                <button className="btn btn-success" onClick={() => handleOpenModal(bill, true, "View")}
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#addHospitalBillModal">
                                                                                    <i className="bi bi-eye"></i> View
                                                                                </button>
                                                                                <button className="btn btn-primary" onClick={() => handleOpenModal(bill, true, "Edit")}
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#addHospitalBillModal">
                                                                                    <i className="bi bi-pencil"></i> Edit
                                                                                </button>
                                                                                <button className="btn btn-danger" 
                                                                                    onClick={(e) => handleDeleteHospitalBill(e, bill['hospital_bill_id'])} >
                                                                                    <i className="bi bi-trash3"></i> Delete
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="6" className="text-center">No records found</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>

                                                        <br />

                                                        {/* Pagination Controls */}
                                                        <div className="d-flex justify-content-between mt-3">
                                                            <button 
                                                                className="btn btn-secondary"
                                                                disabled={currentPage === 1}
                                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                            >
                                                                Previous
                                                            </button>
                                                            <span>Page {currentPage} of {totalPages}</span>
                                                            <button 
                                                                className="btn btn-secondary"
                                                                disabled={currentPage === totalPages}
                                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>




                            </div>
                        </section>
                    </div>
                </main>
            </main>

            {/* Modal */}
            <div className="modal fade" id="addHospitalBillModal" tabIndex="-1" aria-labelledby="addHospitalBillModal" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addHospitalBillModalLabel">
                                + Add Hospital Bill
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                 
                                <h3>Patient Information</h3><br />
                                <div className="row"> 
                                    <div className="col-3">               
                                        <label htmlFor="firstName" className="form-label">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={patientFirstName}
                                            onChange={(e) => setPatientFirstName(e.target.value)} 
                                        />
                                    </div>

                                    <div className="col-3"> 
                                        <label htmlFor="middleName" className="form-label">Middle Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="middleName"
                                            value={patientMiddleName}
                                            onChange={(e) => setPatientMiddleName(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={patientLastName}
                                            onChange={(e) => setPatientLastName(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="extName" className="form-label">Ext Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="extName"
                                            value={patientExtName}
                                            onChange={(e) => setPatientExtName(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-12">
                                        <br />

                                        <label htmlFor="extName" className="form-label">Address:</label>
                                         
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            value={patientAddress}
                                            onChange={(e) => setPatientAddress(e.target.value)} 
                                            rows={2}>

                                        </textarea>
                                    </div>

                                    
                                    <div className="col-12">
                                        <br />

                                        <label htmlFor="extName" className="form-label">Hospital:</label>
                                          

                                        <select
                                            className="form-control"
                                            id="hospital"  // ✅ Correct
                                            value={patientHospital}
                                            onChange={(e) => setPatientHospital(e.target.value)} >
                                                <option value="">Select Hospital</option>
                                                <option value="LEON D. HERNANDEZ MEMORIAL HOSPITAL">LEON D. HERNANDEZ MEMORIAL HOSPITAL</option>
                                                <option value="DAET DOCTORS HOSPITAL">DAET DOCTORS HOSPITAL</option>
                                                <option value="DR. MOISES V. CACAWA HOSPITAL">DR. MOISES V. CACAWA HOSPITAL</option>
                                                <option value="OUR LADY OF LOURDES HOSPITAL">OUR LADY OF LOURDES HOSPITAL</option>
                                                <option value="SANTISSIMA TRINIDAD OF DAET">SANTISSIMA TRINIDAD OF DAET</option>
                                                <option value="RACELIS TIONGSON MEDICAL CLINIC">RACELIS TIONGSON MEDICAL CLINIC</option>
                                                <option value="LIZASO HOSPITAL">LIZASO HOSPITAL</option>
                                                <option value="DR. MIGUEL V. ALEGRE HOSPITAL">DR. MIGUEL V. ALEGRE HOSPITAL</option>
                                                <option value="BARRIOS-BUSIÑOS MEDICAL CLINIC AND HOSPITAL">BARRIOS-BUSIÑOS MEDICAL CLINIC AND HOSPITAL</option>
                                                <option value="JOSE PANGANIBAN PRIMARY HOSPITAL">JOSE PANGANIBAN PRIMARY HOSPITAL</option> 
                                        </select>
                                    </div>

                                    
                                </div>

                                <br />
                                

                                <h3>Claimant Information</h3><br />
                                <div className="row">
                                    <div className="col-3"> 
                                        <label htmlFor="firstName" className="form-label">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={claimantFirstname}
                                            onChange={(e) => setClaimantFname(e.target.value)} 
                                        />
                                    </div>

                                    <div className="col-3"> 
                                        <label htmlFor="middleName" className="form-label">Middle Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="middleName"
                                            value={claimantMiddlename}
                                            onChange={(e) => setClaimantMname(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={claimantLastname}
                                            onChange={(e) => setClaimantLname(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="col-3">              
                                        <label htmlFor="extName" className="form-label">Ext Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="extName"
                                            value={claimantExtName}
                                            onChange={(e) => setClaimantExtName(e.target.value)}
                                        />
                                    </div>

                                    
                                    <div className="col-3">
                                        <br />
                                        <label htmlFor="extName" className="form-label">Relationship:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="extName"
                                            value={claimantRelationship}
                                            onChange={(e) => setClaimantRelationship(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-3">
                                        <br />
                                        <label htmlFor="extName" className="form-label">Contact:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="extName"
                                            value={claimantContact}
                                            onChange={(e) => setClaimantContact(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-3">
                                        <br />
                                        <label htmlFor="extName" className="form-label">Amount:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="extName"
                                            value={claimantAmount}
                                            onChange={(e) => setClaimantAmount(e.target.value)} 
                                        />
                                    </div>
                                     
                                    
                                </div>

                                <br />


                                
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>

                                    { modalName == "Add" && 
                                        <>
                                            <button type="submit" className="btn btn-primary"
                                            onClick={handleAddHospitalBill}>
                                                Save
                                            </button> 
                                        </>
                                    }

                                    { modalName == "Edit" && 
                                        <>
                                            <button type="submit" className="btn btn-primary"
                                            onClick={handleUpdateHospitalBill}>
                                                Save
                                            </button> 
                                        </>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
 

        </>
    )
}

export default ManageHospitalBillContent;