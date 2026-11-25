const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const { pool } = require("../config/db");

const createDoctor = async ({
  userId,
  specialization,
  qualification,
  experienceYears,
  consultationFee,
  bio,
}) => {
  // Check whether the user exists
  const user = await userModel.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "patient") {
    throw new Error("Only patients can be promoted to doctors");
  }

  // Create profile and update role together
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const profile = await doctorModel.createDoctorProfile({
      userId,
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      bio,
    }, client);

    await client.query(
      "UPDATE users SET role = 'doctor' WHERE id = $1",
      [userId]
    );

    await client.query("COMMIT");

    return profile;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getDoctorByUserId = async (userId) => {
  return doctorModel.findDoctorByUserId(userId);
};

const getAllDoctors = async () => {
  return doctorModel.findAllDoctors();
};

module.exports = {
  createDoctor,
  getDoctorByUserId,
  getAllDoctors,
};