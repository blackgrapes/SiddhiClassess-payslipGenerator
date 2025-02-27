import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_APP_URL;

const StudentDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [totalFees, setTotalFees] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const studentData = { name, email, phone, rollNumber, class: studentClass, admissionDate, totalFees };

    try {
      await axios.post("http://localhost:5000/student/add", studentData);
      setMessage("✅ Student added successfully!");

      // ✅ Individually fields ko clear kiya
      setName("");
      setEmail("");
      setPhone("");
      setRollNumber("");
      setStudentClass("");
      setAdmissionDate("");
      setTotalFees("");
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex" style={{ height: "100vh", background: "linear-gradient(to bottom, #69360d, #e3dcc2)" }}>
      
      {/* ✅ Sidebar - Fixed Height & No Scroll */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#4a1e08",
          boxShadow: "4px 0 10px rgba(0,0,0,0.2)",
          height: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar />
      </div>

      {/* ✅ Dashboard Content */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-4">
        <div className="bg-light p-5 rounded" style={{ width: "1000px", boxShadow: "0 6px 12px rgba(0,0,0,0.2)" }}>
          
          <h3 className="text-center mb-4 text-dark">Add New Student</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Name</label>
                <input type="text" className="form-control border-dark" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input type="email" className="form-control border-dark" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone</label>
                <input type="text" className="form-control border-dark" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Roll Number</label>
                <input type="text" className="form-control border-dark" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Class</label>
                <input type="text" className="form-control border-dark" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Admission Date</label>
                <input type="date" className="form-control border-dark" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Total Fees</label>
                <input type="text" className="form-control border-dark" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} required />
              </div>
            </div>

            {/* ✅ Submit Button with Spinner during Loading */}
            <button className="btn btn-dark w-100 py-2" type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Add Student"}
            </button>

            {/* ✅ Message Alert */}
            {message && (
              <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
                {message}
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
