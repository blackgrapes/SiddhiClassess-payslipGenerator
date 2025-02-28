import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentPayslip = () => {
  const { rollNumber } = useParams();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/student/${rollNumber}`);
      setStudent(res.data);
      setPayments(res.data.payments);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payDate = new Date().toISOString();
    
    try {
      await axios.post(`http://localhost:5000/student/${rollNumber}/add-payment`, {
        amount,
        payDate,
        month,
        status: "Paid",
      });
      
      setMessage("✅ Payment added successfully!");
      setAmount("");
      setMonth("");
      fetchStudentDetails();
    } catch (error) {
      setMessage("❌ Error adding payment!");
    }
    
    setLoading(false);
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = student?.totalFees - totalPaid;

  return (
    <div className="container mt-4">
      <h3>Student Payslip</h3>

      {student ? (
        <div className="card p-3 mt-3">
          <h5>Student Details</h5>
          <p><strong>Roll Number:</strong> {student.rollNumber}</p>
          <p><strong>Class:</strong> {student.class}</p>
          <p><strong>Total Fees:</strong> ₹{student.totalFees}</p>
          <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
          <p><strong>Remaining Balance:</strong> ₹{remainingBalance}</p>
        </div>
      ) : (
        <p>Loading student details...</p>
      )}

      <form onSubmit={handleAddPayment} className="mt-3">
        <h5>Add Payment</h5>
        <div className="mb-2">
          <label>Amount:</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Month:</label>
          <input type="text" className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} required />
        </div>
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Add Payment"}
        </button>
      </form>

      {message && <p className="mt-2 text-info">{message}</p>}

      <h4 className="mt-4">Payment History</h4>
      <ul className="list-group">
        {payments.map((payment, index) => (
          <li key={index} className="list-group-item">
            <strong>{payment.month}</strong> - ₹{payment.amount} | {payment.status} | {new Date(payment.payDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentPayslip;
