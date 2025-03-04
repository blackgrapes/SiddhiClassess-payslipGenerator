import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/colorlogo.svg";


const API_URL = import.meta.env.VITE_APP_URL;


const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(data.message || "Signup failed");

      setMessage("Signup successful! Redirecting to login... 🎉");
      setFormData({ name: "", email: "", dob: "", password: "" });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage(error.message || "An error occurred.");
    }

    setLoading(false);
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
        {/* Colored Header with Logo Inside */}
        <div
          className="text-center p-4"
          style={{
            backgroundColor: "#69360d",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "100px" }} />
        </div>

        <h5 className="text-center mb-3">Create New Account</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-dark w-100" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {message && <p className="text-center mt-3 text-danger">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
