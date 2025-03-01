import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "./Sidebar";
const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const StudentPayslip = () => {
  const { rollNumber } = useParams();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, []);
  const fetchStudentDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/student/${rollNumber}`);
      setStudent(res.data);
      setPayments(res.data.payments || []);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setMessage("❌ Failed to fetch student details.");
    } finally {
      setFetching(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!amount || !month) {
      setMessage("❌ Please enter amount and select a month.");
      return;
    }

    setLoading(true);
    const payDate = new Date().toISOString();
    const formattedMonth = month.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    try {
      await axios.post(`${API_URL}/student/${rollNumber}/add-payment`, {
        amount: Number(amount),
        payDate,
        month: formattedMonth,
        status: "Paid",
      });

      setMessage("✅ Payment added successfully!");
      setAmount("");
      setMonth(null);
      fetchStudentDetails();
    } catch (error) {
      console.error("Error adding payment:", error);
      setMessage("❌ Error adding payment.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!student || payments.length === 0) {
      setMessage("❌ Cannot generate PDF. Missing student details or payments.");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;
    let y = 20;

    const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const remainingBalance = student.totalFees - totalPaid;

    pdf.setFont("times", "bold");
    pdf.setFontSize(18);
    pdf.text("Student Payslip", 85, y);
    y += 12;

    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    pdf.text("Coaching Institute Name", margin, y);
    y += 5;
    pdf.text("Address: XYZ, City, State, ZIP", margin, y);
    y += 5;
    pdf.text("Phone: 9876543210 | Email: info@coaching.com", margin, y);
    y += 10;

    pdf.setLineWidth(0.5);
    pdf.line(margin, y, 200, y);
    y += 10;

    pdf.setFont("times", "bold");
    pdf.setFontSize(14);
    pdf.text("Student Details", margin, y);
    y += 8;

    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    pdf.text(`Name: ${student.name}`, margin, y);
    pdf.text(`Roll Number: ${student.rollNumber}`, 120, y);
    y += 7;
    pdf.text(`Class: ${student.class}`, margin, y);
    pdf.text(`Phone: ${student.phone}`, 120, y);
    y += 7;
    pdf.text(`Total Fees: ₹${student.totalFees}`, margin, y);
    pdf.text(`Fees Paid: ₹${totalPaid}`, 120, y);
    y += 7;
    pdf.text(`Pending Fees: ₹${remainingBalance}`, margin, y);
    y += 10;

    pdf.setLineWidth(0.5);
    pdf.line(margin, y, 200, y);
    y += 10;

    pdf.setFont("times", "bold");
    pdf.setFontSize(14);
    pdf.text("Payment History", margin, y);
    y += 8;

    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    payments.forEach((payment, index) => {
      pdf.text(
        `${index + 1}. ${payment.month} - ₹${payment.amount} | ${payment.status} | ${new Date(payment.payDate).toLocaleDateString()}`,
        margin,
        y
      );
      y += 7;
    });

    pdf.save(`Student_Payslip_${student.rollNumber}.pdf`);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#e3dcc2", minHeight: "100vh" }}>
      <div className="row">
        {/* Fixed Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 position-fixed">
          <Sidebar />
        </div>
     
        {/* Main Content */}
        <div className="col-md-9 col-lg-10 offset-md-3 offset-lg-2 p-4">
          <h3 className="text-center" style={{ color: "#69360d" }}>Student Payslip</h3>

          {fetching ? (
            <p>Loading student details...</p>
          ) : student ? (
            <div className="card p-3 mt-3" style={{ backgroundColor: "#e3dcc2", border: "1px solid #69360d" }}>
              <h5 style={{ color: "#69360d" }}>Student Details</h5>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Roll Number:</strong> {student.rollNumber}</p>
              <p><strong>Class:</strong> {student.class}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Total Fees:</strong> ₹{student.totalFees}</p>
              <p><strong>Fees Paid:</strong> ₹{payments.reduce((sum, payment) => sum + Number(payment.amount), 0)}</p>
              <p><strong>Pending Fees:</strong> ₹{student.totalFees - payments.reduce((sum, payment) => sum + Number(payment.amount), 0)}</p>
              <button className="btn mt-3" style={{ backgroundColor: "#69360d", color: "#fff" }} onClick={generatePDF}>
                📄 Download PDF
              </button>
            </div>
          ) : (
            <p className="text-danger">❌ Student not found.</p>
          )}

          {/* Payment Form */}
          <form onSubmit={handleAddPayment} className="mt-3">
            <h5 style={{ color: "#69360d" }}>Add Payment</h5>
            <div className="mb-2">
              <label>Amount:</label>
              <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
            </div>
            <div className="mb-2">
              <label>Month:</label>
              <DatePicker selected={month} onChange={(date) => setMonth(date)} dateFormat="MMMM yyyy" showMonthYearPicker className="form-control" placeholderText="Select Month" required />
            </div>
            <button className="btn" style={{ backgroundColor: "#69360d", color: "#fff" }} type="submit" disabled={loading}>
              {loading ? "Processing..." : "Add Payment"}
            </button>
          </form>

          {/* Payment History */}
          <h4 className="mt-4" style={{ color: "#69360d" }}>Payment History</h4>
          <ul className="list-group">
            {payments.map((payment, index) => (
              <li key={index} className="list-group-item">{payment.month} - ₹{payment.amount} | {payment.status}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentPayslip;
