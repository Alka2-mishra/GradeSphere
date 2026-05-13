import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BarChart3, BookOpen, CalendarCheck,
  FileText, Timer, MessageCircle, Send, Search, CheckCheck, BookMarked,
} from "lucide-react";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";
import {
  loadStore, addMessage, markRead, setTyping, isTyping,
  unreadCount, convKey, formatSidebarTime, formatBubbleTime, groupByDate,
  CHAT_STORE_KEY,
} from "../lib/chatStore";

// ── Constants ─────────────────────────────────────────────────────────────────

const STUDENT_ID = "s1"; // Aarav Sharma

const TEACHERS = [
  { id: "t1", name: "Prof. Ramesh Iyer",   subject: "Database Management Systems", short: "DBMS",  avatar: "RI", color: "bg-violet-500", online: true  },
  { id: "t2", name: "Prof. Sunita Menon",  subject: "Operating Systems",            short: "OS",    avatar: "SM", color: "bg-blue-500",   online: false },
  { id: "t3", name: "Prof. Kavita Joshi",  subject: "Engineering Mathematics IV",   short: "Math",  avatar: "KJ", color: "bg-green-500",  online: true  },
  { id: "t4", name: "Prof. Arjun Nair",    subject: "Artificial Intelligence & ML", short: "AI/ML", avatar: "AN", color: "bg-orange-500", online: true  },
  { id: "t5", name: "Prof. Deepa Pillai",  subject: "Computer Networks",            short: "CN",    avatar: "DP", color: "bg-teal-500",   online: false },
  { id: "t6", name: "Prof. Meera Sharma",  subject: "Professional Ethics",          short: "Ethics",avatar: "MS", color: "bg-pink-500",   online: false },
];

// ── Navbar ────────────────────────────────────────────────────────────────────

