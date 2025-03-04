import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";

function DashboardContent() {
    
    const [chartData, setChartData] = useState({
        series: [{
            name: "Patient Care Records",
            data: [25, 10, 5, 10, 6, 1, 5]
        }],
        options: {
            chart: { type: "line", height: 350 },
            xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
            colors: ["#E42424"],
            stroke: { curve: "straight" },
        }
    });

    const [pieChartData, setPieChartData] = useState({
        series: [10, 15, 20, 25, 30, 40, 50],  // Data values for each category
        options: {
            chart: { type: "pie", height: 350 },
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],  // Pie chart labels
            colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#8E44AD", "#E74C3C", "#2E86C1"],
            legend: { position: "bottom" }
        }
    });

    
    const [barChartData, setBarChartData] = useState({
        series: [{
            name: "Active Services",
            data: [25, 10, 5, 30, 6, 30, 5]
        }],
        options: {
            chart: { type: "bar", height: 350 },
            xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
            colors: ["#2196F3"],
        }
    });

    return (
        <main id="main" className="main">
            <div className="content">
                <h1>Dashboard</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a>Admin</a></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div>
            <hr />

            
            <div className="container-fluid">
                <section className="section dashboard">
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
                                        Hospital Bill
                                        <span> | Today</span>
                                    </h5><br/>
                                    <div className="d-flex align-items-center">
                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <img src="../../assets/img/med_logo.png" alt="1" className="dashboardSymbols"/>
                                        </div>
                                        <div className="ps-3"> 
                                            <div className="ps-3">
                                                <h6 id="dashboardAmounts">₱ 5,000</h6>
                                                <span className="text-muted small pt-2 ps-1">total amount of beneficiaries</span>
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
                                    <h5 className="card-title">Burial Assistance <span>| Today</span></h5>
                                    <br/>
                                    <div className="d-flex align-items-center">
                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <img src="../../assets/img/burial_icon.png" alt="1" className="dashboardSymbols" />
                                        </div>
                                        <div className="ps-3">
                                            <h6 id="dashboardAmounts">₱ 5,000</h6>
                                            <span className="text-muted small pt-2 ps-1">total amount of beneficiaries</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4">
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
                                    <h5 className="card-title">Financial Assistance <span>| Today</span></h5>
                                    <br/>
                                    <div className="d-flex align-items-center">
                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"> 
                                            <img src="../../assets/img/financial_icon.jpg" alt="1" className="dashboardSymbols" />
                                        </div>
                                        <div className="ps-3"> 
                                            <h6 id="dashboardAmounts"> ₱ 5,000</h6>
                                            <span className="text-muted small pt-2 ps-1">total amount of beneficiaries</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-12 ">
                            <br></br>
                        </div>
                        
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Patient Records Trend</h5>
                                    <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Active Services</h5>
                                    <Chart options={barChartData.options} series={barChartData.series} type="bar" height={350} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Patient Records Trend</h5>
                                    <Chart options={pieChartData.options} series={pieChartData.series} type="pie" height={350} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Active Services</h5>
                                    <Chart options={barChartData.options} series={barChartData.series} type="bar" height={350} />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
}

export default DashboardContent;