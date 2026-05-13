// src/data/store.js
// In-memory data store — acts as the database for this demo
// In production replace with MongoDB/PostgreSQL

const bcrypt = require("bcryptjs");

// ── Users ─────────────────────────────────────────────────────────────────────

const HASHED_STUDENT = bcrypt.hashSync("student123", 10);
const HASHED_TEACHER = bcrypt.hashSync("teacher123", 10);

const users = [
  {
    id: "s1",
    role: "student",
    name: "Aarav Sharma",
    email: "student@gradesphere.com",
    password: HASHED_STUDENT,
    avatar: "AS",
    avatarColor: "bg-violet-500",
    class: "CS-A",
    subject: "DBMS",
    rollNumber: "CS-2022-0341",
    branch: "Computer Science & Engineering",
    semester: "4th Semester",
    section: "Section A",
    phone: "+91 98765 43210",
    address: "42, Shivaji Nagar, Pune, Maharashtra - 411005",
    dob: "12 March 2004",
    gender: "Male",
    guardian: "Rajesh Sharma",
    guardianPhone: "+91 99887 76655",
    bio: "Passionate about technology and problem-solving.",
  },
  {
    id: "s2",
    role: "student",
    name: "Priya Nair",
    email: "priya@gradesphere.com",
    password: HASHED_STUDENT,
    avatar: "PN",
    avatarColor: "bg-blue-500",
    class: "CS-A",
    subject: "OS",
  },
  {
    id: "s3",
    role: "student",
    name: "Rohan Mehta",
    email: "rohan@gradesphere.com",
    password: HASHED_STUDENT,
    avatar: "RM",
    avatarColor: "bg-orange-500",
    class: "CS-A",
    subject: "AI/ML",
  },
  {
    id: "s4",
    role: "student",
    name: "Sneha Pillai",
    email: "sneha@gradesphere.com",
    password: HASHED_STUDENT,
    avatar: "SP",
    avatarColor: "bg-teal-500",
    class: "CS-B",
    subject: "CN",
  },
  {
    id: "t1",
    role: "teacher",
    name: "Prof. Ramesh Iyer",
    email: "teacher@gradesphere.com",
    password: HASHED_TEACHER,
    avatar: "RI",
    avatarColor: "bg-violet-500",
    subject: "Database Management Systems",
    subjectShort: "DBMS",
  },
  {
    id: "t2",
    role: "teacher",
    name: "Prof. Sunita Menon",
    email: "sunita@gradesphere.com",
    password: HASHED_TEACHER,
    avatar: "SM",
    avatarColor: "bg-blue-500",
    subject: "Operating Systems",
    subjectShort: "OS",
  },
  {
    id: "t3",
    role: "teacher",
    name: "Prof. Kavita Joshi",
    email: "kavita@gradesphere.com",
    password: HASHED_TEACHER,
    avatar: "KJ",
    avatarColor: "bg-green-500",
    subject: "Engineering Mathematics IV",
    subjectShort: "Math",
  },
  {
    id: "t4",
    role: "teacher",
    name: "Prof. Arjun Nair",
    email: "arjun@gradesphere.com",
    password: HASHED_TEACHER,
    avatar: "AN",
    avatarColor: "bg-orange-500",
    subject: "Artificial Intelligence & ML",
    subjectShort: "AI/ML",
  },
  {
    id: "t5",
    role: "teacher",
    name: "Prof. Deepa Pillai",
    email: "deepa@gradesphere.com",
    password: HASHED_TEACHER,
    avatar: "DP",
    avatarColor: "bg-teal-500",
    subject: "Computer Networks",
    subjectShort: "CN",
  },
  {
    id: "t6",
    role: "teacher",
    name: "Prof. Meera Sharma",
    email: "meera@gradesphere.com",
    password: HASHED_TEACHER,
    avatar: "MS",
    avatarColor: "bg-pink-500",
    subject: "Professional Ethics",
    subjectShort: "Ethics",
  },
];

// ── Conversations ─────────────────────────────────────────────────────────────
// Key: "t{teacherId}_s{studentId}"

const now = Date.now();

