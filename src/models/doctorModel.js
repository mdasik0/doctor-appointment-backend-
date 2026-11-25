const { pool } = require("../config/db");

// Create a doctor profile
const createDoctorProfile = async ({
    userId,
    specialization,
    qualification,
    experienceYears,
    consultationFee,
    bio,
  }, client = pool) => {
  const query = `
    INSERT INTO doctor_profiles (
      user_id,
      specialization,
      qualification,
      experience_years,
      consultation_fee,
      bio
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    userId,
    specialization,
    qualification,
    experienceYears,
    consultationFee,
    bio,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
};

// Find doctor profile using user ID
const findDoctorByUserId = async (userId) => {
  const query = `
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      u.mobile,
      dp.id AS doctor_profile_id,
      dp.specialization,
      dp.qualification,
      dp.experience_years,
      dp.consultation_fee,
      dp.bio
    FROM doctor_profiles dp
    JOIN users u ON dp.user_id = u.id
    WHERE u.id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

// Find all doctors
const findAllDoctors = async () => {
  const query = `
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      dp.id AS doctor_profile_id,
      dp.specialization,
      dp.qualification,
      dp.experience_years,
      dp.consultation_fee,
      dp.bio
    FROM doctor_profiles dp
    JOIN users u ON dp.user_id = u.id
    WHERE u.role = 'doctor'
    ORDER BY u.name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createDoctorProfile,
  findDoctorByUserId,
  findAllDoctors,
};