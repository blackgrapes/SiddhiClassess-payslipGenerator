const express = require("express");
const Teacher = require("../models/TeacherModule");
const router = express.Router();

// 📌 Add a new teacher
router.post("/add", async (req, res) => {
  try {
    const { name, email, phone, designation, dateOfJoining, salary } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) return res.status(400).json({ message: "Teacher already exists" });

    const newTeacher = new Teacher({
      name,
      email,
      phone,
      designation,
      dateOfJoining,
      salary,
      payslips: []
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get all teachers
router.get("/all", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get a specific teacher by email
router.get("/:email", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Update a teacher's details by email
router.put("/:email/update", async (req, res) => {
  try {
    const { name, phone, designation, dateOfJoining, salary } = req.body;

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { email: req.params.email },
      { name, phone, designation, dateOfJoining, salary },
      { new: true }
    );

    if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Delete a teacher by email
router.delete("/:email/delete", async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findOneAndDelete({ email: req.params.email });
    if (!deletedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Add a Payslip for a Teacher
router.post("/:email/add-payslip", async (req, res) => {
  try {
    const {
      payPeriod,
      paidDays,
      lopDays,
      payDate,
      earnings,
      deductions,
      incentives,
      reimbursements
    } = req.body;

    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Calculate values
    const grossEarnings = earnings.basicSalary + earnings.allowances + earnings.otherBenefits;
    const totalDeductions = deductions.pf + (deductions.esic !== "N/A" ? Number(deductions.esic) : 0) + deductions.otherDeductions;
    const totalIncentives = incentives.incentives;
    const totalReimbursements = reimbursements.reimbursement1 + reimbursements.reimbursement2;
    const netPay = grossEarnings - totalDeductions + totalIncentives + totalReimbursements;

    const payslip = {
      payPeriod,
      paidDays,
      lopDays,
      payDate,
      earnings: { ...earnings, grossEarnings },
      deductions: { ...deductions, totalDeductions },
      incentives: { ...incentives, totalIncentives },
      reimbursements: { ...reimbursements, totalReimbursements },
      netPay
    };

    teacher.payslips.push(payslip);
    await teacher.save();

    res.status(201).json({ message: "Payslip added successfully", payslip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get all Payslips for a Teacher
router.get("/:email/payslips", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher.payslips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get a Specific Payslip by Payslip ID
router.get("/:email/payslip/:payslipId", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const payslip = teacher.payslips.id(req.params.payslipId);
    if (!payslip) return res.status(404).json({ message: "Payslip not found" });

    res.status(200).json(payslip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
