import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SignupPage = () => {
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
          style={{
            backgroundColor: "#69360d",
            padding: "20px 0",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <img src="/logo.png" alt="logo" style={{ width: "40px" }} />
          <h4 className="text-white mt-2">Siddhi Classess</h4>
        </div>
        <h5 className="text-center mb-3">Create New Account</h5>
        <form>
          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="Name" />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Surname" />
            </div>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="City" />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Username" />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" />
          </div>
          <button className="btn btn-dark w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
