import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BookOpen, Search, X,
  FileText, Presentation, Video, StickyNote, Link2,
  PlayCircle, Download, ExternalLink, Clock, User,
  ChevronRight, Filter, BarChart3, CalendarCheck, Timer, MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";

// ── Types config ──────────────────────────────────────────────────────────────

const TYPES = {
  pdf:     { label: "PDF",              icon: FileText,     color: "bg-red-500",    light: "bg-red-50 text-red-700 border-red-200"       },
  ppt:     { label: "PPT",              icon: Presentation, color: "bg-orange-500", light: "bg-orange-50 text-orange-700 border-orange-200" },
  video:   { label: "Video",            icon: Video,        color: "bg-blue-500",   light: "bg-blue-50 text-blue-700 border-blue-200"     },
  notes:   { label: "Notes",            icon: StickyNote,   color: "bg-yellow-500", light: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  link:    { label: "External Link",    icon: Link2,        color: "bg-teal-500",   light: "bg-teal-50 text-teal-700 border-teal-200"     },
  lecture: { label: "Recorded Lecture", icon: PlayCircle,   color: "bg-violet-500", light: "bg-violet-50 text-violet-700 border-violet-200" },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { id: "all",  name: "All Subjects",                    color: "bg-gray-500"   },
  { id: "dbms", name: "Database Management Systems",     color: "bg-violet-500" },
  { id: "os",   name: "Operating Systems",               color: "bg-blue-500"   },
  { id: "math", name: "Engineering Mathematics IV",      color: "bg-green-500"  },
  { id: "aiml", name: "Artificial Intelligence & ML",    color: "bg-orange-500" },
  { id: "cn",   name: "Computer Networks",               color: "bg-teal-500"   },
  { id: "eth",  name: "Professional Ethics",             color: "bg-pink-500"   },
];

const MATERIALS = [
  // DBMS
  { id: 1,  subject: "dbms", type: "pdf",     title: "DBMS Unit 1 — ER Model & Normalization",       teacher: "Prof. Ramesh Iyer",   size: "2.4 MB",  uploaded: "10 May 2025",  desc: "Complete notes on Entity-Relationship model, normalization up to BCNF with solved examples.",         url: "#" },
  { id: 2,  subject: "dbms", type: "ppt",     title: "SQL Deep Dive — Joins, Subqueries & Views",    teacher: "Prof. Ramesh Iyer",   size: "5.1 MB",  uploaded: "12 May 2025",  desc: "Presentation slides covering all SQL join types, correlated subqueries, and view creation.",          url: "#" },
  { id: 3,  subject: "dbms", type: "video",   title: "Transactions & ACID Properties Explained",     teacher: "Prof. Ramesh Iyer",   size: "45 min",  uploaded: "8 May 2025",   desc: "Video lecture explaining ACID properties, concurrency control, and two-phase locking protocol.",     url: "#" },
  { id: 4,  subject: "dbms", type: "notes",   title: "Indexing & Hashing — Quick Reference Notes",   teacher: "Prof. Ramesh Iyer",   size: "320 KB",  uploaded: "14 May 2025",  desc: "Concise handwritten-style notes on B+ trees, hash indexing, and query optimization basics.",         url: "#" },
  { id: 5,  subject: "dbms", type: "link",    title: "W3Schools SQL Tutorial",                       teacher: "Prof. Ramesh Iyer",   size: "—",       uploaded: "5 May 2025",   desc: "Interactive SQL tutorial with live editor. Covers all SQL commands with examples.",                   url: "https://www.w3schools.com/sql/" },
  { id: 6,  subject: "dbms", type: "lecture", title: "Recorded Lecture — NoSQL & MongoDB Intro",     teacher: "Prof. Ramesh Iyer",   size: "1h 10m",  uploaded: "13 May 2025",  desc: "Full recorded class on NoSQL databases, CAP theorem, and hands-on MongoDB shell commands.",          url: "#" },

  // OS
  { id: 7,  subject: "os",   type: "pdf",     title: "Process Management & Scheduling Algorithms",   teacher: "Prof. Sunita Menon",  size: "3.1 MB",  uploaded: "9 May 2025",   desc: "Detailed PDF covering FCFS, SJF, Round Robin, and Priority scheduling with Gantt chart examples.",  url: "#" },
  { id: 8,  subject: "os",   type: "video",   title: "Deadlocks — Detection, Prevention & Recovery", teacher: "Prof. Sunita Menon",  size: "38 min",  uploaded: "11 May 2025",  desc: "Animated video explaining deadlock conditions, Banker's algorithm, and recovery strategies.",        url: "#" },
  { id: 9,  subject: "os",   type: "ppt",     title: "Memory Management — Paging & Segmentation",    teacher: "Prof. Sunita Menon",  size: "4.2 MB",  uploaded: "7 May 2025",   desc: "Slides on virtual memory, page replacement algorithms (LRU, FIFO, Optimal) and segmentation.",     url: "#" },
  { id: 10, subject: "os",   type: "lecture", title: "Recorded Lecture — File Systems & I/O",        teacher: "Prof. Sunita Menon",  size: "55 min",  uploaded: "6 May 2025",   desc: "Recorded session on file system structures, disk scheduling (SSTF, SCAN) and I/O management.",     url: "#" },
  { id: 11, subject: "os",   type: "notes",   title: "OS Mid-Term Revision Notes",                   teacher: "Prof. Sunita Menon",  size: "410 KB",  uploaded: "14 May 2025",  desc: "Compact revision notes covering all units — ideal for last-minute exam preparation.",               url: "#" },

  // Math
  { id: 12, subject: "math", type: "pdf",     title: "Laplace Transforms — Theory & Problems",       teacher: "Prof. Kavita Joshi",  size: "1.8 MB",  uploaded: "8 May 2025",   desc: "Comprehensive PDF with Laplace transform tables, properties, and 30 solved problems.",              url: "#" },
  { id: 13, subject: "math", type: "ppt",     title: "Fourier Series — Lecture Slides",              teacher: "Prof. Kavita Joshi",  size: "2.9 MB",  uploaded: "10 May 2025",  desc: "Slides covering Fourier series expansion, Dirichlet conditions, and half-range series.",            url: "#" },
  { id: 14, subject: "math", type: "video",   title: "Complex Analysis — Cauchy's Theorem",          teacher: "Prof. Kavita Joshi",  size: "42 min",  uploaded: "12 May 2025",  desc: "Video lecture on analytic functions, Cauchy-Riemann equations, and contour integration.",           url: "#" },
  { id: 15, subject: "math", type: "link",    title: "Wolfram Alpha — Math Problem Solver",          teacher: "Prof. Kavita Joshi",  size: "—",       uploaded: "3 May 2025",   desc: "Use Wolfram Alpha to verify solutions for integrals, transforms, and differential equations.",      url: "https://www.wolframalpha.com/" },

  // AI/ML
  { id: 16, subject: "aiml", type: "pdf",     title: "Machine Learning Algorithms — Cheat Sheet",    teacher: "Prof. Arjun Nair",    size: "1.2 MB",  uploaded: "11 May 2025",  desc: "One-page reference for all major ML algorithms — supervised, unsupervised, and ensemble methods.",  url: "#" },
  { id: 17, subject: "aiml", type: "video",   title: "Neural Networks from Scratch — Part 1",        teacher: "Prof. Arjun Nair",    size: "1h 5m",   uploaded: "9 May 2025",   desc: "Step-by-step video building a neural network in Python using NumPy — no frameworks used.",          url: "#" },
  { id: 18, subject: "aiml", type: "lecture", title: "Recorded Lecture — NLP & Transformers",        teacher: "Prof. Arjun Nair",    size: "1h 20m",  uploaded: "13 May 2025",  desc: "Full class recording on tokenization, word embeddings, attention mechanism, and BERT overview.",    url: "#" },
  { id: 19, subject: "aiml", type: "ppt",     title: "Reinforcement Learning — Concepts & Q-Learning", teacher: "Prof. Arjun Nair", size: "6.3 MB",  uploaded: "7 May 2025",   desc: "Slides on MDP, reward functions, Q-learning algorithm, and OpenAI Gym demo.",                      url: "#" },
  { id: 20, subject: "aiml", type: "link",    title: "Kaggle — Free ML Courses & Datasets",          teacher: "Prof. Arjun Nair",    size: "—",       uploaded: "4 May 2025",   desc: "Kaggle's free micro-courses on ML, deep learning, and feature engineering with hands-on notebooks.", url: "https://www.kaggle.com/learn" },
  { id: 21, subject: "aiml", type: "notes",   title: "AI Search Algorithms — BFS, DFS, A* Notes",   teacher: "Prof. Arjun Nair",    size: "280 KB",  uploaded: "6 May 2025",   desc: "Handwritten-style notes on uninformed and informed search strategies with complexity analysis.",    url: "#" },

  // CN
  { id: 22, subject: "cn",   type: "pdf",     title: "OSI & TCP/IP Model — Layer-by-Layer Guide",    teacher: "Prof. Deepa Pillai",  size: "2.2 MB",  uploaded: "10 May 2025",  desc: "Detailed comparison of OSI and TCP/IP models with protocol examples at each layer.",               url: "#" },
  { id: 23, subject: "cn",   type: "video",   title: "Routing Protocols — RIP, OSPF & BGP",          teacher: "Prof. Deepa Pillai",  size: "50 min",  uploaded: "8 May 2025",   desc: "Video covering distance-vector and link-state routing protocols with packet trace examples.",       url: "#" },
  { id: 24, subject: "cn",   type: "lecture", title: "Recorded Lecture — Network Security Basics",   teacher: "Prof. Deepa Pillai",  size: "48 min",  uploaded: "12 May 2025",  desc: "Recorded class on firewalls, SSL/TLS, VPNs, and common network attack types.",                     url: "#" },
  { id: 25, subject: "cn",   type: "notes",   title: "CN Quick Notes — DNS, HTTP & HTTPS",           teacher: "Prof. Deepa Pillai",  size: "190 KB",  uploaded: "14 May 2025",  desc: "Concise notes on DNS resolution process, HTTP methods, status codes, and HTTPS handshake.",        url: "#" },

  // Ethics
  { id: 26, subject: "eth",  type: "pdf",     title: "Engineering Ethics — Case Studies",            teacher: "Prof. Meera Sharma",  size: "1.5 MB",  uploaded: "9 May 2025",   desc: "Real-world engineering ethics case studies with analysis framework and discussion questions.",      url: "#" },
  { id: 27, subject: "eth",  type: "ppt",     title: "Intellectual Property Rights — Slides",        teacher: "Prof. Meera Sharma",  size: "3.0 MB",  uploaded: "11 May 2025",  desc: "Presentation on patents, copyrights, trademarks, and trade secrets in the context of engineering.", url: "#" },
  { id: 28, subject: "eth",  type: "notes",   title: "Technical Writing — Structure & Style Guide",  teacher: "Prof. Meera Sharma",  size: "240 KB",  uploaded: "13 May 2025",  desc: "Guide to writing technical reports, abstracts, and research papers with formatting templates.",     url: "#" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const { label, icon: Icon, light } = TYPES[type];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border", light)}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

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
          <Link to="/student/attendance" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <CalendarCheck className="w-4 h-4" /> Attendance
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

// ── Material Detail Modal ─────────────────────────────────────────────────────

function MaterialModal({ material, onClose }) {
  const { label, icon: Icon, color, light } = TYPES[material.type];
  const isExternal = material.type === "link";
  const isVideo    = material.type === "video" || material.type === "lecture";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Top color bar */}
        <div className={cn("h-1.5 rounded-t-2xl", color)} />

        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">{material.title}</h2>
              <TypeBadge type={material.type} />
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: User,  label: "Uploaded by", value: material.teacher  },
              { icon: Clock, label: "Uploaded on",  value: material.uploaded },
              { icon: FileText, label: "Size / Duration", value: material.size },
              { icon: BookOpen, label: "Subject", value: SUBJECTS.find(s => s.id === material.subject)?.name ?? "" },
            ].map(({ icon: I, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <I className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xs font-semibold mt-0.5 leading-snug">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className={cn("rounded-xl p-4 border text-sm", light)}>
            {material.desc}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {isExternal ? (
              <a
                href={material.url} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Open Link
              </a>
            ) : isVideo ? (
              <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                <PlayCircle className="w-4 h-4" /> Play
              </button>
            ) : (
              <>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  <ExternalLink className="w-4 h-4" /> View
                </button>
                <button className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border text-sm font-medium hover:bg-muted transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentMaterials() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState("all");
  const [activeType,    setActiveType]    = useState("all");
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState(null);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const filtered = MATERIALS.filter(m => {
    const matchSubject = activeSubject === "all" || m.subject === activeSubject;
    const matchType    = activeType    === "all" || m.type    === activeType;
    const matchSearch  = m.title.toLowerCase().includes(search.toLowerCase()) ||
                         m.teacher.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchType && matchSearch;
  });

  const countFor = (subId) => subId === "all"
    ? MATERIALS.length
    : MATERIALS.filter(m => m.subject === subId).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} />

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-8 gap-6">

        {/* ── Subject sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Subjects</p>
          {SUBJECTS.map(sub => (
            <button
              key={sub.id}
              onClick={() => { setActiveSubject(sub.id); setActiveType("all"); }}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                activeSubject === sub.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", sub.color)} />
                <span className="truncate">{sub.name}</span>
              </div>
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-semibold shrink-0",
                activeSubject === sub.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {countFor(sub.id)}
              </span>
            </button>
          ))}
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Study Materials</h1>
            <p className="text-sm text-muted-foreground mt-1">Access all learning resources uploaded by your teachers.</p>
          </div>

          {/* Search + type filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search materials or teacher..."
                className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            {/* Mobile subject select */}
            <select
              value={activeSubject}
              onChange={e => setActiveSubject(e.target.value)}
              className="lg:hidden h-10 px-3 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Type filter pills */}
          <div className="flex flex-wrap gap-2">
            {[{ key: "all", label: "All", icon: Filter }, ...Object.entries(TYPES).map(([k, v]) => ({ key: k, label: v.label, icon: v.icon }))].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  activeType === key
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground hover:bg-muted border-input"
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> material{filtered.length !== 1 ? "s" : ""}
            {activeSubject !== "all" && <> in <span className="font-semibold text-foreground">{SUBJECTS.find(s => s.id === activeSubject)?.name}</span></>}
          </p>

          {/* Material cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-semibold">No materials found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different subject, type, or search term.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(m => {
                const { icon: Icon, color, light } = TYPES[m.type];
                const subjectName = SUBJECTS.find(s => s.id === m.subject)?.name ?? "";
                const subjectColor = SUBJECTS.find(s => s.id === m.subject)?.color ?? "bg-gray-500";
                return (
                  <Card
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className={cn("h-1 rounded-t-xl", color)} />
                    <CardContent className="pt-4 pb-4 px-4">
                      {/* Icon + title */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{m.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" /> {m.teacher}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.desc}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t">
                        <TypeBadge type={m.type} />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={cn("w-2 h-2 rounded-full", subjectColor)} />
                          <span className="truncate max-w-[90px]">{subjectName.split(" ")[0]}</span>
                          <span>·</span>
                          <span>{m.size}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>

      {selected && <MaterialModal material={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
