const express = require("express");
const pageController = require("../controllers/pageController");
const requirePageAuth = require("../middleware/requirePageAuth");

const router = express.Router();

router.get("/login", pageController.showLogin);
router.post("/login", pageController.login);

router.get("/register", pageController.showRegister);
router.post("/register", pageController.register);

router.get("/dashboard", requirePageAuth, pageController.dashboard);
router.post("/logout", requirePageAuth, pageController.logout);

module.exports = router;