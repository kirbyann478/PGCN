import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import FetchLocalUserDetails from "./scripts/FetchLocalUser"; 

function HospitalBillModal(){
    const { localUserDetails } = FetchLocalUserDetails();
    const [ account_id, setLocalUserId ] = useState(null);

    // Variables for inputs ------------------------------------------------------------
    const [billId, setHospitalId] = useState('');
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientMiddleName, setPatientMiddleName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [patientExtName, setPatientExtName] = useState('');  
    const [patientPurok, setPatientPurok] = useState('');
    const [patientBarangay, setPatientBarangay] = useState('');
    const [patientMunicipality, setPatientMunicipality] = useState('');
    const [patientProvince, setPatientProvince] = useState('Camarines Norte'); 
    const [barangayList, setBarangayList] = useState([]);  
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
            account_id, patientFirstName, patientMiddleName, patientLastName, patientExtName, 
            patientPurok, patientBarangay, patientMunicipality, patientProvince, patientHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact,
            claimantAmount, currentDateTime
        });
    
        try {
            const response = await fetch("http://localhost:5000/insert_hospital_bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    account_id, patientFirstName, patientMiddleName, patientLastName, patientExtName, 
                    patientPurok, patientBarangay, patientMunicipality, patientProvince, patientHospital,
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
                    const response = await fetch('http://localhost:5000/delete_hospital_bill', {
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
            billId, account_id,
            patientFirstName, patientMiddleName, patientLastName, patientExtName, patientAddress, patientHospital,
            claimantFirstname, claimantMiddlename, claimantLastname, claimantExtName, claimantRelationship, claimantContact,
            claimantAmount, currentDateTime
        });
    
        try {
            const response = await fetch("http://localhost:5000/update_hospital_bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    billId, account_id,
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
        /* ResetForms(); */
        setIsEditMode(editMode);
        setModalName(modalName)  
    };

    const PopulateForms = (bill) => {
        setHospitalId(bill['hospital_bill_id']);
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

    // Selector

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
        setPatientMunicipality(selectedMunicipality);
        setPatientBarangay(''); // Reset barangay selection
        setBarangayList(municipalityBarangays[selectedMunicipality] || []);
    };

    return(
        <>   
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
                                            onChange={(e) => setPatientFirstName(e.target.value.trim())} 
                                        />
                                    </div>

                                    <div className="col-3"> 
                                        <label htmlFor="middleName" className="form-label">Middle Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="middleName"
                                            value={patientMiddleName}
                                            onChange={(e) => setPatientMiddleName(e.target.value.trim())} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={patientLastName}
                                            onChange={(e) => setPatientLastName(e.target.value.trim())} 
                                        />
                                    </div>
                                    
                                    <div className="col-3"> 
                                        <label htmlFor="extName" className="form-label">Ext Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="extName"
                                            value={patientExtName}
                                            onChange={(e) => setPatientExtName(e.target.value.trim())} 
                                        />
                                    </div>

                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Province:</label>
                                        <select
                                            className="form-control"
                                            value={patientProvince}
                                            disabled
                                        >
                                            <option value="Camarines Norte">Camarines Norte</option>
                                        </select>
                                    </div>

                                    {/* Municipality */}
                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Municipality:</label>
                                        <select
                                            className="form-control"
                                            value={patientMunicipality}
                                            onChange={handleMunicipalityChange}
                                        >
                                            <option value="">Select Municipality</option>
                                            {Object.keys(municipalityBarangays).map((municipality) => (
                                                <option key={municipality} value={municipality}>
                                                    {municipality}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Barangay */}
                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Barangay:</label>
                                        <select
                                            className="form-control"
                                            value={patientBarangay}
                                            onChange={(e) => setPatientBarangay(e.target.value.trim())}
                                            disabled={barangayList.length === 0}
                                        >
                                            <option value="">Select Barangay</option>
                                            {barangayList.map((barangay) => (
                                                <option key={barangay} value={barangay}>
                                                    {barangay}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Purok */}
                                    <div className="col-3">
                                        <br />
                                        <label className="form-label">Purok:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={patientPurok}
                                            onChange={(e) => setPatientPurok(e.target.value)}
                                        />
                                    </div>  
                                    
                                    <div className="col-12">
                                        <br /> 
                                        <label htmlFor="extName" className="form-label">Hospital:</label>
                                          

                                        <select
                                            className="form-control"
                                            id="hospital"   
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
                                        <label htmlFor="relationship" className="form-label">Relationship:</label>
                                        <select
                                            className="form-control"
                                            id="relationship"
                                            value={claimantRelationship}
                                            onChange={(e) => setClaimantRelationship(e.target.value)}
                                        >
                                            <option value="">Select Relationship</option>
                                            <option value="Parent">Parent</option>
                                            <option value="Sibling">Sibling</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Child">Child</option>
                                            <option value="Grandparent">Grandparent</option>
                                            <option value="Relative">Relative</option>
                                            <option value="Friend">Friend</option>
                                            <option value="Guardian">Guardian</option>
                                            <option value="Other">Other</option>
                                        </select>
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

export default HospitalBillModal;