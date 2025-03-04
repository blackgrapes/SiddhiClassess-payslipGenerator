const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: "*", // Allow all origins (modify in production)
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Default route to check if backend is running
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Routes
app.use("/admin", require("./routes/adminRoutes"));
app.use("/student", require("./routes/studentRoutes"));
app.use("/teacher", require("./routes/teacherRoutes"));

const PORT = process.env.PORT || 5000;

// Ensure server listens on all network interfaces (IPv4 & IPv6)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
