import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css';  
import ExcelExport from "./ExportExcel"; 
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { GuaranteeLetterLayout } from "./reports/GuaranteeLetterLayout";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

function ViewBurialRecordContent(){ 

    // Variables for hospital bills -------------------------------
    const [burialAssitance, setBurialAssitance] = useState([]);
    // Variables for hospital bills -------------------------------

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
    const [deathCertificate, setDeathCertificate] = useState(null);
    const [deathCertificatePreview, setDeathCertificatePreview] = useState(null);


    const [contactPersonFirstname, setContactPersonFname] = useState('');
    const [contactPersonMiddlename, setContactPersonMname] = useState('');
    const [contactPersonLastname, setContactPersonLname] = useState('');
    const [contactPersonExtName, setContactPersonExtName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [contactPersonServiceCovered, setContactPersonServiceCovered] = useState('');
    const [contactPersonFuneralService, setContactPersonFuneralCovered] = useState('');
    const [contactPersonEncoded, setContactPersonEncoded] = useState('');
    
    const [burialStatus, setBurialStatus] = useState(''); 
    const [checkedItems, setCheckedItems] = useState({
        checkBarangayIndigency: false, 
        checkDeathCertificate: false,
        checkFuneralContract: false,
        checkValidId: false
    });
    
    const [remarks, setRemarks] = useState('');
    // Variables for inputs ------------------------------------------------------------
 
    
    const fetchBurialAssistance = async () => {
        try {
            const response = await fetch("http://localhost:5000/retrieve_burial_assistance");
            const data = await response.json();
            setBurialAssitance(data);

            PopulateForms()
 
        } catch (error) {
            console.error("Error fetching hospital bills:", error);
        }
    };


    const PopulateForms = (burial) => {
        console.log("Populating forms with:", burial); // Check all values 
    
        setBurialId(burial['burial_id']);
        setDeceasedFirstName(burial['deceased_fname']);
        setDeceasedMiddleName(burial['deceased_mname']);
        setDeceasedLastName(burial['deceased_lname']);
        setDeceasedExtName(burial['deceased_ext_name']); 
        setDeceasedPurok(burial['deceased_purok']);
        setDeceasedBarangay(burial['deceased_barangay']);
        setDeceasedMunicipality(burial['deceased_municipality']);
        setDeceasedProvince(burial['deceased_province']);
        setDeceasedGender(burial['deceased_gender']);
        setDeceasedDeathDate(burial['deceased_deathdate']);
        setContactPersonFname(burial['contact_fname']);
        setContactPersonMname(burial['contact_mname']);
        setContactPersonLname(burial['contact_lname']);
        setContactPersonExtName(burial['contact_ext_name']);
        setContactNumber(burial['contact_number']);
        setContactPersonServiceCovered(burial['contact_service_covered']);
        setContactPersonFuneralCovered(burial['contact_funeral_service']);
        setContactPersonEncoded(burial['contact_person_encoded']);
        
        setBurialStatus(burial['burial_status']); 
        setCheckedItems({
            checkBarangayIndigency: burial['check_barangay_indigency'] === 1 || burial['check_barangay_indigency'] === "true",
            checkDeathCertificate: burial['check_death_certificate'] === 1 || burial['check_death_certificate'] === "true",
            checkFuneralContract: burial['check_funeral_contract'] === 1 || burial['check_funeral_contract'] === "true",
            checkValidId: burial['check_valid_id'] === 1 || burial['check_valid_id'] === "true",
        });
        

        setRemarks(burial['remarks']);
        
        // Convert BLOB to Base64 if it's present
        if (burial['death_certificate']) {
            const base64String = `data:image/png;base64,${burial['death_certificate']}`;
            setDeathCertificate(base64String); // Set as image src
            setDeathCertificatePreview(base64String);
        } else {
            setDeathCertificate(null);
            setDeathCertificatePreview(null);
        }
    }; 
       
    return(
        <>
            <main id="main" className="main">
                <div className="content">
                    <h1>Burial Assistance Details</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a>Admin</a></li>
                            <li className="breadcrumb-item active">Burial Assistance Details</li>
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

                                                    <div className="row mb-3">     
                                                        <div className="row">
                                                            <div className="col-sm-7">
                                                                <br/>
                                                                <div className="row">
                                                                    
                                                                    <div className="columnContainer">
                                                                        <h5>Burial Assistance Information</h5><br/>

                                                                        <div className="infoContainer">
                                                                            <div className="row">
                                                                                <div className="col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <b className="form-label">Burial Assistance Information</b> <hr/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Burial Status:<br/><b>{burialStatus}</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-4">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Date of Death:<br/> <b >01/02/2025</b></label> <br />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-sm-4">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Remarks:<br/> <b >Test Remarks</b></label> 
                                                                                    </div>
                                                                                </div>

                                                                                
                                                                                <div className="col-sm-12">
                                                                                    <br/>
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">
                                                                                            Requirements Checklist:
                                                                                        </label> 
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                        <div className="infoContainer">
                                                                            <div className="row">
                                                                                <div className="col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <b className="form-label">Deceased Information</b> <hr/>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">First Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Middle Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">First Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Ext Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-sm-12">
                                                                                    <br/>
                                                                                </div>

                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Purok:<br/> <b>1</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Barangay:<br/> <b>Camambugan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Municipality:<br/> <b>Daet</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Province:<br/> <b>Camarines Norte</b></label> 
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <br/>

                                                                        <div className="infoContainer">
                                                                            <div className="row">
                                                                                
                                                                                <div className="col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <b className="form-label">Claimant Information</b> <hr/>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">First Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Middle Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">First Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Ext Name:<br/> <b>Juan</b></label> 
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-sm-12">
                                                                                    <br/>
                                                                                </div>

                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Contact Number:<br/> <b>09126992952</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Serviced Covered:<br/> <b>Full Service</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Funeral Covered:<br/> <b>Saavedra Funeral</b></label> 
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="col-sm-3">
                                                                                    <div className="input-group">
                                                                                        <label className="form-label">Encoded/Reviewed By:<br/> <b>Dennis</b></label> 
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                            
                                                            <div className="col-sm-5">
                                                                <br/>
                                                                <div className="row">
                                                                    <div className="col-sm-12">
                                                                         
                                                                            
                                                                        <div className="columnContainer">
                                                                            
                                                                        <h5 className="form-label">Death Certificate</h5>
                                                                            
                                                                            <div className="col-12 d-flex justify-content-end"> 
                                                                                <button 
                                                                                    type="button" 
                                                                                    className={`btn w-500  btn-secondary`}   
                                                                                >
                                                                                    <i className='bx bxs-image' ></i> Download
                                                                                </button>
                                                                            </div><br />
                                                                            <img src="/assets/img/death_cert.jpg" alt="1" className="dashboardSymbols"/>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>                                                             
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
 

        </>
    );
}

export default ViewBurialRecordContent;
 