import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/colorlogo.svg"; // ✅ Logo import

const ForgotPassword = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to bottom, #69360d, #e3dcc2)" }}
    >
      <div
        className="bg-light p-4 rounded"
        style={{ width: "400px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
      >
        {/* ✅ Header with Logo */}
        <div
          className="text-center position-relative mb-3"
          style={{
            backgroundColor: "#69360d",
            padding: "20px 0",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <img
            src={logo} // ✅ Using imported logo
            alt="Siddhi Classes Logo"
            className="mb-2"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <h4 className="text-white mt-2">Siddhi Classes</h4>
        </div>

        <h5 className="text-center mb-3">Reset Your Password</h5>

        {/* ✅ Forgot Password Form */}
        <form>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email ID" required />
          </div>

          <div className="mb-3">
            <input type="date" className="form-control" required />
          </div>

          <div className="mb-3">
            <input type="password" className="form-control" placeholder="New Password" required />
          </div>

          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Confirm New Password" required />
          </div>

          <button className="btn btn-dark w-100">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
