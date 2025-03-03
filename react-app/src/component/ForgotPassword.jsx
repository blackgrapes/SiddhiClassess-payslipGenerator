import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/colorlogo.svg";

const ForgotPassword = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    email: "",
    dob: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/admin/forgot-password", {
        email: formData.email,
        dob: formData.dob,
        newPassword: formData.newPassword,
      });

      setMessage(response.data.message);
      setError("");
      
      // Redirect to login page after success
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to bottom, #69360d, #e3dcc2)" }}
    >
      <div
        className="bg-light p-4 rounded"
        style={{ width: "400px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
      >
        <div
          className="text-center position-relative mb-3"
          style={{ backgroundColor: "#69360d", padding: "20px 0", borderRadius: "10px 10px 0 0" }}
        >
          <img
            src={logo}
            alt="Siddhi Classes Logo"
            className="mb-2"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <h4 className="text-white mt-2"></h4>
        </div>

        <h5 className="text-center mb-3">Reset Your Password</h5>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="date"
              name="dob"
              className="form-control"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="newPassword"
              className="form-control"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmNewPassword"
              className="form-control"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;