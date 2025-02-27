import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SignupPage from "./component/Signup";
import ForgotPassword from "./component/ForgotPassword";
import Home from "./component/Home";
import Sidebar from "./component/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  return (
    <Router>
      {/* <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4" style={{ backgroundColor: "#4D220E", minHeight: "100vh" }}> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/Home" element={<Home />} />
          </Routes>
        {/* </div>
      </div> */}
    </Router>
  );
}

export default App;