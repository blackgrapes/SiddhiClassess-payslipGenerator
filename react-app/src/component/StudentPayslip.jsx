import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import logopng from "/src/assets/logopng.png"; // Ensure this path is correct
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

  const generatePDF = async () => {
    try {
      if (!student || payments.length === 0) {
        setMessage("❌ Cannot generate PDF. Missing student details or payments.");
        return;
      }
  
      console.log("Generating PDF for student:", student); // Debugging
      console.log("Payments:", payments); // Debugging
  
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]); // A4 size equivalent
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
      let yPosition = height - 20; // Start from the top with a 20px margin
  
      const drawText = (text, x, y, size = 12, align = "left") => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const xPos = align === "center" ? width / 2 - textWidth / 2 : x;
        page.drawText(text, { x: xPos, y, size, font, color: rgb(0, 0, 0) });
      };
  
      const drawLine = (y) => {
        page.drawLine({
          start: { x: 50, y },
          end: { x: width - 50, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      };
  
      // Load the logo image from the assets folder
      const logoUrl = logopng; // Use the imported logo
      const logoResponse = await fetch(logoUrl);
      const logoArrayBuffer = await logoResponse.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoArrayBuffer);
  
      // Draw the logo at the center top (scaled down)
      const logoDims = logoImage.scale(0.1); // Scale down the logo
      const logoX = width / 2 - logoDims.width / 2; // Center the logo horizontally
      const logoY = yPosition - logoDims.height; // Position below the top margin
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoDims.width,
        height: logoDims.height,
      });
  
      // Adjust yPosition to account for the logo
      yPosition -= logoDims.height + 20; // Add some spacing below the logo
  
      // Address (Centered and Separated)
      drawText("FLAT NO 702 SARTHAK GALAXY -02,behind IIM College,Rau Indore", 0, yPosition, 12, "center");
      yPosition -= 15;
  
      // Contact Details
      drawText("Phone: 9876543210 | Email: info@coaching.com", 0, yPosition, 10, "center");
      yPosition -= 30; // Extra space before the first section
  
    
  
      // Student Details Heading
      drawText("Student Details", 0, yPosition, 14, "center");
      yPosition -= 20;

        // Line separator
        drawLine(yPosition);
        yPosition -= 20;
  
      // Student Details
      drawText(`Name: ${student.name || "N/A"}`, 50, yPosition);
      drawText(`Roll Number: ${student.rollNumber || "N/A"}`, width / 2 + 20, yPosition);
      yPosition -= 15;
  
      drawText(`Class: ${student.class || "N/A"}`, 50, yPosition);
      drawText(`Phone: ${student.phone || "N/A"}`, width / 2 + 20, yPosition);
      yPosition -= 15;
  
      drawText(`Total Fees: ${student.totalFees || 0}`, 50, yPosition);
      const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      drawText(`Fees Paid: ${totalPaid}`, width / 2 + 20, yPosition);
      yPosition -= 15;
  
      const remainingBalance = student.totalFees - totalPaid;
      drawText(`Pending Fees: ${remainingBalance}`, 50, yPosition);
      yPosition -= 20;
  
      
  
      // Payment History Heading
      drawText("Payment History", 0, yPosition, 14, "center");
      yPosition -= 20;

      // Line separator
      drawLine(yPosition);
      yPosition -= 20;
  
      // Payment History
      if (payments.length > 0) {
        payments.forEach((payment, index) => {
          drawText(
            `${index + 1}. ${payment.month || "N/A"} - ${payment.amount || 0} | ${payment.status || "N/A"} | ${new Date(payment.payDate).toLocaleDateString() || "N/A"}`,
            50,
            yPosition
          );
          yPosition -= 15;
        });
      } else {
        drawText("No payment history found.", 50, yPosition);
        yPosition -= 15;
      }
  
      // Line separator
      drawLine(yPosition);
      yPosition -= 20;
  
      // Date and Signature Section
      drawText("Date: ___________________________", 50, yPosition, 12);
      yPosition -= 40; // Space for signature
      drawText("Signature: ________________________", 50, yPosition, 12);
  
      // Save and Download PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Student_Payslip_${student.rollNumber}.pdf`;
      document.body.appendChild(link); // Append the link to the DOM
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up
  
      console.log("PDF generated and downloaded successfully!"); // Debugging
    } catch (error) {
      console.error("Error generating PDF:", error); // Debugging
      setMessage("❌ Failed to generate PDF. See console for details.");
    }
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