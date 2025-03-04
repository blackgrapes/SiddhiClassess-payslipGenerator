import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import logo from "../assets/colorlogo.svg"; // ✅ Logo Import


const API_URL = import.meta.env.VITE_APP_URL;

const TeacherList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/teacher/all`);
      setTeachers(response.data);
      setFilteredTeachers(response.data);
    } catch (error) {
      setError("Failed to fetch teacher data.");
    } finally {
      setLoading(false);
    }
  };

  // Search Function
  const handleSearch = () => {
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.includes(searchTerm)
    );
    setFilteredTeachers(filtered);
  };

  // Delete Teacher
  const handleDelete = async (email) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`${API_URL}/teacher/${email}/delete`);

        // Update the state properly
        setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.email !== email));
        setFilteredTeachers((prevFiltered) => prevFiltered.filter((teacher) => teacher.email !== email));

        alert("Teacher deleted successfully!");
      } catch (error) {
        alert("Failed to delete teacher.");
      }
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#69360d", minHeight: "100vh" }}>
      
      {/* ✅ Sidebar */}
      <div style={{ width: "320px", backgroundColor: "#492105", minHeight: "100vh" }}>
        <Sidebar />
      </div>

      {/* ✅ Main Content */}
      <div className="container-fluid p-4" style={{ backgroundColor: "#e3dcc2", flexGrow: 1 }}>
        <div className="p-4 rounded shadow-lg" style={{ backgroundColor: "white" }}>

          {/* ✅ LOGO + Siddhi Classes (Brown Background) */}
          <div className="text-center p-3 rounded" style={{ backgroundColor: "#69360d" }}>
            <img src={logo} alt="Siddhi Classes Logo" style={{ height: "60px", marginBottom: "10px" }} />
            <h2 className="text-white">TEACHER LIST</h2>
          </div>

          {/* ✅ Search Bar and Add Teacher Button */}
          <div className="d-flex justify-content-between mb-3 mt-3">
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search by Name, Email, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>
            <Button variant="success" onClick={() => navigate("/AddTeacher")}>
              Add Teacher
            </Button>
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
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No teachers found.
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((teacher, index) => (
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
                            onClick={() => navigate(`/editTeacher/${teacher.email}`)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="danger" // 🔴 Changed to Red
                            size="sm"
                            onClick={() => handleDelete(teacher.email)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
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
