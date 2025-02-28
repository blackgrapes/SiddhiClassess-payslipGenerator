import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // ✅ Sidebar component properly imported

const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/student/`)
      .then(async (response) => {
        const studentData = await Promise.all(
          response.data.map(async (student) => {
            try {
              const paymentResponse = await axios.get(`${API_URL}/student/${student.rollNumber}/payments`);
              const totalPaid = paymentResponse.data.payments.reduce(
                (sum, payment) => (payment.status === "Paid" ? sum + payment.amount : sum),
                0
              );
              return { ...student, feesPaid: totalPaid, pendingFees: student.totalFees - totalPaid };
            } catch (error) {
              console.error("Error fetching payment details for", student.rollNumber, error);
              return { ...student, feesPaid: 0, pendingFees: student.totalFees };
            }
          })
        );
        setStudents(studentData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setError("Failed to fetch student data. Try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ marginLeft: "260px" }}>
        <div className="bg-light p-4 rounded shadow-lg">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-white p-3 rounded" style={{ backgroundColor: "#69360d" }}>
              Siddhi Classes - Student List
            </h2>
            <button onClick={() => navigate("/AddStudent")} className="btn btn-primary">+ Add Student</button>
          </div>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="text-white" style={{ backgroundColor: "#69360d" }}>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Class</th>
                  <th>Phone Number</th>
                  <th>Total Fees</th>
                  <th>Fees Paid</th>
                  <th>Pending Fees</th>
                  <th>Payment Slip</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">No students found</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.rollNumber}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.class}</td>
                      <td>{student.phone}</td>
                      <td>₹{student.totalFees}</td>
                      <td>₹{student.feesPaid}</td>
                      <td>₹{student.pendingFees}</td>
                      <td>
                        <Link to={`/StudentPayment/${student.rollNumber}`} className="btn btn-sm btn-info">
                          Payment Slip
                        </Link>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success">Download</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
