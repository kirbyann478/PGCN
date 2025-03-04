import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

function DashboardContent() {  

    return (
        <>
            <main id="main" className="main">
                <div className="content">
                    <h1>Dashboard</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a >Admin</a>
                            </li>
                            <li className="breadcrumb-item active">Dashboard</li>
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

                                        <div className="col-xxl-4 col-md-4">
                                            <div className="card info-card sales-card h-100">
                                                <div className="filter">
                                                    <Link
                                                        className="icon"
                                                        to="#"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i className="bi bi-three-dots"></i>
                                                    </Link>
                                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                        <li className="dropdown-header text-start">
                                                            <h6>Filter</h6>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="#">
                                                                Today
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="#">
                                                                This Month
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="#">
                                                                This Year
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        Test 1
                                                        <span> | Today</span>
                                                    </h5>
                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            {/* <img src="../../assets/img/med_logo.png" alt="1" /> */}
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6 id="totalNumberEmployee"></h6>
                                                            <div className="ps-3">
                                                                <h6 id="ambulanceRequest">5</h6>
                                                                <span className="text-muted small pt-2 ps-1"> total number of patient care record</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-xxl-4 col-md-4">
                                            <div className="card info-card revenue-card h-100">
                                                <div className="filter">
                                                    <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                        <li className="dropdown-header text-start">
                                                            <h6>Filter</h6>
                                                        </li>

                                                        <li><a className="dropdown-item" href="#">Today</a></li>
                                                        <li><a className="dropdown-item" href="#">This Month</a></li>
                                                        <li><a className="dropdown-item" href="#">This Year</a></li>
                                                    </ul>
                                                </div>

                                                <div className="card-body">
                                                    <h5 className="card-title">Test 2 &nbsp; <span>| Today</span></h5>

                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            {/* <img src="../../assets/img/ambulance_logo.png" alt="1" /> */}
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6 id="pendingRequest">10</h6>
                                                            <span className="text-muted small pt-2 ps-1">total active ambulance service</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xxl-4 col-md-4">
                                            <div className="card info-card revenue-card h-100">
                                                <div className="filter">
                                                    <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                        <li className="dropdown-header text-start">
                                                            <h6>Filter</h6>
                                                        </li>

                                                        <li><a className="dropdown-item" href="#">Today</a></li>
                                                        <li><a className="dropdown-item" href="#">This Month</a></li>
                                                        <li><a className="dropdown-item" href="#">This Year</a></li>
                                                    </ul>
                                                </div>

                                                <div className="card-body">
                                                    <h5 className="card-title">Test 3 &nbsp; <span>| Today</span></h5>

                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            {/* <img src="../../assets/img/dashboard/dash1.png" alt="1" /> */}
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6 id="pendingRequest">2</h6>
                                                            <span className="text-muted small pt-2 ps-1">total active emergency personnel</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-xxl-12 col-md-12">

                                            <br />
                                            <div className="card info-card revenue-card">

                                                <div className="card-body">
                                                    <h5 className="card-title">Test 4 &nbsp;  </h5>


                                                    <div className="d-flex align-items-center">

                                                        {/* <PatientReportChart chart_data={allPatientRecords} />
 */}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                                {/* Add other sections */}
                            </div>
                        </section>
                    </div>
                </main>

            </main>
        </>
    );
}

export default DashboardContent;
