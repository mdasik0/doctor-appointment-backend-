
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const registerUser = async ({ name, email, mobile, password }) => {
  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await userModel.createUser({
    name,
    email,
    mobile,
    passwordHash,
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
    const user = await userModel.findUserByEmail(email);
  
    if (!user) {
      throw new Error("Invalid email or password");
    }
  
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );
  
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  };

module.exports = {
  registerUser,
  loginUser,
};
