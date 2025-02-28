const express = require("express");
const Student = require("../models/studentmodule");
const router = express.Router();

// @route   POST /students/add
// @desc    Add a new student
router.post("/add", async (req, res) => {
  try {
    const { name, email, phone, rollNumber, class: studentClass, admissionDate, totalFees } = req.body;

    // Check if student already exists by rollNumber
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) return res.status(400).json({ message: "Student with this roll number already exists" });

    // Create new student
    const newStudent = new Student({
      name,
      email,
      phone,
      rollNumber,
      class: studentClass,
      admissionDate,
      totalFees,
      payments: [],
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /students
// @desc    Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /students/:rollNumber
// @desc    Get a specific student by roll number
router.get("/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /students/:rollNumber
// @desc    Update student details
router.put("/:rollNumber", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber },
      req.body,
      { new: true }
    );

    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /students/:rollNumber
// @desc    Delete a student
router.delete("/:rollNumber", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ rollNumber: req.params.rollNumber });

    if (!deletedStudent) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /students/:rollNumber/add-payment
// @desc    Add a payment record for a student
router.post("/:rollNumber/add-payment", async (req, res) => {
  try {
    const { amount, payDate, month, status } = req.body;


    if (!amount || !payDate || !month || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Add payment record
    student.payments.push({ amount, payDate, month, status });
    await student.save();

    res.status(200).json({ message: "Payment added successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /students/:rollNumber/payments
// @desc    Get a student's payment details
router.get("/:rollNumber/payments", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ payments: student.payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /students/:rollNumber/report
// @desc    Get a student's payment report
router.get("/:rollNumber/report", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Calculate total paid & pending amount
    const totalPaid = student.payments.reduce((sum, p) => (p.status === "Paid" ? sum + p.amount : sum), 0);
    const totalPending = student.totalFees - totalPaid;

    const report = {
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      totalFees: student.totalFees,
      totalPaid,
      totalPending,
      paymentHistory: student.payments,
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
