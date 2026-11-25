
require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authenticate = require("./middleware/authenticate");
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Keep your existing middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Page routes
app.use("/", pageRoutes);
// Health check
app.get("/", (req, res) => {
  res.send("Doctor Appointment API is running");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
