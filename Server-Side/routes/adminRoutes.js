const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModule");

dotenv.config();
const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

const blacklistedTokens = new Set(); // Store blacklisted tokens

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(403).json({ message: "Session expired. Please log in again." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Session expired. Please log in again." });
    }
    req.user = decoded;
    next();
  });
};

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    // Validate input
    if (!name || !email || !password || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin (password will be hashed in schema)
    const newAdmin = new Admin({ name, email, password, dob });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT without expiry (instant logout will handle expiration)
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout Route (Invalidate Token Instantly & Clear Session)
router.post("/logout", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  blacklistedTokens.add(token); // Blacklist the token instantly
  res.json({ message: "Logged out successfully. Session cleared." });
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, dob, newPassword } = req.body;

    // Validate input
    if (!email || !dob || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find admin by email and DOB
    const admin = await Admin.findOne({ email, dob });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or DOB" });
    }

    // Update password (hashed in schema)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected Route Example
router.get("/admin-data", authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    res.json({ admin });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
