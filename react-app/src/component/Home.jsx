import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are imported

const Home = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ minWidth: "50px" }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#5B2A0F", minHeight: "100vh" }}>
        <Container fluid>
          {/* Top Bar */}
          <Row className="mb-4 align-items-center">
            <Col className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "#E7D9B7", padding: "10px", borderRadius: "10px" }}>
              <h4 className="fw-bold">Siddhi Classes</h4>
              <div>
                <input type="text" placeholder="Search" className="form-control d-inline-block w-auto" />
                <Button variant="light" className="ms-2">
                  <i className="bi bi-envelope"></i>
                </Button>
                <Button variant="light" className="ms-2">
                  <i className="bi bi-bell"></i>
                </Button>
                <Button variant="light" className="ms-2">
                  <i className="bi bi-person-circle"></i>
                </Button>
              </div>
            </Col>
          </Row>

          {/* Main Section */}
          <Row className="justify-content-center align-items-center text-center" style={{ backgroundColor: "#8C4A2F", borderRadius: "15px", padding: "30px", color: "#fff" }}>
            <Col md={5}>
              <Button variant="light" className="w-100 py-3 mb-3 fw-bold" style={{ borderRadius: "10px" }}>
                Teacher
              </Button>
            </Col>
            <Col md={5}>
              <Button variant="light" className="w-100 py-3 fw-bold" style={{ borderRadius: "10px" }}>
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
