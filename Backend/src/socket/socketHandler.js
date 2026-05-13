// src/socket/socketHandler.js
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require("../config/jwt");
const {
  getUserById, addMessage, markRead, onlineUsers, convKey,
} = require("../data/store");

module.exports = function registerSocketHandlers(io) {

  // ── Auth middleware for Socket.IO ─────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = verifyToken(token);
      const user = getUserById(decoded.id);
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { id: userId, role, name } = socket.user;

    // ── Mark user online ────────────────────────────────────────────────────
    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);           // personal room
    socket.join(`role:${role}`);             // role broadcast room
    io.emit("presence:update", { userId, online: true });

    console.log(`[Socket] ${name} (${role}) connected — ${socket.id}`);

    // ── Join a conversation room ────────────────────────────────────────────
    // Client emits: { teacherId, studentId }
    socket.on("chat:join", ({ teacherId, studentId }) => {
      const room = `conv:${convKey(teacherId, studentId)}`;
      socket.join(room);

      // Mark messages as read when joining
      markRead(teacherId, studentId, role);
      io.to(`user:${userId}`).emit("chat:read_ack", { teacherId, studentId });

      // Notify the other party their messages were read
      const otherId = role === "teacher" ? studentId : teacherId;
      io.to(`user:${otherId}`).emit("chat:messages_read", { teacherId, studentId, byRole: role });
    });

    // ── Send a message ──────────────────────────────────────────────────────
    // Client emits: { teacherId, studentId, text }
    socket.on("chat:send", ({ teacherId, studentId, text }) => {
      if (!text?.trim()) return;

      const msg = {
        id: uuidv4(),
        from: userId,
        fromRole: role,
        text: text.trim(),
        ts: Date.now(),
        read: false,
      };

      addMessage(teacherId, studentId, msg);

      const room = `conv:${convKey(teacherId, studentId)}`;

      // Broadcast to everyone in the conversation room (both sender and receiver)
      io.to(room).emit("chat:message", { teacherId, studentId, message: msg });

      // Also push to the other user's personal room in case they're not in the conv room
      const otherId = role === "teacher" ? studentId : teacherId;
      io.to(`user:${otherId}`).emit("chat:message", { teacherId, studentId, message: msg });
    });

    // ── Typing indicator ────────────────────────────────────────────────────
    // Client emits: { teacherId, studentId, typing: true|false }
    socket.on("chat:typing", ({ teacherId, studentId, typing }) => {
      const otherId = role === "teacher" ? studentId : teacherId;
      io.to(`user:${otherId}`).emit("chat:typing", {
        teacherId, studentId,
        userId, role, typing,
      });
    });

    // ── Mark read ───────────────────────────────────────────────────────────
    socket.on("chat:mark_read", ({ teacherId, studentId }) => {
      markRead(teacherId, studentId, role);
      const otherId = role === "teacher" ? studentId : teacherId;
      io.to(`user:${otherId}`).emit("chat:messages_read", { teacherId, studentId, byRole: role });
    });

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("presence:update", { userId, online: false });
      console.log(`[Socket] ${name} disconnected`);
    });
  });
};
