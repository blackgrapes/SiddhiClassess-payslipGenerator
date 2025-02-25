import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SignupPage from "./component/Signup";
import ForgotPassword from "./component/ForgotPassword"; // ✅ Import ForgotPassword
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Forgot Password Route */}
      </Routes>
    </Router>
  );
}

export default App;
