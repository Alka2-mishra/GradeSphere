// src/controllers/usersController.js
const { getUserById, getStudents, getTeachers, safeUser, users } = require("../data/store");

function getProfile(req, res) {
  res.json({ success: true, user: safeUser(req.user) });
}

function updateProfile(req, res) {
  const allowed = ["name", "phone", "address", "bio", "guardian", "guardianPhone"];
  const user = req.user;

  allowed.forEach(field => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  res.json({ success: true, user: safeUser(user) });
}

function getAllStudents(req, res) {
  res.json({ success: true, students: getStudents().map(safeUser) });
}

function getAllTeachers(req, res) {
  res.json({ success: true, teachers: getTeachers().map(safeUser) });
}

function getUserByIdHandler(req, res) {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user: safeUser(user) });
}

module.exports = { getProfile, updateProfile, getAllStudents, getAllTeachers, getUserByIdHandler };
