const doctorService = require("../services/doctorService");

// Create doctor profile (Admin only)
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      bio,
    } = req.body;

    if (!userId || !specialization) {
      return res.status(400).json({
        success: false,
        message: "User ID and specialization are required",
      });
    }

    const doctor = await doctorService.createDoctor({
      userId,
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      bio,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error.message);

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Only patients can be promoted to doctors") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create doctor profile",
    });
  }
};

// Get doctor by user ID
const getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorByUserId(req.params.userId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctor",
    });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctors",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctorByUserId,
  getAllDoctors,
};