import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BookOpen, FileText,
  CalendarCheck, AlertTriangle, CheckCircle, XCircle, Clock,
  TrendingUp, TrendingDown, Minus, BarChart3, ClipboardList, Timer, MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  {
    id: 1, name: "Database Management Systems", code: "CS401",
    color: "#7c3aed", colorClass: "bg-violet-500", lightClass: "bg-violet-50 text-violet-700",
    total: 36, present: 33, absent: 2, late: 1,
    monthly: [88, 91, 94, 92],
    sessions: [
      { date: "14 May", day: "Wed", status: "present" },
      { date: "12 May", day: "Mon", status: "present" },
      { date: "10 May", day: "Fri", status: "late"    },
      { date: "7 May",  day: "Tue", status: "present" },
      { date: "5 May",  day: "Sun", status: "absent"  },
      { date: "3 May",  day: "Fri", status: "present" },
    ],
  },
  {
    id: 2, name: "Operating Systems", code: "CS402",
    color: "#2563eb", colorClass: "bg-blue-500", lightClass: "bg-blue-50 text-blue-700",
    total: 28, present: 24, absent: 3, late: 1,
    monthly: [80, 84, 87, 86],
    sessions: [
      { date: "13 May", day: "Tue", status: "present" },
      { date: "8 May",  day: "Thu", status: "absent"  },
      { date: "6 May",  day: "Tue", status: "present" },
      { date: "1 May",  day: "Thu", status: "present" },
      { date: "29 Apr", day: "Tue", status: "absent"  },
      { date: "24 Apr", day: "Thu", status: "present" },
    ],
  },
  {
    id: 3, name: "Engineering Mathematics IV", code: "MA401",
    color: "#16a34a", colorClass: "bg-green-500", lightClass: "bg-green-50 text-green-700",
    total: 40, present: 38, absent: 1, late: 1,
    monthly: [92, 94, 96, 95],
    sessions: [
      { date: "14 May", day: "Wed", status: "present" },
      { date: "12 May", day: "Mon", status: "present" },
      { date: "9 May",  day: "Fri", status: "present" },
      { date: "7 May",  day: "Wed", status: "late"    },
      { date: "5 May",  day: "Mon", status: "present" },
      { date: "2 May",  day: "Fri", status: "absent"  },
    ],
  },
  {
    id: 4, name: "Artificial Intelligence & ML", code: "CS403",
    color: "#ea580c", colorClass: "bg-orange-500", lightClass: "bg-orange-50 text-orange-700",
    total: 32, present: 31, absent: 1, late: 0,
    monthly: [94, 96, 97, 97],
    sessions: [
      { date: "13 May", day: "Tue", status: "present" },
      { date: "10 May", day: "Sat", status: "present" },
      { date: "8 May",  day: "Thu", status: "present" },
      { date: "6 May",  day: "Tue", status: "present" },
      { date: "3 May",  day: "Sat", status: "absent"  },
      { date: "1 May",  day: "Thu", status: "present" },
    ],
  },
  {
    id: 5, name: "Computer Networks", code: "CS404",
    color: "#0d9488", colorClass: "bg-teal-500", lightClass: "bg-teal-50 text-teal-700",
    total: 24, present: 20, absent: 3, late: 1,
    monthly: [78, 80, 84, 83],
    sessions: [
      { date: "14 May", day: "Wed", status: "present" },
      { date: "12 May", day: "Mon", status: "absent"  },
      { date: "7 May",  day: "Wed", status: "present" },
      { date: "5 May",  day: "Mon", status: "late"    },
      { date: "30 Apr", day: "Wed", status: "absent"  },
      { date: "28 Apr", day: "Mon", status: "present" },
    ],
  },
  {
    id: 6, name: "Professional Ethics", code: "HS401",
    color: "#db2777", colorClass: "bg-pink-500", lightClass: "bg-pink-50 text-pink-700",
    total: 16, present: 14, absent: 1, late: 1,
    monthly: [85, 87, 89, 88],
    sessions: [
      { date: "9 May",  day: "Fri", status: "present" },
      { date: "2 May",  day: "Fri", status: "late"    },
      { date: "25 Apr", day: "Fri", status: "present" },
      { date: "18 Apr", day: "Fri", status: "absent"  },
      { date: "11 Apr", day: "Fri", status: "present" },
      { date: "4 Apr",  day: "Fri", status: "present" },
    ],
  },
];

