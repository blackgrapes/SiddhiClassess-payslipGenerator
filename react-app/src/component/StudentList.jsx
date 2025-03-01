import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/student/`);
      const studentData = await Promise.all(
        response.data.map(async (student) => {
          try {
            const paymentResponse = await axios.get(
              `${API_URL}/student/${student.rollNumber}/payments`
            );
            const totalPaid = paymentResponse.data.payments.reduce(
              (sum, payment) =>
                payment.status === "Paid" ? sum + payment.amount : sum,
              0
            );
            return {
              ...student,
              feesPaid: totalPaid,
              pendingFees: student.totalFees - totalPaid,
            };
          } catch (error) {
            console.error(
              "Error fetching payment details for",
              student.rollNumber,
              error
            );
            return {
              ...student,
              feesPaid: 0,
              pendingFees: student.totalFees,
            };
          }
        })
      );
      setStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch student data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rollNumber) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/student/${rollNumber}`);
      setStudents(students.filter((student) => student.rollNumber !== rollNumber));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#69360d", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "320px", backgroundColor: "#492105", minHeight: "100vh" }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ backgroundColor: "#e3dcc2", flexGrow: 1 }}>
        <div className="p-4 rounded shadow-lg" style={{ backgroundColor: "white" }}>
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="text-white p-3 rounded text-center" style={{ backgroundColor: "#69360d", width: "100%" }}>
              Siddhi Classes - Student List
            </h2>
            <button
              onClick={() => navigate("/AddStudent")}
              className="btn btn-success btn-sm px-3 py-1 shadow-sm"
              style={{ fontWeight: "bold", borderRadius: "4px", transition: "0.3s" }}
            >
              Add Student
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {/* Student Table */}
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
                  <th>Actions</th>
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
                        {/* Payment Slip Button */}
                        <Link to={`/StudentPayment/${student.rollNumber}`} className="btn btn-sm btn-info me-2">
                          Payment Slip
                        </Link>

                        {/* Edit Button */}
                        <Link
                          to={`/Editstudent/${student.rollNumber}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Edit
                         
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(student.rollNumber)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
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
