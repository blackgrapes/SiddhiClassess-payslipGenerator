const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,
  designation: String,
  dateOfJoining: Date,
  salary: Number,
  payslips: [{
    payPeriod: String, // Example: "January 2025"
    paidDays: Number,
    lopDays: Number,
    payDate: Date,
    
    earnings: {
      basicSalary: Number,
      allowances: Number,
      otherBenefits: Number,
      grossEarnings: Number // Calculated: Basic Salary + Allowances + Other Benefits
    },

    deductions: {
      pf: Number,
      esic: String, // Can be "N/A" or a number
      otherDeductions: Number,
      totalDeductions: Number // Calculated: PF + ESIC + Other Deductions
    },

    incentives: {
      incentives: Number,
      totalIncentives: Number // Same as incentives for consistency
    },

    reimbursements: {
      reimbursement1: Number,
      reimbursement2: Number,
      totalReimbursements: Number // Sum of both reimbursements
    },

    netPay: Number // Final Calculation: Gross Earnings - Total Deductions + Total Incentives + Total Reimbursements
  }]
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