const conversations = {
  "t1_s1": [
    { id: "seed-t1s1-1", from: "t1", fromRole: "teacher", text: "Hello Aarav! Feel free to ask any doubts about DBMS.", ts: now - 86400000 * 2, read: true },
    { id: "seed-t1s1-2", from: "s1", fromRole: "student", text: "Thank you, Prof. Iyer! I had a doubt about normalization.", ts: now - 86400000 * 2 + 60000, read: true },
    { id: "seed-t1s1-3", from: "t1", fromRole: "teacher", text: "Sure, go ahead. What specifically about normalization?", ts: now - 86400000 * 2 + 120000, read: true },
    { id: "seed-t1s1-4", from: "s1", fromRole: "student", text: "What is the difference between 2NF and 3NF?", ts: now - 86400000 + 3600000, read: true },
    { id: "seed-t1s1-5", from: "t1", fromRole: "teacher", text: "2NF removes partial dependencies. 3NF removes transitive dependencies — where a non-key attribute depends on another non-key attribute.", ts: now - 86400000 + 3660000, read: true },
    { id: "seed-t1s1-6", from: "s1", fromRole: "student", text: "That makes it very clear, thank you!", ts: now - 3600000, read: false },
  ],
  "t1_s2": [
    { id: "seed-t1s2-1", from: "s2", fromRole: "student", text: "Prof, I'm confused about the Banker's algorithm for deadlock avoidance.", ts: now - 7200000, read: true },
    { id: "seed-t1s2-2", from: "t1", fromRole: "teacher", text: "Sure Priya! The Banker's algorithm checks if granting a resource request keeps the system in a safe state.", ts: now - 7200000 + 180000, read: true },
  ],
  "t3_s1": [
    { id: "seed-t3s1-1", from: "t3", fromRole: "teacher", text: "Hi Aarav, your Laplace Transform assignment was well done!", ts: now - 86400000, read: true },
    { id: "seed-t3s1-2", from: "s1", fromRole: "student", text: "Thank you Prof. Joshi! I had a doubt about the Fourier series assignment.", ts: now - 86400000 + 300000, read: true },
    { id: "seed-t3s1-3", from: "t3", fromRole: "teacher", text: "Of course, what's the doubt?", ts: now - 86400000 + 360000, read: false },
  ],
  "t4_s3": [
    { id: "seed-t4s3-1", from: "s3", fromRole: "student", text: "Prof Nair, can you explain the difference between supervised and unsupervised learning?", ts: now - 43200000, read: true },
    { id: "seed-t4s3-2", from: "t4", fromRole: "teacher", text: "Great question Rohan! Supervised learning uses labelled data, unsupervised finds patterns in unlabelled data.", ts: now - 43200000 + 600000, read: true },
  ],
};

// ── Online presence ───────────────────────────────────────────────────────────
// userId -> socketId
const onlineUsers = new Map();

// ── Helpers ───────────────────────────────────────────────────────────────────

function convKey(teacherId, studentId) {
  return `${teacherId}_${studentId}`;
}

function getUserById(id) {
  return users.find(u => u.id === id) || null;
}

function getUserByEmail(email) {
  return users.find(u => u.email === email) || null;
}

function getMessages(teacherId, studentId) {
  return conversations[convKey(teacherId, studentId)] || [];
}

function addMessage(teacherId, studentId, msg) {
  const key = convKey(teacherId, studentId);
  if (!conversations[key]) conversations[key] = [];
  conversations[key].push(msg);
  return msg;
}

function markRead(teacherId, studentId, readerRole) {
  const key = convKey(teacherId, studentId);
  const msgs = conversations[key] || [];
  msgs.forEach(m => { if (m.fromRole !== readerRole) m.read = true; });
}

function unreadCount(teacherId, studentId, readerRole) {
  const msgs = getMessages(teacherId, studentId);
  return msgs.filter(m => m.fromRole !== readerRole && !m.read).length;
}

function getStudents() {
  return users.filter(u => u.role === "student");
}

function getTeachers() {
  return users.filter(u => u.role === "teacher");
}

function safeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

module.exports = {
  users,
  conversations,
  onlineUsers,
  convKey,
  getUserById,
  getUserByEmail,
  getMessages,
  addMessage,
  markRead,
  unreadCount,
  getStudents,
  getTeachers,
  safeUser,
};
