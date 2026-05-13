import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BookOpen, X, ChevronRight,
  CalendarCheck, BarChart3, ClipboardList, FlaskConical,
  Clock, CheckCircle, AlertCircle, Users, UserCircle, FileText,
  Timer, StickyNote, Plus, Trash2, Pin, PinOff, Pencil, Save, MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  {
    id: 1,
    code: "CS401",
    name: "Database Management Systems",
    short: "DBMS",
    teacher: "Prof. Ramesh Iyer",
    credits: 4,
    color: "bg-violet-500",
    light: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    schedule: "Mon / Wed / Fri — 9:00 AM",
    room: "CS Lab 2",
    marks: 88,
    attendance: 91,
    grade: "A",
    topics: ["ER Model", "Normalization", "SQL", "Transactions", "Indexing", "NoSQL"],
    assignments: [
      { title: "ER Diagram — Hospital DB",  due: "Tomorrow",  status: "pending" },
      { title: "SQL Query Assignment",       due: "Submitted", status: "done"    },
      { title: "Normalization Worksheet",    due: "In 4 days", status: "pending" },
    ],
    tests: [
      { title: "DBMS Mid-Term",   date: "Wed, 15 May", type: "Mid-Term" },
      { title: "SQL Quiz",        date: "Fri, 17 May", type: "Quiz"     },
    ],
  },
  {
    id: 2,
    code: "CS402",
    name: "Operating Systems",
    short: "OS",
    teacher: "Prof. Sunita Menon",
    credits: 4,
    color: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    schedule: "Tue / Thu — 10:30 AM",
    room: "Room 204",
    marks: 82,
    attendance: 85,
    grade: "B+",
    topics: ["Process Management", "Scheduling", "Memory Management", "File Systems", "Deadlocks", "Virtual Memory"],
    assignments: [
      { title: "Process Scheduling Simulation", due: "In 3 days", status: "pending" },
      { title: "Memory Management Report",      due: "Overdue",   status: "overdue" },
    ],
    tests: [
      { title: "OS Unit Test 2", date: "Mon, 20 May", type: "Unit Test" },
    ],
  },
  {
    id: 3,
    code: "MA401",
    name: "Engineering Mathematics IV",
    short: "Mathematics",
    teacher: "Prof. Kavita Joshi",
    credits: 3,
    color: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    schedule: "Mon / Wed / Fri — 11:00 AM",
    room: "Room 101",
    marks: 92,
    attendance: 94,
    grade: "A",
    topics: ["Laplace Transforms", "Fourier Series", "Complex Analysis", "Probability", "Statistics", "Numerical Methods"],
    assignments: [
      { title: "Laplace Transform Problems", due: "Submitted", status: "done"    },
      { title: "Fourier Series Assignment",  due: "Tomorrow",  status: "pending" },
    ],
    tests: [
      { title: "Mathematics Mid-Term", date: "Tomorrow",   type: "Mid-Term" },
      { title: "Statistics Quiz",      date: "Fri, 24 May", type: "Quiz"    },
    ],
  },
  {
    id: 4,
    code: "CS403",
    name: "Artificial Intelligence & ML",
    short: "AI/ML",
    teacher: "Prof. Arjun Nair",
    credits: 4,
    color: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    schedule: "Tue / Thu / Sat — 2:00 PM",
    room: "CS Lab 1",
    marks: 95,
    attendance: 96,
    grade: "A+",
    topics: ["Search Algorithms", "Machine Learning", "Neural Networks", "NLP", "Computer Vision", "Reinforcement Learning"],
    assignments: [
      { title: "ML Model — Iris Dataset",    due: "In 5 days", status: "pending" },
      { title: "Neural Network Report",      due: "Submitted", status: "done"    },
      { title: "NLP Mini Project",           due: "In 8 days", status: "pending" },
    ],
    tests: [
      { title: "AI/ML Unit Test 3", date: "Wed, 22 May", type: "Unit Test" },
    ],
  },
  {
    id: 5,
    code: "CS404",
    name: "Computer Networks",
    short: "CN",
    teacher: "Prof. Deepa Pillai",
    credits: 3,
    color: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    schedule: "Mon / Wed — 3:30 PM",
    room: "Room 305",
    marks: 79,
    attendance: 82,
    grade: "B+",
    topics: ["OSI Model", "TCP/IP", "Routing", "DNS & HTTP", "Network Security", "Wireless Networks"],
    assignments: [
      { title: "Network Topology Design", due: "In 2 days", status: "pending" },
      { title: "TCP/IP Analysis Lab",     due: "Submitted", status: "done"    },
    ],
    tests: [
      { title: "CN Quiz 2",       date: "Thu, 23 May", type: "Quiz"     },
      { title: "CN Mid-Term",     date: "Mon, 27 May", type: "Mid-Term" },
    ],
  },
  {
    id: 6,
    code: "HS401",
    name: "Professional Ethics & Communication",
    short: "Ethics",
    teacher: "Prof. Meera Sharma",
    credits: 2,
    color: "bg-pink-500",
    light: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    schedule: "Fri — 4:00 PM",
    room: "Room 102",
    marks: 87,
    attendance: 88,
    grade: "A",
    topics: ["Engineering Ethics", "IPR", "Professional Conduct", "Technical Writing", "Presentation Skills", "Team Dynamics"],
    assignments: [
      { title: "Ethics Case Study",        due: "Submitted", status: "done"    },
      { title: "Technical Report Writing", due: "In 6 days", status: "pending" },
    ],
    tests: [
      { title: "Ethics Unit Test", date: "Fri, 31 May", type: "Unit Test" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function marksBg(m) {
  if (m >= 90) return "bg-green-500";
  if (m >= 75) return "bg-blue-500";
  if (m >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function attendanceBadge(a) {
  if (a >= 90) return "bg-green-100 text-green-700";
  if (a >= 75) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function gradeBadge(g) {
  if (g === "A+" || g === "A") return "bg-green-100 text-green-700";
  if (g === "B+" || g === "B") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function StudentNav({ onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-card/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <Link to="/student/attendance" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <CalendarCheck className="w-4 h-4" /> Attendance
          </Link>
          <Link to="/student/materials" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <FileText className="w-4 h-4" /> Materials
          </Link>
          <Link to="/student/quizzes" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <Timer className="w-4 h-4" /> Quizzes
          </Link>
          <Link to="/student/chat" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
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

// ── Subject Detail Drawer ─────────────────────────────────────────────────────

function SubjectDrawer({ subject, onClose }) {
  const pendingCount = subject.assignments.filter(a => a.status === "pending").length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Drawer header */}
        <div className={cn("h-2 shrink-0", subject.color)} />
        <div className="flex items-start justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", subject.color)}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">{subject.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{subject.code} · {subject.credits} Credits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Marks",      value: `${subject.marks}%`,    badge: marksBg(subject.marks),           isBar: true },
              { label: "Attendance", value: `${subject.attendance}%`, badge: attendanceBadge(subject.attendance), isBar: false },
              { label: "Grade",      value: subject.grade,           badge: gradeBadge(subject.grade),        isBar: false },
            ].map(({ label, value, badge, isBar }) => (
              <div key={label} className="rounded-xl border bg-muted/20 p-3 text-center">
                <p className={cn("text-lg font-extrabold", isBar ? "" : "")}>{value}</p>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block", badge)}>{label}</span>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="space-y-2.5">
            {[
              { icon: UserCircle,    label: "Teacher",  value: subject.teacher  },
              { icon: Clock,         label: "Schedule", value: subject.schedule },
              { icon: Users,         label: "Room",     value: subject.room     },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Marks progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-muted-foreground">Marks Progress</span>
              <span className="font-semibold">{subject.marks}/100</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", marksBg(subject.marks))} style={{ width: `${subject.marks}%` }} />
            </div>
          </div>

          {/* Topics covered */}
          <div>
            <p className="text-sm font-semibold mb-2">Topics Covered</p>
            <div className="flex flex-wrap gap-2">
              {subject.topics.map(t => (
                <span key={t} className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", subject.light, subject.text, subject.border)}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-primary" /> Assignments
              </p>
              {pendingCount > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">{pendingCount} pending</span>
              )}
            </div>
            <div className="space-y-2">
              {subject.assignments.map(a => (
                <div key={a.title} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                  <div className="flex items-center gap-2 min-w-0">
                    {a.status === "done"
                      ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      : a.status === "overdue"
                      ? <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      : <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                    }
                    <p className="text-sm font-medium truncate">{a.title}</p>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2",
                    a.status === "done"    ? "bg-green-100 text-green-700" :
                    a.status === "overdue" ? "bg-red-100 text-red-700"    :
                    "bg-yellow-100 text-yellow-700"
                  )}>{a.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming tests */}
          <div>
            <p className="text-sm font-semibold flex items-center gap-1.5 mb-2">
              <FlaskConical className="w-4 h-4 text-primary" /> Upcoming Tests
            </p>
            <div className="space-y-2">
              {subject.tests.map(t => (
                <div key={t.title} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.title}</p>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{t.type}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0">{t.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notes helpers ────────────────────────────────────────────────────────────

const NOTES_KEY = "gs_subject_notes";

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY)) ?? []; }
  catch { return []; }
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// ── Notes Section ─────────────────────────────────────────────────────────────

function NotesSection() {
  const [notes, setNotes]               = useState(loadNotes);
  const [filterSubject, setFilterSubject] = useState("all");
  const [title, setTitle]               = useState("");
  const [body, setBody]                 = useState("");
  const [noteSubject, setNoteSubject]   = useState(SUBJECTS[0].id);
  const [editId, setEditId]             = useState(null);
  const titleRef                        = useRef(null);

  useEffect(() => { saveNotes(notes); }, [notes]);

  const filtered = notes
    .filter(n => filterSubject === "all" || n.subjectId === filterSubject)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt);

  function handleSave() {
    if (!title.trim() && !body.trim()) return;
    if (editId) {
      setNotes(prev => prev.map(n => n.id === editId
        ? { ...n, title: title.trim(), body: body.trim(), updatedAt: Date.now() }
        : n
      ));
      setEditId(null);
    } else {
      setNotes(prev => [{
        id: Date.now(),
        subjectId: noteSubject,
        title: title.trim(),
        body: body.trim(),
        pinned: false,
        createdAt: Date.now(),
        updatedAt: null,
      }, ...prev]);
    }
    setTitle(""); setBody("");
  }

  function handleEdit(note) {
    setEditId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setNoteSubject(note.subjectId);
    titleRef.current?.focus();
  }

  function handleDelete(id) {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editId === id) { setEditId(null); setTitle(""); setBody(""); }
  }

  function handlePin(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }

  function handleCancelEdit() {
    setEditId(null); setTitle(""); setBody("");
  }

  const subjectOf = (id) => SUBJECTS.find(s => s.id === id);

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">My Notes</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{notes.length}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-5 items-start">

        {/* Subject filter sidebar */}
        <div className="bg-white dark:bg-card rounded-2xl border shadow-sm p-3 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">Filter by Subject</p>
          <button
            onClick={() => setFilterSubject("all")}
            className={cn(
              "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left",
              filterSubject === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> All Subjects</span>
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold", filterSubject === "all" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>{notes.length}</span>
          </button>
          {SUBJECTS.map(sub => {
            const count = notes.filter(n => n.subjectId === sub.id).length;
            return (
              <button
                key={sub.id}
                onClick={() => setFilterSubject(sub.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left",
                  filterSubject === sub.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", sub.color)} />
                  <span className="truncate">{sub.short}</span>
                </span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold shrink-0", filterSubject === sub.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Right panel: composer + notes list */}
        <div className="space-y-4">

          {/* Composer */}
          <div className="bg-white dark:bg-card rounded-2xl border shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{editId ? "Edit Note" : "New Note"}</p>
              {editId && (
                <button onClick={handleCancelEdit} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </div>
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full h-9 px-3 rounded-xl border bg-muted/20 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <textarea
              rows={3}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your note here..."
              className="w-full px-3 py-2.5 rounded-xl border bg-muted/20 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition"
            />
            <div className="flex items-center justify-between gap-3">
              {!editId && (
                <select
                  value={noteSubject}
                  onChange={e => setNoteSubject(Number(e.target.value))}
                  className="h-9 px-3 rounded-xl border bg-muted/20 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.short}</option>)}
                </select>
              )}
              <button
                onClick={handleSave}
                disabled={!title.trim() && !body.trim()}
                className="ml-auto flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {editId ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Plus className="w-3.5 h-3.5" /> Add Note</>}
              </button>
            </div>
          </div>

          {/* Notes list */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-card rounded-2xl border shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <StickyNote className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">No notes yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first note using the composer above.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map(note => {
                const sub = subjectOf(note.subjectId);
                return (
                  <div
                    key={note.id}
                    className={cn(
                      "relative bg-white dark:bg-card rounded-2xl border shadow-sm p-4 flex flex-col gap-2 transition-shadow hover:shadow-md",
                      note.pinned && "ring-2 ring-primary/30"
                    )}
                  >
                    {/* Color bar */}
                    <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-2xl", sub?.color)} />

                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pt-1">
                      <div className="flex-1 min-w-0">
                        {note.title && <p className="text-sm font-semibold leading-tight truncate">{note.title}</p>}
                        <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1", sub?.light, sub?.text)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", sub?.color)} />
                          {sub?.short}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handlePin(note.id)}
                          className={cn("p-1.5 rounded-lg transition-colors", note.pinned ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted")}
                          title={note.pinned ? "Unpin" : "Pin"}
                        >
                          {note.pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleEdit(note)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    {note.body && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">{note.body}</p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t text-xs text-muted-foreground">
                      <span>{new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</span>
                      {note.updatedAt && <span className="italic">edited</span>}
                      {note.pinned && <span className="text-primary font-semibold flex items-center gap-0.5"><Pin className="w-3 h-3" /> Pinned</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentSubjects() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const totalCredits  = SUBJECTS.reduce((s, sub) => s + sub.credits, 0);
  const avgMarks      = Math.round(SUBJECTS.reduce((s, sub) => s + sub.marks, 0) / SUBJECTS.length);
  const avgAttendance = Math.round(SUBJECTS.reduce((s, sub) => s + sub.attendance, 0) / SUBJECTS.length);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Subjects</h1>
            <p className="text-sm text-muted-foreground mt-1">4th Semester · Section A · Computer Science & Engineering</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Subjects",    value: SUBJECTS.length, color: "text-primary"      },
              { label: "Credits",     value: totalCredits,    color: "text-violet-600"   },
              { label: "Avg Marks",   value: `${avgMarks}%`,  color: "text-green-600"    },
              { label: "Avg Attend.", value: `${avgAttendance}%`, color: "text-blue-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center bg-white rounded-xl border px-3 py-2 shadow-sm">
                <p className={cn("text-lg font-extrabold leading-none", color)}>{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subject grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" id="subjects">
          {SUBJECTS.map(sub => (
            <Card
              key={sub.id}
              onClick={() => setSelected(sub)}
              className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={cn("h-1.5 rounded-t-xl", sub.color)} />
              <CardContent className="pt-4 pb-5 px-5">

                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", sub.color)}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{sub.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{sub.code} · {sub.credits} Credits</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Teacher */}
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                  <UserCircle className="w-3.5 h-3.5" /> {sub.teacher}
                </p>

                {/* Marks bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Marks</span>
                    <span className="font-semibold">{sub.marks}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", marksBg(sub.marks))} style={{ width: `${sub.marks}%` }} />
                  </div>
                </div>

                {/* Footer chips */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", attendanceBadge(sub.attendance))}>
                      <CalendarCheck className="w-3 h-3 inline mr-0.5" />{sub.attendance}%
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", gradeBadge(sub.grade))}>
                      {sub.grade}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{sub.schedule.split("—")[0].trim()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Notes section */}
        <NotesSection />

      </main>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>

      {selected && <SubjectDrawer subject={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
