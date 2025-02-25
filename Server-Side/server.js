const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(process.env.PORT || 5000, () => console.log(`Server running`));
>>>>>>> 55c2e37fff0e98ed254dd28993e2a662c55737b7
