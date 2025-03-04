import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../assets/colorlogo.svg";

const API_URL = import.meta.env.VITE_APP_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      console.log("Login successful", data);
      navigate("/home");
    } catch (error) {
      setError(error.message || "An error occurred during login");
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
        style={{
          width: "400px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        {/* Colored Header with Logo Inside */}
        <div
          className="text-center mb-3 p-4"
          style={{
            backgroundColor: "#69360d",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "100px" }} />
        </div>

        <h5 className="text-center mb-3">LOGIN</h5>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-between mb-3">
            <button
              type="button"
              className="btn btn-link text-dark p-0"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <div className="text-center mt-3">
            <button
              className="btn btn-link text-dark"
              style={{ textDecoration: "underline" }}
              onClick={() => navigate("/signup")}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
