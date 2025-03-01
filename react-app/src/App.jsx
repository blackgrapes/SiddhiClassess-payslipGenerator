import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SignupPage from "./component/Signup";
import ForgotPassword from "./component/ForgotPassword";
import Home from "./component/Home";
import AddStudent from "./component/AddStudent";
import StudentList from "./component/StudentList";
import StudentPayslip from "./component/StudentPayslip";
import AddTeacher from "./component/AddTeacher";
import EditTeacher from "./component/EditTeacher";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import TeacherList from "./component/TeacherList";
import TeacherPayslip from "./component/TeacherPayslip";
import Editstudent from "./component/Editstudent";



function App() {
  return (
    <Router> {/* ✅ BrowserRouter added here */}
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/StudentList" element={<StudentList />} />
        <Route path="/teacherList" element={<TeacherList />} />
        <Route path="/StudentPayment/:rollNumber" element={<StudentPayslip/>} />
        <Route path="/addteacher" element={<AddTeacher/>} />
        <Route path="/TeacherPayslip/:email" element={<TeacherPayslip/>} />
        <Route path="/Editstudent/:rollNumber" element={<Editstudent/>} />
        <Route path="/editTeacher/:email" element={<EditTeacher />} /> 
      </Routes>
    </Router>
  );
}

export default App;
