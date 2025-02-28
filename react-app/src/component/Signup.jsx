import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const URL = import.meta.env.VITE_APP_URL; // ✅ Ensure this is correctly set in .env file

const SignupPage = () => {
  // ✅ State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
  });

  // ✅ State for loading & error
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setMessage("");

    try {
      const response = await fetch(`${URL}/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
        }),
      });

      // ✅ Read response text first to avoid JSON parsing error
      const text = await response.text();
      const data = text ? JSON.parse(text) : {}; // If empty, return empty object

      if (!response.ok) throw new Error(data.message || "Signup failed");

      setMessage("Signup successful! 🎉");
      setFormData({ name: "", email: "", dob: "", password: "" });
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
        {/* ✅ Logo & Header */}
        <div
          className="text-center position-relative mb-3"
          style={{
            backgroundColor: "#69360d",
            padding: "20px 0",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <img src="/logo.png" alt="logo" style={{ width: "40px" }} />
          <h4 className="text-white mt-2">Siddhi Classes</h4>
        </div>

        <h5 className="text-center mb-3">Create New Account</h5>

        {/* ✅ Signup Form */}
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

          {/* ✅ Date of Birth Input */}
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

          {/* ✅ Submit Button */}
          <button className="btn btn-dark w-100" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* ✅ Message Box */}
          {message && <p className="text-center mt-3 text-danger">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
