const express = require("express");
const dotenv = require('dotenv'); // ✅ Import dotenv
dotenv.config(); // ✅ Load environment variables
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
