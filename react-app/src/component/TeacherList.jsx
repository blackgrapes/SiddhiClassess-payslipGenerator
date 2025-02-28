import React from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const TeacherList = () => {
  const navigate = useNavigate();

  const teachers = [
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "9876543210",
      designation: "Mathematics Teacher",
      salary: "₹50,000",
      paidUpto: "March 2025",
    },
    {
      id: 2,
      name: "Sunita Verma",
      email: "sunita.verma@example.com",
      phone: "9876543211",
      designation: "Science Teacher",
      salary: "₹48,000",
      paidUpto: "March 2025",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "9876543212",
      designation: "English Teacher",
      salary: "₹52,000",
      paidUpto: "March 2025",
    },
    {
      id: 4,
      name: "Neha Singh",
      email: "neha.singh@example.com",
      phone: "9876543213",
      designation: "History Teacher",
      salary: "₹47,000",
      paidUpto: "March 2025",
    },
    {
      id: 5,
      name: "Manoj Tiwari",
      email: "manoj.tiwari@example.com",
      phone: "9876543214",
      designation: "Physics Teacher",
      salary: "₹55,000",
      paidUpto: "March 2025",
    },
  ];

  return (
    <div className="d-flex" style={{ backgroundColor: "#69360d", minHeight: "100vh" }}>
      {/* Sidebar - Fix for Layout */}
      <div style={{ width: "320px", backgroundColor: "#492105", minHeight: "100vh" }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ backgroundColor: "#e3dcc2", flexGrow: 1 }}>
        <div className="p-4 rounded shadow-lg" style={{ backgroundColor: "white" }}>
          {/* Header with "+ Add Teacher" Button */}
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

            {/* Smaller & Professional Add Teacher Button */}
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
              + Add
            </button>
          </div>

          {/* Teacher Table */}
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
                  <th>Paid Upto</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher, index) => (
                  <tr key={teacher.id}>
                    <td>{index + 1}</td>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone}</td>
                    <td>{teacher.designation}</td>
                    <td>{teacher.salary}</td>
                    <td>{teacher.paidUpto}</td>
                    <td>
                      <Button variant="success" size="sm">Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
