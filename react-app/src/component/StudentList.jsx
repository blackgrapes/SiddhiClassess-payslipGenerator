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
  const [searchQuery, setSearchQuery] = useState("");
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
              (sum, payment) => (payment.status === "Paid" ? sum + payment.amount : sum),
              0
            );
            return {
              ...student,
              feesPaid: totalPaid,
              pendingFees: student.totalFees - totalPaid,
            };
          } catch (error) {
            console.error("Error fetching payment details for", student.rollNumber, error);
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

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="d-flex" style={{ backgroundColor: "#69360d", minHeight: "100vh" }}>
      <div style={{ width: "320px", backgroundColor: "#492105", minHeight: "100vh" }}>
        <Sidebar />
      </div>

      <div className="container-fluid p-4" style={{ backgroundColor: "#e3dcc2", flexGrow: 1 }}>
        <div className="p-4 rounded shadow-lg" style={{ backgroundColor: "white" }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="text-white p-3 rounded text-center" style={{ backgroundColor: "#69360d", width: "100%" }}>
              Siddhi Classes - Student List
            </h2>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => navigate("/AddStudent")}
              className="btn btn-primary btn-sm px-3 py-1 shadow-sm"
            >
              Add Student
            </button>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No students found</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.rollNumber}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.class}</td>
                      <td>{student.phone}</td>
                      <td>₹{student.totalFees}</td>
                      <td>₹{student.feesPaid}</td>
                      <td>₹{student.pendingFees}</td>
                      <td>
                        <Link to={`/StudentPayment/${student.rollNumber}`} className="btn btn-sm btn-primary me-2">
                          Payment Slip
                        </Link>
                        <Link to={`/Editstudent/${student.rollNumber}`} className="btn btn-sm btn-primary me-2">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(student.rollNumber)} className="btn btn-sm btn-primary">
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
