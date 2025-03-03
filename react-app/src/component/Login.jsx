import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../assets/colorlogo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful", data);
      navigate("/home"); // Redirect to home page
    } catch (error) {
      setError(error.message || "An error occurred during login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#f4f4f4" }}>
      <div className="bg-light p-4 rounded" style={{ width: "400px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
        <div className="text-center position-relative mb-3" style={{ backgroundColor: "#69360d", padding: "20px 0", borderRadius: "10px 10px 0 0" }}>
          <img src={logo} alt="Logo" style={{ width: "100px", position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)" }} />
          <h4 className="text-white mt-2">Login</h4>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text"><FaUser /></span>
            <input type="email" className="form-control" placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text"><FaLock /></span>
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="d-flex justify-content-between mb-3">
            <button type="button" className="btn btn-link text-dark p-0" onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
          </div>

          <button type="submit" className="btn btn-dark w-100">LOGIN</button>

          <div className="text-center mt-3">
            <button className="btn btn-link text-dark" style={{ textDecoration: "underline" }} onClick={() => navigate("/signup")}>Create account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;