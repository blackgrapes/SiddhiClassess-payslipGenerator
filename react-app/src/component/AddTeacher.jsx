import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";

const AddTeacher = () => {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;
      setTeacher((prev) => ({ ...prev, [name]: value }));
    } catch (err) {
      console.error("Error in handleChange:", err);
      setError("Something went wrong while updating the form.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log("Teacher Data Submitted:", teacher);
      alert("Teacher Added Successfully!");
      setTeacher({
        name: "",
        email: "",
        phone: "",
        designation: "",
        dateOfJoining: "",
        salary: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#69360d", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#e3dcc2", minHeight: "100vh" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <h3 className="mb-4 text-center text-white">Add Teacher</h3>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded" style={{ backgroundColor: "#fff" }}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={teacher.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={teacher.email} onChange={handleChange} required />
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
                  <Form.Label>Date of Joining</Form.Label>
                  <Form.Control type="date" name="dateOfJoining" value={teacher.dateOfJoining} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control type="number" name="salary" value={teacher.salary} onChange={handleChange} required />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">
                  Add Teacher
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AddTeacher;
