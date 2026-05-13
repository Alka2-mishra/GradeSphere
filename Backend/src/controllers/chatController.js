// src/controllers/chatController.js
const { v4: uuidv4 } = require("uuid");
const {
  getMessages, addMessage, markRead, unreadCount,
  getStudents, getTeachers, getUserById, safeUser, onlineUsers,
} = require("../data/store");

// GET /api/chat/contacts
// Returns the contact list for the logged-in user with last message + unread count
function getContacts(req, res) {
  const { id, role } = req.user;

  let contacts;

  if (role === "student") {
    // Student sees all teachers
    contacts = getTeachers().map(teacher => {
      const msgs = getMessages(teacher.id, id);
      const last = msgs.length ? msgs[msgs.length - 1] : null;
      const unread = unreadCount(teacher.id, id, "student");
      return {
        ...safeUser(teacher),
        online: onlineUsers.has(teacher.id),
        lastMessage: last,
        unread,
      };
    });
  } else {
    // Teacher sees all students
    contacts = getStudents().map(student => {
      const msgs = getMessages(id, student.id);
      const last = msgs.length ? msgs[msgs.length - 1] : null;
      const unread = unreadCount(id, student.id, "teacher");
      return {
        ...safeUser(student),
        online: onlineUsers.has(student.id),
        lastMessage: last,
        unread,
      };
    });
  }

  res.json({ success: true, contacts });
}

// GET /api/chat/messages/:contactId
// Returns full message history for a conversation
function getConversation(req, res) {
  const { id, role } = req.user;
  const { contactId } = req.params;

  const teacherId = role === "teacher" ? id : contactId;
  const studentId = role === "student" ? id : contactId;

  const messages = getMessages(teacherId, studentId);
  res.json({ success: true, messages });
}

// POST /api/chat/messages/:contactId
// Send a message via REST (Socket.IO is the primary path; this is the fallback)
function sendMessage(req, res, next) {
  try {
    const { id, role } = req.user;
    const { contactId } = req.params;
    const { text } = req.body;

    const teacherId = role === "teacher" ? id : contactId;
    const studentId = role === "student" ? id : contactId;

    const msg = {
      id: uuidv4(),
      from: id,
      fromRole: role,
      text: text.trim(),
      ts: Date.now(),
      read: false,
    };

    addMessage(teacherId, studentId, msg);
    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/chat/messages/:contactId/read
// Mark all messages in a conversation as read
function markAsRead(req, res) {
  const { id, role } = req.user;
  const { contactId } = req.params;

  const teacherId = role === "teacher" ? id : contactId;
  const studentId = role === "student" ? id : contactId;

  markRead(teacherId, studentId, role);
  res.json({ success: true });
}

module.exports = { getContacts, getConversation, sendMessage, markAsRead };
