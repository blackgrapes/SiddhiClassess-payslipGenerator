import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const AddTeacher = () => {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post("http://localhost:5000/teacher/add", teacher);
      setMessage({ text: "✅ Teacher added successfully!", type: "success" });

      // Reset form
      setTeacher({
        name: "",
        email: "",
        phone: "",
        designation: "",
        dateOfJoining: "",
        salary: "",
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
      setMessage({
        text: error.response?.data?.message || "❌ Something went wrong!",
        type: "danger",
      });
    }

    setLoading(false);
  };

  return (
    <div className="d-flex" style={{ height: "100vh", background: "linear-gradient(to bottom, #69360d, #e3dcc2)" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#4a1e08",
          boxShadow: "4px 0 10px rgba(0,0,0,0.2)",
          height: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-4">
        <div className="bg-light p-5 rounded" style={{ width: "1000px", boxShadow: "0 6px 12px rgba(0,0,0,0.2)" }}>
          <h3 className="text-center mb-4 text-dark">Add New Teacher</h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              {[
                { label: "Name", type: "text", name: "name" },
                { label: "Email", type: "email", name: "email" },
                { label: "Phone", type: "text", name: "phone" },
                { label: "Designation", type: "text", name: "designation" },
                { label: "Date of Joining", type: "date", name: "dateOfJoining" },
                { label: "Salary", type: "number", name: "salary" },
              ].map((field, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <label className="form-label fw-bold">{field.label}</label>
                  <input
                    type={field.type}
                    className="form-control border-dark"
                    name={field.name}
                    value={teacher[field.name]}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            {/* Submit Button with Spinner during Loading */}
            <button className="btn btn-dark w-100 py-2" type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Add Teacher"}
            </button>

            {/* Message Alert */}
            {message.text && (
              <div className={`alert mt-3 alert-${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
