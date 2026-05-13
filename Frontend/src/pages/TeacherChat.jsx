import { useState, useEffect, useRef, useCallback } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import { MessageCircle, Send, Search, BookMarked, CheckCheck } from "lucide-react";
import { cn } from "../lib/utils";
import {
  loadStore, addMessage, markRead, setTyping, isTyping,
  unreadCount, convKey, formatSidebarTime, formatBubbleTime, groupByDate,
  CHAT_STORE_KEY,
} from "../lib/chatStore";

// ── Constants ─────────────────────────────────────────────────────────────────

// Teacher is Prof. Ramesh Iyer (t1) — the logged-in teacher
const TEACHER_ID = "t1";

const STUDENTS = [
  { id: "s1", name: "Aarav Sharma",   class: "CS-A", subject: "DBMS",  avatar: "AS", color: "bg-violet-500", online: true  },
  { id: "s2", name: "Priya Nair",     class: "CS-A", subject: "OS",    avatar: "PN", color: "bg-blue-500",   online: true  },
  { id: "s3", name: "Rohan Mehta",    class: "CS-A", subject: "AI/ML", avatar: "RM", color: "bg-orange-500", online: false },
  { id: "s4", name: "Sneha Pillai",   class: "CS-B", subject: "CN",    avatar: "SP", color: "bg-teal-500",   online: true  },
  { id: "s5", name: "Karan Joshi",    class: "CS-B", subject: "Math",  avatar: "KJ", color: "bg-green-500",  online: false },
  { id: "s6", name: "Ananya Iyer",    class: "CS-B", subject: "DBMS",  avatar: "AI", color: "bg-pink-500",   online: false },
  { id: "s7", name: "Dev Patel",      class: "CS-C", subject: "OS",    avatar: "DP", color: "bg-yellow-500", online: true  },
  { id: "s8", name: "Meera Krishnan", class: "CS-C", subject: "Ethics",avatar: "MK", color: "bg-red-500",    online: false },
];

