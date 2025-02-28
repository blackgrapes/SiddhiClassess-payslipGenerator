import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SignupPage from "./component/Signup";
import ForgotPassword from "./component/ForgotPassword";
import Home from "./component/Home";
import AddStudent from "./component/AddStudent";
import StudentList from "./component/StudentList";
import StudentPayslip from "./component/StudentPayslip";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  return (
    <Router> {/* ✅ BrowserRouter added here */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/StudentList" element={<StudentList />} />
        <Route path="/StudentPayment/:rollNumber" element={<StudentPayslip />} />
      </Routes>
    </Router>
  );
}

export default App;
