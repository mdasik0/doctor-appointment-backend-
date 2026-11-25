const authService = require("../services/authService");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

const showLogin = (req, res) => {
  res.render("auth/login", {
    error: null,
    message: req.query.registered
      ? "Registration successful. Please log in."
      : null,
  });
};

const showRegister = (req, res) => {
  res.render("auth/register", { error: null });
};

const register = async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).render("auth/register", {
        error: "Please fill in all fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("auth/register", {
        error: "Passwords do not match.",
      });
    }

    await authService.registerUser({ name, email, mobile, password });

    return res.redirect("/login?registered=1");
  } catch (error) {
    console.error("Registration error:", error.message);

    const isDuplicate =
      error.code === "23505" ||
      error.message.toLowerCase().includes("already");

    return res.status(isDuplicate ? 409 : 500).render("auth/register", {
      error: isDuplicate
        ? "That email or mobile number is already registered."
        : "Unable to create your account. Please try again.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("auth/login", {
        error: "Please enter your email and password.",
        message: null,
      });
    }

    const user = await authService.loginUser({ email, password });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(401).render("auth/login", {
      error: "Invalid email or password.",
      message: null,
    });
  }
};

const dashboard = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);

    if (!user) {
      res.clearCookie("token", cookieOptions);
      return res.redirect("/login");
    }

    return res.render("dashboard/patient", { user });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    return res.status(500).send("Unable to load dashboard.");
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.redirect("/login");
};

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  dashboard,
  logout,
};