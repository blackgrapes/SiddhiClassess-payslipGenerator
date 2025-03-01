import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Submitted");

    // 🔹 Authentication Logic (API call ya local validation)
    navigate("/Home");
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
        {/* Header (Logo Removed) */}
        <div
          className="text-center position-relative mb-3"
          style={{
            backgroundColor: "#69360d",
            padding: "20px 0",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <h4 className="text-white mt-2">Login</h4>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input type="email" className="form-control" placeholder="Email ID" required />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input type="password" className="form-control" placeholder="Password" required />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="d-flex justify-content-between mb-3">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="ms-2">Remember me</label>
            </div>
            <button
              type="button"
              className="btn btn-link text-dark p-0"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-dark w-100">
            LOGIN
          </button>

          {/* Create Account */}
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
