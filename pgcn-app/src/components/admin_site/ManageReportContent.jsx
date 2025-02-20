import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css';  

function ManageReportContent(){ 
    const [transactions, setTransactions] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [generateButton, setGenerateButton] = useState(false);

    // Variables for hospital bills
    const [hospitalBills, setHospitalBills] = useState([]);

    useEffect(() => {
        if (transactions !== "" && startDate !== "" && endDate !== "") {
            setGenerateButton(true); 
            fetchHospitalBills();  
        } else {
            setGenerateButton(false);
        }
    }, [transactions, startDate, endDate]); // ✅ Runs when any of these values change 

    const fetchHospitalBills = async () => {
        try {
            const response = await fetch("http://192.168.1.248:5000/retrieve_hospital_bill");
            const data = await response.json();
            setHospitalBills(data);
        } catch (error) {
            console.error("Error fetching hospital bills:", error);
        }
    };

    // Filter hospital bills based on startDate and endDate
    const filteredRecords = hospitalBills.filter((bill) => {
        const billDate = new Date(bill.datetime_added);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return (!start || billDate >= start) && (!end || billDate <= end);
    });

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    return(
        <>
            <main id="main" className="main">
                <div className="content">
                    <h1>Reports and Statistics</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a>Admin</a></li>
                            <li className="breadcrumb-item active">Reports and Statistics</li>
                        </ol>
                    </nav>
                </div>

                <hr />

                <main className="py-6">
                    <div className="container-fluid">
                        <section className="section dashboard">
                            <div className="row"> 
                                <div className="col-lg-12">
                                    <div className="row">
                                        <div className="col-xxl-12 col-md-12">
                                            <div className="card info-card sales-card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="card-title">Manage Transactions</h5>
                                                    </div>

                                                    {/* Filter and Search Section */}
                                                    <div className="row mb-3">   
                                                        <div className="col-sm-3">
                                                            <div className="input-group">
                                                                <label className="form-label">Select Transactions: </label> 
                                                                <select
                                                                    className="form-control"
                                                                    id="hospital" 
                                                                    value={transactions}
                                                                    onChange={(e) => setTransactions(e.target.value)} >
                                                                        <option value="">Select Transactions</option>
                                                                        <option value="Hospital Bill">Hospital Bill</option>
                                                                        <option value="Burial Assistance">Burial Assistance</option> 
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-3">
                                                            <div className="input-group">
                                                                <label className="form-label">Start Date: </label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={startDate}
                                                                    onChange={(e) => setStartDate(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
  
                                                        <div className="col-sm-3">
                                                            <div className="input-group">
                                                                <label className="form-label">End Date: </label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={endDate}
                                                                    onChange={(e) => setEndDate(e.target.value)}
                                                                />
                                                            </div>
                                                        </div> 

                                                        <div className="col-sm-3">
                                                            <div className="input-group">
                                                                <label className="form-label">Generate Masterlist: </label> 
                                                                <button type="button" className="btn btn-primary w-100"
                                                                    disabled={!generateButton}>
                                                                    Generate Report
                                                                </button>
                                                            </div> 
                                                        </div> 
                                                    </div> 

                                                    { transactions === "Hospital Bill" && 
                                                        <div className="col-sm-12">
                                                            <br />
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
                                                                                        <button className="btn btn-link" 
                                                                                            onClick={() => handleOpenModal(bill, true, "View")}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#addHospitalBillModal">
                                                                                            View
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
                                                    }
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
        </>
    );
}

export default ManageReportContent;
