// Shared real-time chat store using localStorage + storage events
// Conversation key format: "t{teacherId}_s{studentId}"  e.g. "t1_s1"

export const CHAT_STORE_KEY = "gs_chat_store";
export const TYPING_KEY     = "gs_chat_typing";

// ── Seed data (first-time only) ───────────────────────────────────────────────

const now = Date.now();

const SEEDS = {
  "t1_s1": [
    { id: "seed-t1s1-1", from: "teacher", text: "Hello Aarav! Feel free to ask any doubts about DBMS.", ts: now - 86400000 * 2, read: true },
    { id: "seed-t1s1-2", from: "student", text: "Thank you, Prof. Iyer! I had a doubt about normalization.", ts: now - 86400000 * 2 + 60000, read: true },
    { id: "seed-t1s1-3", from: "teacher", text: "Sure, go ahead. What specifically about normalization?", ts: now - 86400000 * 2 + 120000, read: true },
    { id: "seed-t1s1-4", from: "student", text: "What is the difference between 2NF and 3NF?", ts: now - 86400000 + 3600000, read: true },
    { id: "seed-t1s1-5", from: "teacher", text: "2NF removes partial dependencies. 3NF goes further and removes transitive dependencies — where a non-key attribute depends on another non-key attribute.", ts: now - 86400000 + 3660000, read: true },
    { id: "seed-t1s1-6", from: "student", text: "That makes it very clear, thank you!", ts: now - 3600000, read: false },
  ],
  "t1_s2": [
    { id: "seed-t1s2-1", from: "student", text: "Prof, I'm confused about the Banker's algorithm for deadlock avoidance.", ts: now - 7200000, read: true },
    { id: "seed-t1s2-2", from: "teacher", text: "Sure Priya! The Banker's algorithm checks if granting a resource request keeps the system in a safe state.", ts: now - 7200000 + 180000, read: true },
  ],
  "t3_s1": [
    { id: "seed-t3s1-1", from: "teacher", text: "Hi Aarav, your Laplace Transform assignment was well done!", ts: now - 86400000, read: true },
    { id: "seed-t3s1-2", from: "student", text: "Thank you Prof. Joshi! I had a doubt about the Fourier series assignment.", ts: now - 86400000 + 300000, read: true },
    { id: "seed-t3s1-3", from: "teacher", text: "Of course, what's the doubt?", ts: now - 86400000 + 360000, read: false },
  ],
  "t4_s3": [
    { id: "seed-t4s3-1", from: "student", text: "Prof Nair, can you explain the difference between supervised and unsupervised learning?", ts: now - 43200000, read: true },
    { id: "seed-t4s3-2", from: "teacher", text: "Great question Rohan! Supervised learning uses labelled data, unsupervised finds patterns in unlabelled data.", ts: now - 43200000 + 600000, read: true },
  ],
};

// ── Core read/write ───────────────────────────────────────────────────────────

export function loadStore() {
  try {
    const raw = localStorage.getItem(CHAT_STORE_KEY);
    if (raw) return JSON.parse(raw);
    // First load — write seeds
    localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(SEEDS));
    return { ...SEEDS };
  } catch {
    return { ...SEEDS };
  }
}

export function writeStore(store) {
  localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(store));
}

// ── Conversation key helpers ──────────────────────────────────────────────────

export function convKey(teacherId, studentId) {
  return `${teacherId}_${studentId}`;
}

export function getMessages(store, teacherId, studentId) {
  return store[convKey(teacherId, studentId)] ?? [];
}

export function addMessage(store, teacherId, studentId, msg) {
  const key = convKey(teacherId, studentId);
  const updated = { ...store, [key]: [...(store[key] ?? []), msg] };
  writeStore(updated);
  return updated;
}

export function markRead(store, teacherId, studentId, reader) {
  // reader = "teacher" | "student" — marks messages NOT from reader as read
  const key = convKey(teacherId, studentId);
  const msgs = store[key] ?? [];
  const updated = {
    ...store,
    [key]: msgs.map(m => m.from !== reader ? { ...m, read: true } : m),
  };
  writeStore(updated);
  return updated;
}

// ── Typing indicator ──────────────────────────────────────────────────────────

export function setTyping(role, convId, isTyping) {
  try {
    const raw = JSON.parse(localStorage.getItem(TYPING_KEY) ?? "{}");
    if (isTyping) {
      raw[`${role}_${convId}`] = Date.now();
    } else {
      delete raw[`${role}_${convId}`];
    }
    localStorage.setItem(TYPING_KEY, JSON.stringify(raw));
  } catch {}
}

export function isTyping(role, convId) {
  try {
    const raw = JSON.parse(localStorage.getItem(TYPING_KEY) ?? "{}");
    const ts = raw[`${role}_${convId}`];
    return ts && Date.now() - ts < 3000;
  } catch { return false; }
}

// ── Unread count helpers ──────────────────────────────────────────────────────

export function unreadCount(store, teacherId, studentId, reader) {
  const msgs = getMessages(store, teacherId, studentId);
  return msgs.filter(m => m.from !== reader && !m.read).length;
}

// ── Time formatters ───────────────────────────────────────────────────────────

export function formatSidebarTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatBubbleTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function groupByDate(msgs) {
  const groups = [];
  let lastDate = null;
  msgs.forEach(msg => {
    const d = new Date(msg.ts).toDateString();
    if (d !== lastDate) {
      const label = (() => {
        const now = new Date();
        const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
        if (d === now.toDateString()) return "Today";
        if (d === yesterday.toDateString()) return "Yesterday";
        return new Date(msg.ts).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      })();
      groups.push({ type: "date", label, key: d });
      lastDate = d;
    }
    groups.push({ type: "msg", ...msg });
  });
  return groups;
}
