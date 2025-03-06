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
import PrivateRoute from "./component/PrivateRoute"; // ✅ Import updated PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private Routes */}
        <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/AddStudent" element={<PrivateRoute element={<AddStudent />} />} />
        <Route path="/StudentList" element={<PrivateRoute element={<StudentList />} />} />
        <Route path="/teacherList" element={<PrivateRoute element={<TeacherList />} />} />
        <Route path="/StudentPayment/:rollNumber" element={<PrivateRoute element={<StudentPayslip />} />} />
        <Route path="/addteacher" element={<PrivateRoute element={<AddTeacher />} />} />
        <Route path="/TeacherPayslip/:email" element={<PrivateRoute element={<TeacherPayslip />} />} />
        <Route path="/Editstudent/:rollNumber" element={<PrivateRoute element={<Editstudent />} />} />
        <Route path="/editTeacher/:email" element={<PrivateRoute element={<EditTeacher />} />} />
      </Routes>
    </Router>
  );
}

export default App;
