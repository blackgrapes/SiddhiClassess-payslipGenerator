const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,
  rollNumber: String,
  class: String,
  admissionDate: Date,
  totalFees: Number,
  payments: [{
    amount: Number,
    payDate: Date,
    month: String, // Example: "January 2025"
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
