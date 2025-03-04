import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_URL;

const EditTeacher = () => {
  const navigate = useNavigate();
  const { email } = useParams(); // Get teacher's email from URL params
  const [teacher, setTeacher] = useState({
    name: "",
    phone: "",
    designation: "",
    salary: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch teacher details on mount
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${API_URL}/teacher/${email}`);
        setTeacher({
          name: response.data.name,
          phone: response.data.phone,
          designation: response.data.designation,
          salary: response.data.salary,
        });
      } catch (error) {
        setError("Failed to fetch teacher details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [email]);

  // Handle form input changes
  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await axios.put(`${API_URL}/teacher/${email}/update`, teacher);
      setSuccess(true);
      setTimeout(() => navigate("/TeacherList"), 1000);
    } catch (error) {
      setError("Failed to update teacher.");
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
        <div className="p-4 rounded shadow-lg bg-white">
          <h2 className="text-white p-3 rounded text-center" style={{ backgroundColor: "#69360d" }}>
            Edit Teacher Details
          </h2>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading teacher details...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={teacher.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email (Read-Only)</Form.Label>
                <Form.Control type="email" value={email} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={teacher.phone} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control type="text" name="designation" value={teacher.designation} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control type="number" name="salary" value={teacher.salary} onChange={handleChange} required />
              </Form.Group>

              {success && <Alert variant="success">Teacher details updated successfully!</Alert>}

              {/* Buttons */}
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate("/TeacherList")}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Teacher
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTeacher;