function StudentNav({ onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/student/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">GradeSphere</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <Link to="/student/dashboard" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <BarChart3 className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/student/subjects" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <BookOpen className="w-4 h-4" /> Subjects
          </Link>
          <Link to="/student/attendance" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <CalendarCheck className="w-4 h-4" /> Attendance
          </Link>
          <Link to="/student/materials" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <FileText className="w-4 h-4" /> Materials
          </Link>
          <Link to="/student/chat" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary transition-colors">
            <MessageCircle className="w-4 h-4" /> Chat
          </Link>
          <Link to="/student/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">A</div>
            <span className="hidden md:block text-sm font-semibold">Aarav Sharma</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors border"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StudentChat() {
  const navigate = useNavigate();
  const [store, setStore]         = useState(loadStore);
  const [activeTeacherId, setActiveTeacherId] = useState(TEACHERS[0].id);
  const [input, setInput]         = useState("");
  const [search, setSearch]       = useState("");
  const [teacherTyping, setTeacherTyping] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const typingTimer = useRef(null);

  // ── Cross-tab / cross-window sync ──────────────────────────────────────────
  const syncStore = useCallback(() => {
    const fresh = loadStore();
    setStore(fresh);
    // Check if teacher is typing in active conversation
    const cid = convKey(activeTeacherId, STUDENT_ID);
    setTeacherTyping(isTyping("teacher", cid));
  }, [activeTeacherId]);

  useEffect(() => {
    // Poll every 500ms for real-time feel
    const interval = setInterval(syncStore, 500);
    // Also react to storage events (other tabs)
    const onStorage = (e) => { if (e.key === CHAT_STORE_KEY || e.key === null) syncStore(); };
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(interval); window.removeEventListener("storage", onStorage); };
  }, [syncStore]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    setStore(prev => {
      const updated = markRead(prev, activeTeacherId, STUDENT_ID, "student");
      return updated;
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTeacherId, store[convKey(activeTeacherId, STUDENT_ID)]?.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store, activeTeacherId]);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";

    // Typing indicator
    const cid = convKey(activeTeacherId, STUDENT_ID);
    setTyping("student", cid, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping("student", cid, false), 2500);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const cid = convKey(activeTeacherId, STUDENT_ID);
    setTyping("student", cid, false);
    clearTimeout(typingTimer.current);

    const msg = { id: `s-${Date.now()}`, from: "student", text, ts: Date.now(), read: false };
    const updated = addMessage(store, activeTeacherId, STUDENT_ID, msg);
    setStore(updated);
    setInput("");
    if (inputRef.current) { inputRef.current.style.height = "24px"; inputRef.current.focus(); }
  }

  const activeTeacher  = TEACHERS.find(t => t.id === activeTeacherId);
  const cid            = convKey(activeTeacherId, STUDENT_ID);
  const activeMessages = store[cid] ?? [];

  const filteredTeachers = TEACHERS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  function lastMsg(tid) {
    const msgs = store[convKey(tid, STUDENT_ID)];
    return msgs?.length ? msgs[msgs.length - 1] : null;
  }

  function unread(tid) {
    return unreadCount(store, tid, STUDENT_ID, "student");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex gap-5" style={{ height: "calc(100vh - 9rem)" }}>

          {/* ── Contacts sidebar ── */}
          <aside className="hidden md:flex flex-col w-72 shrink-0 bg-white dark:bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-base">Doubts Chat</h2>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {TEACHERS.filter(t => t.online).length} online
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search teachers..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg border bg-muted/20 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
              {filteredTeachers.map(teacher => {
                const last    = lastMsg(teacher.id);
                const badge   = unread(teacher.id);
                const isActive = teacher.id === activeTeacherId;
                return (
                  <button
                    key={teacher.id}
                    onClick={() => setActiveTeacherId(teacher.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-r-2",
                      isActive ? "bg-primary/5 border-primary" : "border-transparent hover:bg-muted/40"
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold", teacher.color)}>
                        {teacher.avatar}
                      </div>
                      {teacher.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn("text-sm truncate", badge > 0 ? "font-bold" : "font-semibold")}>{teacher.name}</p>
                        {last && <span className="text-[10px] text-muted-foreground shrink-0">{formatSidebarTime(last.ts)}</span>}
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className={cn("text-xs truncate", badge > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                          {last ? (last.from === "student" ? `You: ${last.text}` : last.text) : teacher.short}
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
          </aside>

          {/* ── Chat window ── */}
          <div className="flex-1 flex flex-col bg-white dark:bg-card rounded-2xl border shadow-sm overflow-hidden min-w-0">

            {/* Header */}
            {activeTeacher && (
              <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0">
                <div className="relative shrink-0">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold", activeTeacher.color)}>
                    {activeTeacher.avatar}
                  </div>
                  {activeTeacher.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{activeTeacher.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <BookMarked className="w-3 h-3" />
                    {activeTeacher.subject}
                    <span className={cn("ml-1 font-medium", activeTeacher.online ? "text-green-600" : "text-muted-foreground")}>
                      · {teacherTyping ? "typing..." : activeTeacher.online ? "Online" : "Offline"}
                    </span>
                  </p>
                </div>
                <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold shrink-0", activeTeacher.online ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>
                  {activeTeacher.short}
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

                const isStudent = item.from === "student";
                return (
                  <div key={item.id} className={cn("flex gap-2 items-end py-0.5", isStudent ? "flex-row-reverse" : "flex-row")}>
                    {!isStudent && (
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1", activeTeacher?.color)}>
                        {activeTeacher?.avatar}
                      </div>
                    )}
                    <div className={cn("max-w-[70%] flex flex-col gap-0.5", isStudent ? "items-end" : "items-start")}>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words",
                        isStudent ? "bg-primary text-white rounded-br-sm" : "bg-white dark:bg-card border shadow-sm rounded-bl-sm"
                      )}>
                        {item.text}
                      </div>
                      <div className={cn("flex items-center gap-1 text-[10px] text-muted-foreground px-1", isStudent ? "flex-row-reverse" : "flex-row")}>
                        <span>{formatBubbleTime(item.ts)}</span>
                        {isStudent && (
                          <CheckCheck className={cn("w-3 h-3", item.read ? "text-blue-500" : "text-muted-foreground/50")} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {teacherTyping && (
                <div className="flex gap-2 items-end py-0.5">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0", activeTeacher?.color)}>
                    {activeTeacher?.avatar}
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
                    placeholder={`Ask ${activeTeacher?.name.split(" ")[1] ?? "teacher"} a doubt...`}
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
      </main>

      <footer className="border-t bg-white dark:bg-card py-4 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
