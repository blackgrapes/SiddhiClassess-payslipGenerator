import React from "react";
import { Nav, Button } from "react-bootstrap";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  return (
    <div className="d-flex flex-column vh-100 p-3" style={{ width: "250px", backgroundColor: "#E7D9B7" }}>
      {/* Logo Section */}
      <div className="d-flex align-items-center mb-4">
        <FaChalkboardTeacher size={28} className="text-dark" />
        <span className="ms-2 fw-bold text-dark fs-4">Siddhi Classes</span>
      </div>

      {/* Navigation Links */}
      <Nav className="flex-column">
        <Button
          className="mb-3 text-light w-100"
          style={{ backgroundColor: "#5B2A0F", border: "none" }}
          onClick={() => navigate("/AddStudent")} // ✅ Navigate on click
        >
          ADD STUDENT
        </Button>
        <Button
          className="mb-3 text-light w-100"
          style={{ backgroundColor: "#5B2A0F", border: "none" }}
          onClick={() => navigate("/studentlist")}
        >
          STUDENT LIST
        </Button>
        <Button
          className="mb-3 text-light w-100"
          style={{ backgroundColor: "#5B2A0F", border: "none" }}
          onClick={() => navigate("/AddTeacher")}
        >
          ADD TEACHER
        </Button>
        <Button
          className="mb-3 text-light w-100"
          style={{ backgroundColor: "#5B2A0F", border: "none" }}
          onClick={() => navigate("/teacherList")}
        >
          TEACHER LIST
        </Button>
      </Nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <Button
          className="w-100 text-light"
          style={{ backgroundColor: "#5B2A0F", border: "none" }}
          onClick={() => navigate("/")} // ✅ Navigate on click
        >
          LOGOUT
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