const MONTHS = ["Feb", "Mar", "Apr", "May"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pct(sub) { return Math.round((sub.present / sub.total) * 100); }

function ringColor(p) {
  if (p >= 90) return "#16a34a";
  if (p >= 75) return "#2563eb";
  if (p >= 60) return "#d97706";
  return "#dc2626";
}

function statusMeta(s) {
  if (s === "present") return { label: "Present", icon: CheckCircle, cls: "text-green-600 bg-green-50 border-green-200" };
  if (s === "absent")  return { label: "Absent",  icon: XCircle,     cls: "text-red-600 bg-red-50 border-red-200"       };
  return                       { label: "Late",    icon: Clock,       cls: "text-yellow-600 bg-yellow-50 border-yellow-200" };
}

function trendIcon(monthly) {
  const diff = monthly[monthly.length - 1] - monthly[0];
  if (diff > 2)  return <TrendingUp  className="w-3.5 h-3.5 text-green-600" />;
  if (diff < -2) return <TrendingDown className="w-3.5 h-3.5 text-red-500"  />;
  return               <Minus        className="w-3.5 h-3.5 text-muted-foreground" />;
}

// ── SVG Ring ──────────────────────────────────────────────────────────────────

function Ring({ pct: p, size = 140, stroke = 12, color = "#7c3aed", children }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (p / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

// ── Bar Graph (monthly trend) ─────────────────────────────────────────────────

function BarGraph({ data, color }) {
  const max = 100;
  return (
    <div className="flex items-end gap-1.5 h-14">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
          <span className="text-[9px] text-muted-foreground font-medium">{v}%</span>
          <div className="w-full rounded-t-sm" style={{ height: `${(v / max) * 44}px`, backgroundColor: color, opacity: 0.85 }} />
          <span className="text-[9px] text-muted-foreground">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Horizontal bar (subject breakdown) ───────────────────────────────────────

function HBar({ value, color }) {
  return (
    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
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
          <Link to="/student/subjects" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <BookOpen className="w-4 h-4" /> Subjects
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
          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors border">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentAttendance() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState(null);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const totalPresent = SUBJECTS.reduce((s, sub) => s + sub.present, 0);
  const totalClasses = SUBJECTS.reduce((s, sub) => s + sub.total,   0);
  const totalAbsent  = SUBJECTS.reduce((s, sub) => s + sub.absent,  0);
  const totalLate    = SUBJECTS.reduce((s, sub) => s + sub.late,    0);
  const overallPct   = Math.round((totalPresent / totalClasses) * 100);
  const overallColor = ringColor(overallPct);

  const selected = activeSubject ? SUBJECTS.find(s => s.id === activeSubject) : null;

  // Monthly overall trend (avg across subjects per month)
  const overallMonthly = MONTHS.map((_, mi) =>
    Math.round(SUBJECTS.reduce((s, sub) => s + sub.monthly[mi], 0) / SUBJECTS.length)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Subject-wise attendance breakdown with trends and session history.</p>
        </div>

        {/* ── Top section: Overall ring + stats + monthly trend ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Overall ring */}
          <Card className="border-0 shadow-sm flex flex-col items-center justify-center py-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">Overall Attendance</p>
            <Ring pct={overallPct} size={160} stroke={14} color={overallColor}>
              <p className="text-4xl font-extrabold leading-none" style={{ color: overallColor }}>{overallPct}%</p>
              <p className="text-xs text-muted-foreground mt-1">{totalPresent}/{totalClasses} classes</p>
            </Ring>
            <div className="flex gap-4 mt-6 text-center">
              {[
                { label: "Present", value: totalPresent, color: "text-green-600" },
                { label: "Absent",  value: totalAbsent,  color: "text-red-600"   },
                { label: "Late",    value: totalLate,    color: "text-yellow-600" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className={cn("text-xl font-extrabold", color)}>{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            {overallPct < 75 && (
              <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Below 75% — attendance shortage!
              </div>
            )}
          </Card>

          {/* Monthly trend bar graph */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Monthly Trend
              </CardTitle>
              <CardDescription>Overall avg attendance — last 4 months</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BarGraph data={overallMonthly} color="#7c3aed" />
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                {[
                  { label: "Best Month",  value: `${Math.max(...overallMonthly)}%`, color: "text-green-600" },
                  { label: "This Month",  value: `${overallMonthly[overallMonthly.length - 1]}%`, color: "text-primary" },
                  { label: "Lowest",      value: `${Math.min(...overallMonthly)}%`, color: "text-red-500"   },
                  { label: "Avg (4 mo.)", value: `${Math.round(overallMonthly.reduce((a,b)=>a+b,0)/overallMonthly.length)}%`, color: "text-blue-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-muted/40 px-3 py-2">
                    <p className={cn("text-base font-extrabold", color)}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject rings grid */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" /> Per-Subject Rings
              </CardTitle>
              <CardDescription>Click a subject for session details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {SUBJECTS.map(sub => {
                  const p = pct(sub);
                  const c = ringColor(p);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubject(activeSubject === sub.id ? null : sub.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all",
                        activeSubject === sub.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      )}
                    >
                      <Ring pct={p} size={56} stroke={5} color={c}>
                        <span className="text-[10px] font-bold" style={{ color: c }}>{p}%</span>
                      </Ring>
                      <span className="text-[10px] font-semibold text-center leading-tight line-clamp-2">{sub.code}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Subject breakdown table ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" /> Subject-wise Breakdown
            </CardTitle>
            <CardDescription>Attendance percentage, classes attended, and monthly trend per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left py-2 pr-4 font-medium">Subject</th>
                    <th className="text-left py-2 pr-4 font-medium">Attended</th>
                    <th className="text-left py-2 pr-4 font-medium w-36">Progress</th>
                    <th className="text-left py-2 pr-4 font-medium">%</th>
                    <th className="text-left py-2 pr-4 font-medium">Absent</th>
                    <th className="text-left py-2 pr-4 font-medium">Late</th>
                    <th className="text-left py-2 pr-4 font-medium">Trend (4mo)</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {SUBJECTS.map(sub => {
                    const p = pct(sub);
                    const c = ringColor(p);
                    const statusLabel = p >= 90 ? "Excellent" : p >= 75 ? "Good" : p >= 60 ? "Low" : "Critical";
                    const statusCls   = p >= 90 ? "bg-green-100 text-green-700" : p >= 75 ? "bg-blue-100 text-blue-700" : p >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setActiveSubject(activeSubject === sub.id ? null : sub.id)}
                        className={cn("cursor-pointer transition-colors", activeSubject === sub.id ? "bg-primary/5" : "hover:bg-muted/30")}
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", sub.colorClass)} />
                            <span className="font-medium truncate max-w-[140px]">{sub.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-semibold">{sub.present}/{sub.total}</td>
                        <td className="py-3 pr-4">
                          <HBar value={p} color={c} />
                        </td>
                        <td className="py-3 pr-4 font-bold" style={{ color: c }}>{p}%</td>
                        <td className="py-3 pr-4 text-red-600 font-semibold">{sub.absent}</td>
                        <td className="py-3 pr-4 text-yellow-600 font-semibold">{sub.late}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1">
                            {trendIcon(sub.monthly)}
                            <BarGraph data={sub.monthly} color={c} />
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", statusCls)}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ── Session log (shown when a subject is selected) ── */}
        {selected && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded-full", selected.colorClass)} />
                    {selected.name} — Session Log
                  </CardTitle>
                  <CardDescription>{selected.code} · Recent classes</CardDescription>
                </div>
                <div className="flex gap-3 text-center">
                  {[
                    { label: "Present", value: selected.present, color: "text-green-600" },
                    { label: "Absent",  value: selected.absent,  color: "text-red-600"   },
                    { label: "Late",    value: selected.late,    color: "text-yellow-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl bg-muted/40 px-3 py-1.5 text-center">
                      <p className={cn("text-lg font-extrabold leading-none", color)}>{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selected.sessions.map((s, i) => {
                  const { label, icon: Icon, cls } = statusMeta(s.status);
                  return (
                    <div key={i} className={cn("flex items-center justify-between p-3 rounded-xl border", cls)}>
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">{s.date}</p>
                          <p className="text-xs opacity-70">{s.day}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold">{label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Mini bar graph for this subject */}
              <div className="mt-5 pt-4 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-3">Monthly Attendance Trend</p>
                <div className="flex items-end gap-3 h-20">
                  {selected.monthly.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-xs font-semibold" style={{ color: ringColor(v) }}>{v}%</span>
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{ height: `${(v / 100) * 52}px`, backgroundColor: selected.color }}
                      />
                      <span className="text-xs text-muted-foreground">{MONTHS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </main>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
