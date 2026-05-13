// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const { signToken } = require("../config/jwt");
const { getUserByEmail, safeUser } = require("../data/store");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken({ id: user.id, role: user.role });

    res.json({
      success: true,
      token,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

function getMe(req, res) {
  res.json({ success: true, user: safeUser(req.user) });
}

module.exports = { login, getMe };
