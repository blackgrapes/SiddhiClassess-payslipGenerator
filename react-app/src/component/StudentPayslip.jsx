import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

  return (
    <div className="d-flex" style={{ backgroundColor: "#e3dcc2" }}>
      {/* Fixed Sidebar */}
      <div
        className="bg-dark text-white"
        style={{
          width: "280px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflowY: "auto",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ marginLeft: "280px", backgroundColor: "#e3dcc2", color: "#69360d", overflowY: "auto", minHeight: "100vh" }}>
        <h3 className="text-center fw-bold" style={{ color: "#69360d" }}>Student Payslip</h3>

        {fetching ? (
          <p className="text-center">Loading student details...</p>
        ) : student ? (
          <div className="card p-3 mt-3 border-0 shadow-sm" style={{ backgroundColor: "#69360d", color: "#e3dcc2" }}>
            <h5>Student Details</h5>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll Number:</strong> {student.rollNumber}</p>
            <p><strong>Class:</strong> {student.class}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Total Fees:</strong> ₹{student.totalFees}</p>
            <p><strong>Fees Paid:</strong> ₹{payments.reduce((sum, payment) => sum + Number(payment.amount), 0)}</p>
            <p><strong>Pending Fees:</strong> ₹{student.totalFees - payments.reduce((sum, payment) => sum + Number(payment.amount), 0)}</p>
          </div>
        ) : (
          <p className="text-danger text-center">❌ Student not found.</p>
        )}

        {/* Add Payment Form */}
        <form onSubmit={handleAddPayment} className="mt-3 card p-3 border-0 shadow-sm" style={{ backgroundColor: "#69360d", color: "#e3dcc2" }}>
          <h5>Add Payment</h5>
          <div className="mb-2">
            <label>Amount:</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="mb-2">
            <label>Month:</label>
            <DatePicker
              selected={month}
              onChange={(date) => setMonth(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="form-control"
              placeholderText="Select Month"
              required
            />
          </div>
          <button className="btn w-100 fw-bold" type="submit" disabled={loading} style={{ backgroundColor: "#e3dcc2", color: "#69360d" }}>
            {loading ? "Processing..." : "Add Payment"}
          </button>
        </form>

        {message && <p className="mt-2 text-center text-info">{message}</p>}

        {/* Payment History */}
        <h4 className="mt-4 fw-bold" style={{ color: "#69360d" }}>Payment History</h4>
        <div className="payment-history overflow-auto border rounded p-3 shadow-sm" style={{ maxHeight: "400px", backgroundColor: "#69360d", color: "#e3dcc2" }}>
          <ul className="list-group">
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <li key={index} className="list-group-item border-0" style={{ backgroundColor: "#e3dcc2", color: "#69360d" }}>
                  <strong>{payment.month}</strong> - ₹{payment.amount} | {payment.status} | {new Date(payment.payDate).toLocaleDateString()}
                </li>
              ))
            ) : (
              <p className="text-center">No payments recorded.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentPayslip;
