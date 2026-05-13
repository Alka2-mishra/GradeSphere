// src/routes/chat.js
const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const { validateMessage } = require("../middleware/validate");
const {
  getContacts, getConversation, sendMessage, markAsRead,
} = require("../controllers/chatController");

router.use(authenticate);

router.get("/contacts",              getContacts);
router.get("/messages/:contactId",   getConversation);
router.post("/messages/:contactId",  validateMessage, sendMessage);
router.patch("/messages/:contactId/read", markAsRead);

module.exports = router;