const CLASSES = ["CS-A", "CS-B", "CS-C"];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TeacherChat() {
  const [store, setStore]           = useState(loadStore);
  const [activeStudentId, setActiveStudentId] = useState(STUDENTS[0].id);
  const [input, setInput]           = useState("");
  const [search, setSearch]         = useState("");
  const [studentTyping, setStudentTyping] = useState(false);
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const typingTimer = useRef(null);

  // ── Cross-tab sync ─────────────────────────────────────────────────────────
  const syncStore = useCallback(() => {
    const fresh = loadStore();
    setStore(fresh);
    const cid = convKey(TEACHER_ID, activeStudentId);
    setStudentTyping(isTyping("student", cid));
  }, [activeStudentId]);

  useEffect(() => {
    const interval = setInterval(syncStore, 500);
    const onStorage = (e) => { if (e.key === CHAT_STORE_KEY || e.key === null) syncStore(); };
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(interval); window.removeEventListener("storage", onStorage); };
  }, [syncStore]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    setStore(prev => markRead(prev, TEACHER_ID, activeStudentId, "teacher"));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeStudentId, store[convKey(TEACHER_ID, activeStudentId)]?.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store, activeStudentId]);

  function handleInputChange(e) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";

    const cid = convKey(TEACHER_ID, activeStudentId);
    setTyping("teacher", cid, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping("teacher", cid, false), 2500);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const cid = convKey(TEACHER_ID, activeStudentId);
    setTyping("teacher", cid, false);
    clearTimeout(typingTimer.current);

    const msg = { id: `t-${Date.now()}`, from: "teacher", text, ts: Date.now(), read: false };
    const updated = addMessage(store, TEACHER_ID, activeStudentId, msg);
    setStore(updated);
    setInput("");
    if (inputRef.current) { inputRef.current.style.height = "24px"; inputRef.current.focus(); }
  }

  const activeStudent  = STUDENTS.find(s => s.id === activeStudentId);
  const cid            = convKey(TEACHER_ID, activeStudentId);
  const activeMessages = store[cid] ?? [];

  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase())
  );

  function lastMsg(sid) {
    const msgs = store[convKey(TEACHER_ID, sid)];
    return msgs?.length ? msgs[msgs.length - 1] : null;
  }

  function unread(sid) {
    return unreadCount(store, TEACHER_ID, sid, "teacher");
  }

  // Total unread across all students
  const totalUnread = STUDENTS.reduce((sum, s) => sum + unread(s.id), 0);

  return (
    <TeacherLayout>
      <div className="flex gap-5" style={{ height: "calc(100vh - 10rem)" }}>

        {/* ── Contacts sidebar ── */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 bg-white dark:bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Student Doubts</h2>
              {totalUnread > 0 && (
                <span className="ml-auto min-w-[20px] h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1.5">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full h-8 pl-8 pr-3 rounded-lg border bg-muted/20 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {CLASSES.map(cls => {
              const students = filteredStudents.filter(s => s.class === cls);
              if (!students.length) return null;
              return (
                <div key={cls}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-3 pb-1">{cls}</p>
                  {students.map(student => {
                    const last    = lastMsg(student.id);
                    const badge   = unread(student.id);
                    const isActive = student.id === activeStudentId;
                    return (
                      <button
                        key={student.id}
                        onClick={() => setActiveStudentId(student.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-r-2",
                          isActive ? "bg-primary/5 border-primary" : "border-transparent hover:bg-muted/40"
                        )}
                      >
                        <div className="relative shrink-0">
                          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold", student.color)}>
                            {student.avatar}
                          </div>
                          {student.online && <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={cn("text-sm truncate", badge > 0 ? "font-bold" : "font-semibold")}>{student.name}</p>
                            {last && <span className="text-[10px] text-muted-foreground shrink-0">{formatSidebarTime(last.ts)}</span>}
                          </div>
                          <div className="flex items-center justify-between gap-1 mt-0.5">
                            <p className={cn("text-xs truncate", badge > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                              {last ? (last.from === "teacher" ? `You: ${last.text}` : last.text) : student.subject}
                            </p>
                            {badge > 0 && (
                              <span className="min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center px-1 shrink-0">
                                {badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Chat window ── */}
        <div className="flex-1 flex flex-col bg-white dark:bg-card rounded-2xl border shadow-sm overflow-hidden min-w-0">

          {/* Header */}
          {activeStudent && (
            <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0">
              <div className="relative shrink-0">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold", activeStudent.color)}>
                  {activeStudent.avatar}
                </div>
                {activeStudent.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{activeStudent.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <BookMarked className="w-3 h-3" />
                  {activeStudent.class} · {activeStudent.subject}
                  <span className={cn("ml-1 font-medium", activeStudent.online ? "text-green-600" : "text-muted-foreground")}>
                    · {studentTyping ? "typing..." : activeStudent.online ? "Online" : "Offline"}
                  </span>
                </p>
              </div>
              <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold shrink-0", activeStudent.online ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>
                {activeStudent.class}
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-slate-50 dark:bg-muted/10">
            {groupByDate(activeMessages).map(item => {
              if (item.type === "date") return (
                <div key={item.key} className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium bg-slate-50 dark:bg-muted/10 px-3">{item.label}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              );

              const isTeacher = item.from === "teacher";
              return (
                <div key={item.id} className={cn("flex gap-2 items-end py-0.5", isTeacher ? "flex-row-reverse" : "flex-row")}>
                  {!isTeacher && (
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1", activeStudent?.color)}>
                      {activeStudent?.avatar}
                    </div>
                  )}
                  <div className={cn("max-w-[70%] flex flex-col gap-0.5", isTeacher ? "items-end" : "items-start")}>
                    <div className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words",
                      isTeacher ? "bg-primary text-white rounded-br-sm" : "bg-white dark:bg-card border shadow-sm rounded-bl-sm"
                    )}>
                      {item.text}
                    </div>
                    <div className={cn("flex items-center gap-1 text-[10px] text-muted-foreground px-1", isTeacher ? "flex-row-reverse" : "flex-row")}>
                      <span>{formatBubbleTime(item.ts)}</span>
                      {isTeacher && (
                        <CheckCheck className={cn("w-3 h-3", item.read ? "text-blue-500" : "text-muted-foreground/50")} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {studentTyping && (
              <div className="flex gap-2 items-end py-0.5">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0", activeStudent?.color)}>
                  {activeStudent?.avatar}
                </div>
                <div className="bg-white dark:bg-card border shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t bg-white dark:bg-card shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-end rounded-2xl border bg-muted/20 px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={`Reply to ${activeStudent?.name.split(" ")[0] ?? "student"}...`}
                  className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed max-h-28 overflow-y-auto"
                  style={{ height: "24px" }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
