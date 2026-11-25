const express = require("express");
const doctorController = require("../controllers/doctorControllers");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Public: view all doctors
router.get("/", doctorController.getAllDoctors);

// Public: view a specific doctor
router.get("/:userId", doctorController.getDoctorByUserId);

// Admin only: create a doctor profile
router.post(
  "/",
  authenticate,
  authorize("admin"),
  doctorController.createDoctor
);

module.exports = router;