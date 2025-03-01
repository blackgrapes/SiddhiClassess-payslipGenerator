import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "./Sidebar";

const EditStudent = () => {
  const { rollNumber } = useParams(); // Get student roll number from URL params
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    class: "",
    phone: "",
    totalFees: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/student/${rollNumber}`)
      .then((response) => {
        setStudent(response.data);
      })
      .catch(() => {
        setError("Failed to fetch student details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rollNumber]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/student/${rollNumber}`, student)
      .then(() => {
        alert("Student details updated successfully!");
        navigate("/StudentList");
      })
      .catch(() => {
        setError("Failed to update student.");
      });
  };

  return (
    <div className="d-flex" style={{ backgroundColor: "#69360d", minHeight: "100vh" }}>
      <div style={{ width: "320px", backgroundColor: "#492105", minHeight: "100vh" }}>
        <Sidebar />
      </div>
      <Container className="py-4" style={{ backgroundColor: "#e3dcc2", flexGrow: 1 }}>
        <Card className="p-4 shadow-lg">
          <Card.Header className="text-white text-center" style={{ backgroundColor: "#69360d" }}>
            <h2>Edit Student Details</h2>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
                <p>Loading student details...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={student.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Roll Number (Read-Only)</Form.Label>
                  <Form.Control type="text" value={student.rollNumber} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Control
                    type="text"
                    name="class"
                    value={student.class}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={student.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Fees</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalFees"
                    value={student.totalFees}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate("/StudentList")}>Cancel</Button>
                  <Button variant="primary" type="submit">Update Student</Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EditStudent;
