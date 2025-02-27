const express = require("express");
const Admin = require("../models/Admin"); // Ensure correct path to your model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// @route   POST /api/admin/signup
// @desc    Register a new admin
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Create new admin
    const newAdmin = new Admin({ name, email, password, dob });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/login
// @desc    Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({ token, adminId: admin._id, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/forgot-password
// @desc    Reset password using DOB verification
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, dob, newPassword } = req.body;

    // Find admin by email and dob
    const admin = await Admin.findOne({ email, dob });
    if (!admin) return res.status(400).json({ message: "Invalid email or DOB" });

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
