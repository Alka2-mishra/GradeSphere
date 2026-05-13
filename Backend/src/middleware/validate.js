// src/middleware/validate.js

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Valid email is required" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }
  next();
}

function validateMessage(req, res, next) {
  const { text } = req.body;
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ success: false, message: "Message text is required" });
  }
  if (text.length > 2000) {
    return res.status(400).json({ success: false, message: "Message too long (max 2000 chars)" });
  }
  next();
}

module.exports = { validateLogin, validateMessage };
