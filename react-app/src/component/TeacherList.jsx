import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const TeacherList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teachers from the backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/teacher/all");
        setTeachers(response.data);
      } catch (error) {
        setError("Failed to fetch teacher data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Delete Teacher Function
  const handleDelete = async (email) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:5000/teacher/delete/${email}`);
        setTeachers(teachers.filter((teacher) => teacher.email !== email));
      } catch (error) {
        alert("Failed to delete teacher.");
      }
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
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2
              className="text-white p-3 rounded"
              style={{
                backgroundColor: "#69360d",
                width: "100%",
                textAlign: "center",
              }}
            >
              Siddhi Classes - Teacher List
            </h2>

            <button
              onClick={() => navigate("/AddTeacher")}
              className="btn btn-success btn-sm px-3 py-1 shadow-sm"
              style={{
                fontWeight: "bold",
                borderRadius: "4px",
                transition: "0.3s",
                marginLeft: "auto",
              }}
            >
              Add Teacher
            </button>
          </div>

          {loading ? (
            <p>Loading teachers...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <Table bordered hover className="text-center">
                <thead className="text-white" style={{ backgroundColor: "#69360d" }}>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Payslip</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={teacher.email}>
                      <td>{index + 1}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phone}</td>
                      <td>{teacher.designation}</td>
                      <td>₹{teacher.salary}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/TeacherPayslip/${teacher.email}`)}
                        >
                          Payslip
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/UpdateTeacher/${teacher.email}`)}
                        >
                          Update
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDelete(teacher.email)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
