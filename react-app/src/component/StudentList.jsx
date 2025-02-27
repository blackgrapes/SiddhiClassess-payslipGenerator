import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000"; // ✅ Default API URL rakha

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/students`)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setError("Failed to fetch student data. Try again later."); // ✅ Sirf actual API error show hoga
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: "linear-gradient(to bottom, #69360d, #e3dcc2)", padding: "30px" }}
    >
      <div className="container bg-light p-4 rounded shadow-lg">
        <h2 className="text-center mb-4 text-white p-3 rounded" style={{ backgroundColor: "#69360d" }}>
          Siddhi Classes - Student List
        </h2>

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
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No students found</td>
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
  );
};

export default StudentList;
