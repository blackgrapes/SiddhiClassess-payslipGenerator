import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import logopng from "/src/assets/logopng.png"; // Ensure this path is correct

const API_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const TeacherPayslip = () => {
  const { email } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  const [newPayslip, setNewPayslip] = useState({
    payPeriod: "",
    paidDays: 0,
    lopDays: 0,
    payDate: "",
    earnings: {
      basicSalary: 0,
      allowances: 0,
      otherBenefits: 0,
    },
    deductions: {
      pf: 0,
      esic: "N/A",
      otherDeductions: 0,
    },
    incentives: {
      incentives: 0,
    },
    reimbursements: {
      reimbursement1: 0,
      reimbursement2: 0,
    },
    netPay: 0,
  });

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  const fetchTeacherDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/teacher/${email}`);
      setTeacher(res.data);

      // Update newPayslip with teacher's salary and reset allowances
      setNewPayslip((prev) => ({
        ...prev,
        earnings: { ...prev.earnings, basicSalary: res.data.salary },
      }));

      const payslipRes = await axios.get(`${API_URL}/teacher/${email}/payslips`);
      setPayslips(payslipRes.data);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      setMessage("❌ Failed to fetch teacher details.");
    } finally {
      setFetching(false);
    }
  };

  const calculateNetPay = (payslip) => {
    if (!teacher) return payslip;

    const { earnings, deductions, incentives, reimbursements, paidDays } = payslip;

    const totalDaysInMonth =
      payslip.payPeriod && payslip.payPeriod.includes("-")
        ? new Date(payslip.payPeriod.split("-")[0], payslip.payPeriod.split("-")[1], 0).getDate()
        : 30;

    const basicSalary = ((teacher.salary / totalDaysInMonth) * paidDays).toFixed(2);

    const grossEarnings = (
      Number(basicSalary) +
      Number(earnings.allowances || 0) + // Fixed: Allowances now included
      Number(earnings.otherBenefits || 0) +
      Number(incentives.incentives || 0) +
      Number(reimbursements.reimbursement1 || 0) +
      Number(reimbursements.reimbursement2 || 0)
    ).toFixed(2);

    const totalDeductions = (
      Number(deductions.pf || 0) +
      (deductions.esic !== "N/A" ? Number(deductions.esic) : 0) +
      Number(deductions.otherDeductions || 0)
    ).toFixed(2);

    const netPay = (Number(grossEarnings) - Number(totalDeductions)).toFixed(2);

    return {
      ...payslip,
      earnings: { ...earnings, basicSalary, grossEarnings },
      deductions: { ...deductions, totalDeductions },
      netPay,
    };
  };

  const handleInputChange = (e, category, field) => {
    const value = Number(e.target.value) || 0;
    setNewPayslip((prev) => {
      const updatedPayslip = {
        ...prev,
        [category]: { ...prev[category], [field]: value },
      };
      return calculateNetPay(updatedPayslip);
    });
  };

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setNewPayslip((prev) => {
      let updatedPayslip = { ...prev, [name]: value };

      if (name === "payPeriod") {
        const [year, month] = value.split("-");
        const lastDay = new Date(year, month, 0).toISOString().split("T")[0];
        updatedPayslip.payDate = lastDay;
      }

      if (name === "paidDays") {
        const totalDaysInMonth =
          prev.payPeriod && prev.payPeriod.includes("-")
            ? new Date(prev.payPeriod.split("-")[0], prev.payPeriod.split("-")[1], 0).getDate()
            : 30;

        updatedPayslip.lopDays = totalDaysInMonth - Number(value);

        updatedPayslip.earnings = {
          ...prev.earnings,
          basicSalary: ((teacher.salary / totalDaysInMonth) * Number(value)).toFixed(2),
        };
      }

      return calculateNetPay(updatedPayslip);
    });
  };

  const addPayslip = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/teacher/${email}/add-payslip`, newPayslip);
      setMessage("✅ Payslip added successfully!");
      fetchTeacherDetails(); // Refresh the payslips list
    } catch (error) {
      setMessage("❌ Failed to add payslip.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const generatePDF = async (teacher = {}, newPayslip = {}, payslips = []) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
      let yPosition = height - 4; // 4px margin at the top
  
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
  
      // Draw the logo at the center top (8x8 pixels)
      const logoDims = logoImage.scale(0.1); // Scale down to 8x8 pixels
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
      drawText(
        "FLAT NO.702 SARTHAK GALAXY -02, behind IIM COLLEGE, RAU INDORE",
        0,
        yPosition,
        12,
        "center"
      );
      yPosition -= 20; // Space below the address
  
      // Contact Details
      drawText("Phone: 9876543210 | Email: info@coaching.com", 0, yPosition, 10, "center");
      yPosition -= 30; // Extra space before the first section
  
      // Teacher Details
      drawText("Teacher Details", 0, yPosition, 12, "center");
      yPosition -= 20; // Space above the line
      drawLine(yPosition); // Line partition
      yPosition -= 20; // Space below the line
      drawText(`Name: ${teacher?.name || "N/A"}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Phone: ${teacher?.phone || "N/A"}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Designation: ${teacher?.designation || "N/A"}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Salary: Rs. ${teacher?.salary || "N/A"}`, 50, yPosition);
      yPosition -= 30; // Extra space before the next section
  
      // Payslip Details
      drawText("Payslip Details", 0, yPosition, 12, "center");
      yPosition -= 20; // Space above the line
      drawLine(yPosition); // Line partition
      yPosition -= 20; // Space below the line
      drawText(`Pay Period: ${newPayslip?.payPeriod || "N/A"}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Paid Days: ${newPayslip?.paidDays || 0}`, 50, yPosition);
      yPosition -= 15;
      drawText(`LOP Days: ${newPayslip?.lopDays || 0}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Pay Date: ${newPayslip?.payDate || "N/A"}`, 50, yPosition);
      yPosition -= 30; // Extra space before the next section
  
      // Earnings
      const earnings = newPayslip?.earnings || {};
      drawText("Earnings", 0, yPosition, 12, "center");
      yPosition -= 20; // Space above the line
      drawLine(yPosition); // Line partition
      yPosition -= 20; // Space below the line
      drawText(`Basic Salary: Rs. ${earnings.basicSalary || 0}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Allowances: Rs. ${earnings.allowances || 0}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Other Benefits: Rs. ${earnings.otherBenefits || 0}`, 50, yPosition);
      yPosition -= 30; // Extra space before the next section
  
      // Deductions
      const deductions = newPayslip?.deductions || {};
      drawText("Deductions", 0, yPosition, 12, "center");
      yPosition -= 20; // Space above the line
      drawLine(yPosition); // Line partition
      yPosition -= 20; // Space below the line
      drawText(`Provident Fund (PF): Rs. ${deductions.pf || 0}`, 50, yPosition);
      yPosition -= 15;
      drawText(`ESIC: Rs. ${deductions.esic || 0}`, 50, yPosition);
      yPosition -= 15;
      drawText(`Other Deductions: Rs. ${deductions.otherDeductions || 0}`, 50, yPosition);
      yPosition -= 30; // Extra space before the next section
  
      // Net Pay
      drawText(`Net Pay: Rs. ${newPayslip?.netPay || 0}`, 0, yPosition, 14, "center");
      yPosition -= 30; // Extra space before the next section
      drawLine(yPosition); // Line partition
      yPosition -= 20; // Space below the line
  
      // Payment History
      drawText("Payment History", 0, yPosition, 12, "center");
      yPosition -= 20; // Space above the line
      drawLine(yPosition); // Line partition
      yPosition -= 20; // Space below the line
      const lastThreePayslips = payslips.slice(-3);
      if (lastThreePayslips.length > 0) {
        lastThreePayslips.forEach((payslip) => {
          drawText(
            `${payslip.payPeriod || "N/A"} - Paid Days: ${payslip.paidDays || 0}, LOP Days: ${payslip.lopDays || 0}, Net Pay: Rs. ${payslip.netPay || 0}`,
            50,
            yPosition
          );
          yPosition -= 15;
        });
      } else {
        drawText("No payment history found.", 50, yPosition);
        yPosition -= 15;
      }
      yPosition -= 20; // Extra space before the signature section
  
      // Date and Signature Section (Professional Format)
      drawText("Date: ___________________________", 50, yPosition, 12);
      yPosition -= 40; // Space for signature
      drawText("Signature: ________________________", 50, yPosition, 12);
  
      // Save and Download PDF
      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. See console for details.");
    }
  };
  const downloadPDF = (pdfBytes) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "teacher_payslip.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-4">
      <h3>Teacher Payslip</h3>

      {fetching ? (
        <p>Loading teacher details...</p>
      ) : teacher ? (
        <>
          <div className="card p-3 mt-3">
            <h5>Teacher Details</h5>
            <p>
              <strong>Name:</strong> {teacher.name}
            </p>
            <p>
              <strong>Phone:</strong> {teacher.phone}
            </p>
            <p>
              <strong>Designation:</strong> {teacher.designation}
            </p>
            <p>
              <strong>Salary:</strong> {teacher.salary}
            </p>
          </div>

          <h4 className="mt-4">Add New Payslip</h4>
          <div className="card p-3">
            <input
              type="month"
              name="payPeriod"
              className="form-control mb-2"
              onChange={handleSimpleChange}
            />
            <input
              type="number"
              name="paidDays"
              placeholder="Paid Days"
              className="form-control mb-2"
              onChange={handleSimpleChange}
            />
            <input
              type="number"
              name="lopDays"
              value={newPayslip.lopDays}
              className="form-control mb-2"
              readOnly
            />

            <h6>Earnings</h6>
            <input
              type="number"
              placeholder="Allowances"
              className="form-control mb-2"
              onChange={(e) => handleInputChange(e, "earnings", "allowances")}
            />
            <input
              type="number"
              placeholder="Other Benefits"
              className="form-control mb-2"
              onChange={(e) => handleInputChange(e, "earnings", "otherBenefits")}
            />

            <h6>Deductions</h6>
            <input
              type="number"
              placeholder="Provident Fund (PF)"
              className="form-control mb-2"
              onChange={(e) => handleInputChange(e, "deductions", "pf")}
            />
            <input
              type="number"
              placeholder="Other Deductions"
              className="form-control mb-2"
              onChange={(e) => handleInputChange(e, "deductions", "otherDeductions")}
            />

            <h6>Net Pay</h6>
            <input
              type="text"
              value={`₹${newPayslip.netPay}`}
              className="form-control mb-2"
              readOnly
            />

            <button
              className="btn btn-success mt-2"
              onClick={addPayslip}
              disabled={loading}
            >
              {loading ? "Adding..." : "➕ Add Payslip"}
            </button>

            <button
              className="btn btn-primary mt-2"
              onClick={() => generatePDF(teacher, newPayslip, payslips)}
            >
              Download Payslip PDF
            </button>
          </div>

          <h4 className="mt-4">Payment History</h4>
          <div className="card p-3">
            {payslips.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Pay Period</th>
                    <th>Paid Days</th>
                    <th>LOP Days</th>
                    <th>Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((payslip, index) => (
                    <tr key={index}>
                      <td>{payslip.payPeriod}</td>
                      <td>{payslip.paidDays}</td>
                      <td>{payslip.lopDays}</td>
                      <td>₹{payslip.netPay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No payslips found.</p>
            )}
          </div>
        </>
      ) : (
        <p>❌ Teacher not found.</p>
      )}
    </div>
  );
};

export default TeacherPayslip;