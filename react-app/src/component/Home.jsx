import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are imported

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ minWidth: "50px" }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#5B2A0F", minHeight: "100vh" }}>
        <Container fluid>
          {/* Top Bar (Only Title Now) */}
          <Row className="mb-4">
            <Col className="text-center" style={{ backgroundColor: "#E7D9B7", padding: "15px", borderRadius: "10px" }}>
              <h4 className="fw-bold">Siddhi Classes</h4>
            </Col>
          </Row>

          {/* Main Section */}
          <Row
            className="justify-content-center align-items-center text-center mt-5"
            style={{ backgroundColor: "#8C4A2F", borderRadius: "15px", padding: "50px 30px", color: "#fff" }}
          >
            <Col md={5} className="mb-3">
              <Button
                variant="light"
                className="w-100 py-3 fw-bold"
                style={{ borderRadius: "10px" }}
                onClick={() => navigate("/teacher")}
              >
                Teacher
              </Button>
            </Col>
            <Col md={5} className="mb-3">
              <Button
                variant="light"
                className="w-100 py-3 fw-bold"
                style={{ borderRadius: "10px" }}
                onClick={() => navigate("/studentlist")}
              >
                Student
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;