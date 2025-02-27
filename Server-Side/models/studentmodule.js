const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true }, // Email is now not unique
    phone: String,
    rollNumber: { type: String, unique: true, required: true }, // Roll Number is now unique
    class: String,
    admissionDate: Date,
    totalFees: Number,
    payments: [
      {
        amount: Number,
        payDate: Date,
        month: String, // Example: "January 2025"
        status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
