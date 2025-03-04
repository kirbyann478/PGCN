
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import FetchLocalUserDetails from "./scripts/FetchLocalUser"; 

function ManageBurialContent(){
    const { localUserDetails } = FetchLocalUserDetails();
    const [ account_id, setLocalUserId ] = useState(null);

    // Variables for inputs ------------------------------------------------------------
    const [burialId, setBurialId] = useState('');
    const [deceasedFirstName, setDeceasedFirstName] = useState('');
    const [deceasedMiddleName, setDeceasedMiddleName] = useState('');
    const [deceasedLastName, setDeceasedLastName] = useState('');
    const [deceasedExtName, setDeceasedExtName] = useState('');  

    const [deceasedPurok, setDeceasedPurok] = useState('');
    const [deceasedBarangay, setDeceasedBarangay] = useState('');
    const [deceasedMunicipality, setDeceasedMunicipality] = useState('');
    const [deceasedProvince, setDeceasedProvince] = useState('Camarines Norte'); 
    const [barangayList, setBarangayList] = useState([]);  

    const [deceasedGender, setDeceasedGender] = useState('');
    const [deceasedDeathDate, setDeceasedDeathDate] = useState('');

    const [contactPersonFirstname, setContactPersonFname] = useState('');
    const [contactPersonMiddlename, setContactPersonMname] = useState('');
    const [contactPersonLastname, setContactPersonLname] = useState('');
    const [contactPersonExtName, setContactPersonExtName] = useState('');
    const [contactPersonServiceCovered, setContactPersonServiceCovered] = useState('');
    const [contactPersonFuneralService, setContactPersonFuneralCovered] = useState('');
    const [contactPersonEncoded, setContactPersonEncoded] = useState('');
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
            burialId, account_id,
            deceasedFirstName, deceasedMiddleName, deceasedLastName, deceasedExtName, 
            deceasedPurok, deceasedBarangay, deceasedMunicipality, deceasedProvince, deceasedGender, deceasedDeathDate,
            contactPersonFirstname, contactPersonMiddlename, contactPersonLastname, contactPersonExtName, 
            contactPersonServiceCovered, contactPersonFuneralService, contactPersonEncoded
        });
    
        try {
            const response = await fetch("http://localhost:5000/insert_burial_content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    burialId, account_id,
                    deceasedFirstName, deceasedMiddleName, deceasedLastName, deceasedExtName, 
                    deceasedPurok, deceasedBarangay, deceasedMunicipality, deceasedProvince, deceasedGender, deceasedDeathDate,
                    contactPersonFirstname, contactPersonMiddlename, contactPersonLastname, contactPersonExtName, 
                    contactPersonServiceCovered, contactPersonFuneralService, contactPersonEncoded
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
            }).then(() => {
                ResetForms(); // Reset the forms after the user clicks "OK"
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

    /* const handleDeleteHospitalBill = async (e, billId) => {
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
                    const response = await fetch('http://localhost:5000/delete_burial_content', {
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
            burialId, account_id,
            deceasedFirstName, deceasedMiddleName, deceasedLastName, deceasedExtName, 
            deceasedPurok, deceasedBarangay, deceasedMunicipality, deceasedProvince, deceasedGender, deceasedDeathDate,
            contactPersonFirstname, contactPersonMiddlename, contactPersonLastname, contactPersonExtName, 
            contactPersonServiceCovered, contactPersonFuneralService, contactPersonEncoded
        });
    
        try {
            const response = await fetch("http://localhost:5000/update_burial_content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    burialId, account_id,
                    deceasedFirstName, deceasedMiddleName, deceasedLastName, deceasedExtName, 
                    deceasedPurok, deceasedBarangay, deceasedMunicipality, deceasedProvince, deceasedGender, deceasedDeathDate,
                    contactPersonFirstname, contactPersonMiddlename, contactPersonLastname, contactPersonExtName, 
                    contactPersonServiceCovered, contactPersonFuneralService, contactPersonEncoded
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
    };  */

    const fetchHospitalBills = async () => {
        try {
            const response = await fetch("http://localhost:5000/retrieve_burial_content");
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
    }; 
 
    const handleAddRecord = (editMode = false, modalName) => { 
        /* ResetForms(); */
        setIsEditMode(editMode);
        setModalName(modalName)  
    };
 
    const PopulateForms = (bill) => {
        console.log("Populating forms with:", bill); // Check all values
        console.log("Claimant Barangay:", bill['patient_barangay']); // Specifically check this value

        setBurialId(bill['hospital_bill_id']);
        setPatientFirstName(bill['patient_fname']);
        setPatientMiddleName(bill['patient_mname']);
        setPatientLastName(bill['patient_lname']);
        setPatientExtName(bill['patient_ext_name']); 
        setPatientPurok(bill['patient_purok']);
        setPatientBarangay(bill['patient_barangay']);
        setPatientMunicipality(bill['patient_municipality']);
        setPatientProvince(bill['patient_province']);
        setPatientHospital(bill['patient_hospital']);
        setClaimantFname(bill['claimant_fname']);
        setClaimantMname(bill['claimant_mname']);
        setClaimantLname(bill['claimant_lname']);
        setClaimantExtName(bill['claimant_extname']);

        // ✅ Fix for the select tag issue
        setClaimantRelationship(bill['claimant_relationship']?.trim() || ""); 

        setClaimantContact(bill['claimant_contact']);
        setClaimantAmount(bill['claimant_amount']);  

        document.getElementById("relationship").value = bill['claimant_relationship']
    };


    const ResetForms = () => {
        // ✅ Reset all input fields after successful save
        setPatientFirstName('');
        setPatientMiddleName('');
        setPatientLastName('');
        setPatientExtName(''); 
        setPatientPurok('');
        setPatientBarangay('');
        setPatientMunicipality('');
        setPatientProvince('');
        setPatientHospital('');
        setClaimantFname('');
        setClaimantMname('');
        setClaimantLname('');
        setClaimantExtName('');
        setClaimantRelationship('');
        setClaimantContact('');
        setClaimantAmount('');
        
    }  

    useEffect(() => {
        if (localUserDetails){
            console.log("Test: ", localUserDetails['account_id']);

            setLocalUserId(localUserDetails['account_id']);
        }
    })

    const municipalityBarangays = {
        "Basud": ["Angas", "Bactas", "Binatagan", "Caayunan", "Guinatungan", "Hinampacan", "Langa", "Laniton", "Lidong", "Mampili", "Mandazo", "Mangcamagong", "Manmuntay", 
            "Mantugawe", "Matnog", "Mocong", "Oliva", "Pagsangahan", "Pinagwarasan", "Plaridel", "Poblacion 1", "Poblacion 2", "San Felipe", "San Jose", "San Pascual", "Taba-taba", "Tacad", "Taisan", "Tuaca"],

        "Capalonga": ["Alayao", "Binawangan", "Calabaca", "Camagsaan", "Catabaguangan", "Catioan", "Del Pilar", "Itok", "Lucbanan", "Mabini", "Mactang", "Magsaysay", "Mataque", 
            "Old Camp", "Poblacion", "San Antonio", "San Isidro", "San Roque", "Tanawan", "Ubang", "Villa Aurora", "Villa Belen"],

        "Daet": ["Alawihao", "Awitan", "Bagasbas", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI", "Barangay VII", "Barangay VIII", 
            "Bibirao", "Borabod", "Calasgasan", "Camambugan", "Cobangbang", "Dogongan", "Gahonon", "Gubat", "Lag-on", "Magang", "Mambalite", "Mancruz", "Pamorangon", "San Isidro"],

        "Jose Panganiban": [
            "Bagong Bayan", "Calero", "Dahican", "Dayhagan", "Larap", "Luklukan Norte", "Luklukan Sur", "Motherlode", "Nakalaya", "North Poblacion",
            "Osmeña", "Pag-asa", "Parang", "Plaridel", "Salvacion", "San Isidro", "San Jose", "San Martin", "San Pedro", "San Rafael",
            "Santa Cruz", "Santa Elena", "Santa Milagrosa", "Santa Rosa Norte", "Santa Rosa Sur", "South Poblacion", "Tamisan"
        ], 

        "Labo": [
            "Anahaw", "Anameam", "Awitan", "Baay", "Bagacay", "Bagong Silang I", "Bagong Silang II", "Bagong Silang III", "Bakiad", "Bautista", "Bayabas", "Bayan-bayan", "Benit", 
            "Bulhao", "Cabatuhan", "Cabusay",  "Calabasa", "Canapawan", "Daguit", "Dalas", "Dumagmang", "Exciban", "Fundado", "Guinacutan", "Guisican", "Gumamela", "Iberica", 
            "Kalamunding", "Lugui", "Mabilo I", "Mabilo II", "Macogon", "Mahawan-hawan", "Malangcao-Basud", "Malasugui", "Malatap", "Malaya", "Malibago", "Maot", "Masalong", 
            "Matanlang", "Napaod", "Pag-asa", "Pangpang", "Pinya", "San Antonio", "San Francisco", "Santa Cruz", "Submakin", "Talobatib", "Tigbinan", "Tulay na Lupa"],

        "Mercedes": [
            "Apuao", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI", "Barangay VII", "Caringo", "Catandunganon", "Cayucyucan", "Colasi",
            "Del Rosario", "Gaboc", "Hamoraon", "Hinipaan", "Lalawigan", "Lanot", "Mambungalon", "Manguisoc", "Masalongsalong", "Matoogtoog", "Pambuhan", "Quinapaguian", "San Roque", "Tarum"
        ], 

        "Paracale": [
            "Awitan", "Bagumbayan", "Bakal", "Batobalani", "Calaburnay", "Capacuan","Casalugan", "Dagang", "Dalnac", "Dancalan", "Gumaus", "Labnig", "Macolabo Island",
            "Malacbang", "Malaguit", "Mampungo", "Mangkasay", "Maybato", "Palanas","Pinagbirayan Malaki", "Pinagbirayan Munti", "Poblacion Norte", "Poblacion Sur",
            "Tabas", "Talusan", "Tawig", "Tugos"
        ],

        "San Lorenzo Ruiz": [
            "Daculang Bolo", "Dagotdotan", "Langga", "Laniton", "Maisog", "Mampurog",
            "Manlimonsito", "Matacong", "Salvacion", "San Antonio", "San Isidro", "San Ramon"
        ],

        "San Vicente": [
            "Asdum", "Cabanbanan", "Calabagas", "Fabrica", "Iraya Sur", 
            "Man-ogob", "Poblacion District I", "Poblacion District II", "San Jose"
        ],

        "Santa Elena": [
            "Basiad", "Bulala", "Don Tomas", "Guitol", "Kabuluan", "Kagtalaba",
            "Maulawin", "Patag Ibaba", "Patag Iraya", "Plaridel", "Polungguitguit",
            "Rizal", "Salvacion", "San Lorenzo", "San Pedro", "San Vicente",
            "Santa Elena", "Tabugon", "Villa San Isidro"
        ],
        
        "Talisay": [
            "Binanuaan", "Caawigan", "Cahabaan", "Calintaan", "Del Carmen",
            "Gabon", "Itomang", "Poblacion", "San Francisco", "San Isidro",
            "San Jose", "San Nicolas", "Santa Cruz", "Santa Elena", "Santo Niño"
        ],

        "Vinzons": [
            "Aguit-it", "Banocboc", "Barangay I", "Barangay II", "Barangay III",
            "Cagbalogo", "Calangcawan Norte", "Calangcawan Sur", "Guinacutan",
            "Mangcawayan", "Mangcayo", "Manlucugan", "Matango", "Napilihan",
            "Pinagtigasan", "Sabang", "Santo Domingo", "Singi", "Sula"
        ]

    };
    

    const handleMunicipalityChange = (e) => {
        const selectedMunicipality = e.target.value.trim();
        setDeceasedMunicipality(selectedMunicipality);
        setDeceasedBarangay(''); // Reset barangay selection
        setBarangayList(municipalityBarangays[selectedMunicipality] || []);
    };  
    
    return(
        <>
            <main id="main" className="main">
                <div className="content">
                    <h1>Manage Burial Assistance</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a>Admin</a>
                            </li>
                            <li className="breadcrumb-item active">Manage Burial Assistance</li>
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
                                                        <h5 className="card-title">List of Burial Assistance</h5>
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
                                                                    + Add Burial Assistance
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="table-responsive">
                                                        <table className="table datatable table-custom">
                                                            <thead>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>Deceased Name</th>
                                                                    <th>Date of Death</th>
                                                                    <th>Contact Person</th>
                                                                    <th>Contact Number</th>
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
                                                                            <td>{new Date(bill.datetime_added).toLocaleString()}</td>
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
                                                                disabled={currentPage === 1 || totalPages === 0}
                                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                            >
                                                                Previous
                                                            </button>
                                                            <span>Page {totalPages > 0 ? currentPage : 0} of {totalPages}</span>
                                                            <button 
                                                                className="btn btn-secondary"
                                                                disabled={currentPage === totalPages || totalPages === 0}
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
                                + RECORD OF DECEASED SERVICE  BY ALAY PAG-DAMAY
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                 
                                <h3>Deceased Information</h3><br />
                                <div className="row"> 
                                    <div className="col-3">               
                                        <label htmlFor="firstName" className="form-label">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={deceasedFirstName}
                                            onChange={(e) => setDeceasedFirstName(e.target.value.trim())} 
                                            placeholder="First Name"
                                        />
                                    </div>

                                    <div className="col-3"> 
                                        <label htmlFor="middleName" className="form-label">Middle Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="middleName"
                                            placeholder="Middle Name"
                                            value={deceasedMiddleName}
                                            onChange={(e) => setDeceasedMiddleName(e.target.value.trim())} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            placeholder="Last Name"
                                            value={deceasedLastName}
                                            onChange={(e) => setDeceasedLastName(e.target.value.trim())} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="extName" className="form-label">Ext Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="extName"
                                            value={deceasedExtName}
                                            placeholder="Ext Name"
                                            onChange={(e) => setDeceasedExtName(e.target.value.trim())} 
                                        />
                                    </div>    

                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Province:</label>
                                        <select
                                            className="form-control"
                                            value={deceasedProvince}
                                            disabled
                                        >
                                            <option value="Camarines Norte">Camarines Norte</option>
                                        </select>
                                    </div>
 
                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Municipality:</label>
                                        <select
                                            className="form-control"
                                            value={deceasedMunicipality}
                                            onChange={setDeceasedMunicipality}
                                        >
                                            <option value="">Select Municipality</option>
                                            {Object.keys(municipalityBarangays).map((municipality) => (
                                                <option key={municipality} value={municipality}>
                                                    {municipality}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
 
                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Barangay:</label>
                                        <select
                                            className="form-control"
                                            value={deceasedBarangay}
                                            onChange={(e) => setDeceasedBarangay(e.target.value.trim())}
                                            disabled={barangayList.length === 0}
                                        >
                                            <option value="">Select Barangay</option>
                                            {barangayList.map((barangay) => (
                                                <option key={barangay} value={barangay}>
                                                    {barangay}
                                                </option>
                                            ))} : {
                                                <option key={deceasedBarangay} value={deceasedBarangay}>
                                                    {deceasedBarangay}
                                                </option>
                                            }
                                
                                        </select>
                                    </div>
 
                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Purok:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={deceasedPurok}
                                            onChange={(e) => setDeceasedPurok(e.target.value)}
                                        />
                                    </div>   

                                    
                                    <div className="col-3">
                                        <br /> 
                                        <label htmlFor="extName" className="form-label">Gender:</label>
                                           
                                        <select
                                            className="form-control"
                                            id="hospital"   
                                            value={deceasedGender}
                                            onChange={(e) => setDeceasedGender(e.target.value)} >
                                                <option value="">Select Gender</option> 
                                                <option value="Male">Male</option> 
                                                <option value="Female">Female</option> 
                                        </select>
                                    </div>

                                    <div className="col-3">
                                        <br /> 
                                        <label htmlFor="extName" className="form-label">Death of Death:</label>
                                         
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={deceasedDeathDate}
                                            onChange={(e) => setDeceasedDeathDate(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="col-6">
                                        <br /> 
                                        <label htmlFor="extName" className="form-label">Date Certificate:</label>
                                         
                                        <input
                                            type="file"
                                            className="form-control"
                                            value={deceasedPurok}
                                            onChange={(e) => setDeceasedPurok(e.target.value)}
                                        />
                                    </div>
 
                                </div> 
                                <br />  
                                <h3>Contact Person</h3><br />
                                <div className="row">
                                    <div className="col-3"> 
                                        <label htmlFor="firstName" className="form-label">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={contactPersonFirstname}
                                            onChange={(e) => setContactPersonFname(e.target.value)} 
                                        />
                                    </div>

                                    <div className="col-3"> 
                                        <label htmlFor="middleName" className="form-label">Middle Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="middleName"
                                            value={contactPersonMiddlename}
                                            onChange={(e) => setContactPersonMname(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={contactPersonLastname}
                                            onChange={(e) => setContactPersonLname(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="col-3">              
                                        <label htmlFor="extName" className="form-label">Ext Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="extName"
                                            value={contactPersonExtName}
                                            onChange={(e) => setContactPersonExtName(e.target.value)}
                                        />
                                    </div>

                                    
                                    <div className="col-3">
                                        <br />
                                        <label htmlFor="relationship" className="form-label">Service Covered:</label>
                                        <select
                                            className="form-control"
                                            id="relationship"
                                            value={contactPersonServiceCovered}
                                            onChange={(e) => setContactPersonServiceCovered(e.target.value)}
                                        >
                                            <option value="">Select Service Covered</option>
                                            <option value="Full Service">Full Service</option>
                                            <option value="Viewing">Viewing</option> 
                                        </select>
                                    </div>
                                    
                                    <div className="col-3">
                                        <br />
                                        <label htmlFor="relationship" className="form-label">Funeral Service:</label>
                                        <select
                                            className="form-control"
                                            id="relationship"
                                            value={contactPersonFuneralService}
                                            onChange={(e) => setContactPersonFuneralCovered(e.target.value)}
                                        >
                                            <option value="">Select Funeral Service</option>
                                            <option value="SAAVEDRA FUNERAL">SAAVEDRA FUNERAL</option>
                                            <option value="ARANA FUNERAL">ARANA FUNERAL</option>
                                            <option value="BELMONTE DAET">BELMONTE DAET</option>
                                            <option value="ADEA OF JOSE PANGANIBAN">ADEA OF JOSE PANGANIBAN</option>
                                            <option value="ST RAPHAEL FUNERARIA">ST RAPHAEL FUNERARIA</option>  
                                        </select>
                                    </div>
                                    
                                    <div className="col-3">
                                        <br />
                                        <label htmlFor="relationship" className="form-label">ENCODED/REVIEWED BY:</label>
                                        <select
                                            className="form-control"
                                            id="relationship"
                                            value={contactPersonEncoded}
                                            onChange={(e) => setContactPersonEncoded(e.target.value)}
                                        >
                                            <option value="">Select Encoded/Reviewed By:</option>
                                            <option value="DENNIS">DENNIS</option>
                                            <option value="JAYSON OF GSO SE">JAYSON OF GSO SE</option>
                                            <option value="LARRY CASTRO">LARRY CASTRO</option>
                                            <option value="ROBERT PARIS">ROBERT PARIS</option>
                                            <option value="REYNNIER VINLUAN">REYNNIER VINLUAN</option>
                                            <option value="OWEN ABANTO">OWEN ABANTO</option>
                                            <option value="CHRIS CAMA">CHRIS CAMA</option>
                                            <option value="MARI MAR">MARI MAR</option>
                                            <option value="DAVE BUITRE">DAVE BUITRE</option>
                                            <option value="MARY GRACE MAGANA">MARY GRACE MAGANA</option>
                                            <option value="DAYANG TALAVERA">DAYANG TALAVERA</option>  
                                        </select>
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

export default ManageBurialContent;
 