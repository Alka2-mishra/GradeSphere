// src/routes/auth.js
const router = require("express").Router();
const { login, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validateLogin } = require("../middleware/validate");

router.post("/login", validateLogin, login);
router.get("/me", authenticate, getMe);

module.exports = router;
