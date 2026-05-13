// src/routes/users.js
const router = require("express").Router();
const { authenticate, requireRole } = require("../middleware/auth");
const {
  getProfile, updateProfile, getAllStudents, getAllTeachers, getUserByIdHandler,
} = require("../controllers/usersController");

router.use(authenticate);

router.get("/profile",   getProfile);
router.patch("/profile", updateProfile);
router.get("/students",  requireRole("teacher"), getAllStudents);
router.get("/teachers",  getAllTeachers);
router.get("/:id",       getUserByIdHandler);

module.exports = router;
