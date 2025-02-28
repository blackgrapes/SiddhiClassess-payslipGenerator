import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const TeacherPayslip = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [payPeriod, setPayPeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  const fetchTeacherDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/teacher/${teacherId}`);
      setTeacher(res.data);
      setPayslips(res.data.payslips || []);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      setMessage("❌ Failed to fetch teacher details.");
    } finally {
      setFetching(false);
    }
  };

  const generatePDF = () => {
    if (!teacher || payslips.length === 0) {
      setMessage("❌ Cannot generate PDF. Missing teacher details or payslips.");
      return;
    }
    
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;
    pdf.setFont("times", "bold");
    pdf.setFontSize(18);
    pdf.text("Teacher Payslip", 85, y);
    y += 12;
    pdf.setFontSize(12);
    pdf.text(`Name: ${teacher.name}`, 15, y);
    pdf.text(`Designation: ${teacher.designation}`, 120, y);
    y += 7;
    pdf.text(`Email: ${teacher.email}`, 15, y);
    pdf.text(`Phone: ${teacher.phone}`, 120, y);
    y += 7;
    pdf.text(`Date of Joining: ${new Date(teacher.dateOfJoining).toLocaleDateString()}`, 15, y);
    y += 10;

    pdf.setFont("times", "bold");
    pdf.text("Payslip History", 15, y);
    y += 8;
    pdf.setFont("times", "normal");

    payslips.forEach((payslip, index) => {
      pdf.text(
        `${index + 1}. ${payslip.payPeriod} | Net Pay: ₹${payslip.netPay} | Paid on: ${new Date(payslip.payDate).toLocaleDateString()}`,
        15,
        y
      );
      y += 7;
    });
    pdf.save(`Teacher_Payslip_${teacher.name}.pdf`);
  };

  return (
    <div className="container mt-4">
      <h3>Teacher Payslip</h3>

      {fetching ? (
        <p>Loading teacher details...</p>
      ) : teacher ? (
        <div className="card p-3 mt-3">
          <h5>Teacher Details</h5>
          <p><strong>Name:</strong> {teacher.name}</p>
          <p><strong>Designation:</strong> {teacher.designation}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Phone:</strong> {teacher.phone}</p>
          <p><strong>Date of Joining:</strong> {new Date(teacher.dateOfJoining).toLocaleDateString()}</p>
          
          <button className="btn btn-primary mt-3" onClick={generatePDF}>
            📄 Download PDF
          </button>
        </div>
      ) : (
        <p>❌ Teacher not found.</p>
      )}

      {message && <p className="mt-2 text-info">{message}</p>}
    </div>
  );
};

export default TeacherPayslip;
