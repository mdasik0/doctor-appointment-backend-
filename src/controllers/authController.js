
const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const user = await authService.registerUser({
      name,
      email,
      mobile,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    if (error.message === "Email is already registered") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await authService.loginUser({
        email,
        password,
      });
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
      });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }
  
      console.error(error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

module.exports = {
  register,
  login,
};
