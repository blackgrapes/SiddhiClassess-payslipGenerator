import React from "react";
import { Nav, Button } from "react-bootstrap";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column vh-100 p-3" style={{ width: "250px", backgroundColor: "#E7D9B7" }}>
      {/* Logo Section */}
      <div className="d-flex align-items-center mb-4">
        <FaChalkboardTeacher size={28} className="text-dark" />
        <span className="ms-2 fw-bold text-dark fs-4">Siddhi Classes</span>
      </div>

      {/* Navigation Links */}
      <Nav className="flex-column">
        <Link to="/add1" className="text-decoration-none">
          <Button className="mb-3 text-light w-100" style={{ backgroundColor: "#5B2A0F", border: "none" }}>
            ADD
          </Button>
        </Link>
        <Link to="/add2" className="text-decoration-none">
          <Button className="mb-3 text-light w-100" style={{ backgroundColor: "#5B2A0F", border: "none" }}>
            ADD
          </Button>
        </Link>
        <Link to="/info" className="text-decoration-none">
          <Button className="mb-3 text-light w-100" style={{ backgroundColor: "#5B2A0F", border: "none" }}>
            Information
          </Button>
        </Link>
        <Link to="/attendance" className="text-decoration-none">
          <Button className="mb-3 text-light w-100" style={{ backgroundColor: "#5B2A0F", border: "none" }}>
            ATTENDANCE
          </Button>
        </Link>
      </Nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <Link to="/logout" className="text-decoration-none">
          <Button className="w-100 text-light" style={{ backgroundColor: "#5B2A0F", border: "none" }}>
            LOGOUT
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
