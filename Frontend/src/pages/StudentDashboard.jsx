import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap, BookOpen, BarChart3, Bell, LogOut,
  AlertCircle, CalendarCheck,
  Flame, Trophy, Target, ClipboardList, FlaskConical, FileText, Timer, MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { generateAlerts } from "../lib/alertsData";

// ── Data ──────────────────────────────────────────────────────────────────────

const student = {
  name: "Aarav Sharma",
  class: "10 - A",
  rank: 3,
  totalStudents: 42,
  streak: 14,
  attendance: 89,
  avgMarks: 88,
  quizAccuracy: 76,
  subjects: 6,
};

const subjects = [
  { name: "Mathematics",        grade: "A",  marks: 92, total: 100, attendance: 91, quizAvg: 84 },
  { name: "Physics",            grade: "B+", marks: 87, total: 100, attendance: 85, quizAvg: 78 },
  { name: "Computer Science",   grade: "A+", marks: 97, total: 100, attendance: 95, quizAvg: 91 },
  { name: "English Literature", grade: "B",  marks: 83, total: 100, attendance: 88, quizAvg: 70 },
  { name: "Chemistry",          grade: "A",  marks: 90, total: 100, attendance: 87, quizAvg: 75 },
  { name: "Biology",            grade: "B+", marks: 85, total: 100, attendance: 82, quizAvg: 68 },
];

const assignmentSummary = {
  pending: 3,
  submitted: 1,
  overdue: 1,
  total: 5,
};

const upcomingTests = [
  { title: "Mathematics Mid-Term",  subject: "Mathematics",      date: "Tomorrow",   type: "Mid-Term" },
  { title: "CS Data Structures",    subject: "Computer Science", date: "Wed, 15 May", type: "Unit Test" },
  { title: "Chemistry Quiz 3",      subject: "Chemistry",        date: "Fri, 17 May", type: "Quiz"     },
  { title: "Physics Electro Unit",  subject: "Physics",          date: "Mon, 20 May", type: "Unit Test" },
];

const quizHistory = [
  { subject: "Mathematics",      score: 9,  total: 10 },
  { subject: "Computer Science", score: 8,  total: 10 },
  { subject: "Chemistry",        score: 7,  total: 10 },
  { subject: "Physics",          score: 8,  total: 10 },
  { subject: "Biology",          score: 6,  total: 10 },
  { subject: "English",          score: 7,  total: 10 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeColor(g) {
  if (g === "A+" || g === "A") return "text-green-600";
  if (g === "B+" || g === "B") return "text-blue-600";
  return "text-yellow-600";
}

function marksBg(m) {
  if (m >= 90) return "bg-green-500";
  if (m >= 75) return "bg-blue-500";
  if (m >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function attendanceColor(a) {
  if (a >= 90) return "text-green-600";
  if (a >= 75) return "text-yellow-600";
  return "text-red-600";
}

// Circular progress SVG
function Ring({ pct, size = 64, stroke = 6, color = "#7c3aed" }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const pendingCount = assignmentSummary.pending;
  const submittedCount = assignmentSummary.submitted;
  const overdueCount = assignmentSummary.overdue;
  const urgentAlerts = generateAlerts().filter(a => a.type === "critical" || a.type === "warning").length;

  const statCards = [
    {
      label: "Attendance",
      value: `${student.attendance}%`,
      sub: student.attendance >= 85 ? "Good standing" : "Needs improvement",
      icon: CalendarCheck,
      bg: "bg-green-50", color: "text-green-600",
      ring: true, ringColor: "#16a34a",
    },
    {
      label: "Average Marks",
      value: `${student.avgMarks}%`,
      sub: "Across all subjects",
      icon: BarChart3,
      bg: "bg-violet-50", color: "text-violet-600",
      ring: true, ringColor: "#7c3aed",
    },
    {
      label: "Quiz Accuracy",
      value: `${student.quizAccuracy}%`,
      sub: "Last 6 quizzes",
      icon: Target,
      bg: "bg-blue-50", color: "text-blue-600",
      ring: true, ringColor: "#2563eb",
    },
    {
      label: "Pending Assignments",
      value: pendingCount,
      sub: `${assignmentSummary.overdue} overdue`,
      icon: ClipboardList,
      bg: "bg-orange-50", color: "text-orange-600",
    },
    {
      label: "Upcoming Tests",
      value: upcomingTests.length,
      sub: "Next 7 days",
      icon: FlaskConical,
      bg: "bg-red-50", color: "text-red-600",
    },
    {
      label: "Total Subjects",
      value: student.subjects,
      sub: "This semester",
      icon: BookOpen,
      bg: "bg-teal-50", color: "text-teal-600",
    },
    {
      label: "Class Rank",
      value: `#${student.rank}`,
      sub: `Out of ${student.totalStudents} students`,
      icon: Trophy,
      bg: "bg-yellow-50", color: "text-yellow-600",
    },
    {
      label: "Learning Streak",
      value: `${student.streak}d`,
      sub: "Keep it going! 🔥",
      icon: Flame,
      bg: "bg-pink-50", color: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GradeSphere</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/student/alerts" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              {urgentAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {urgentAlerts}
                </span>
              )}
            </Link>
            <Link to="/student/subjects" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <BookOpen className="w-4 h-4" /> Subjects
            </Link>
            <Link to="/student/attendance" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <CalendarCheck className="w-4 h-4" /> Attendance
            </Link>
            <Link to="/student/materials" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <FileText className="w-4 h-4" /> Materials
            </Link>
            <Link to="/student/assignments" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <ClipboardList className="w-4 h-4" /> Assignments
            </Link>
            <Link to="/student/quizzes" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <Timer className="w-4 h-4" /> Quizzes
            </Link>
            <Link to="/student/chat" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <MessageCircle className="w-4 h-4" /> Chat
            </Link>
            <Link to="/student/profile" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                A
              </div>
              <div className="hidden md:block text-sm leading-tight">
                <p className="font-semibold">{student.name}</p>
                <p className="text-xs text-muted-foreground">Class {student.class}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors border"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">

        {/* Welcome banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary to-violet-500 text-white">
          <div>
            <h1 className="text-2xl font-bold">Good morning, {student.name} 👋</h1>
            <p className="text-white/80 text-sm mt-1">
              You're ranked <span className="font-semibold text-white">#{student.rank}</span> in your class with a{" "}
              <span className="font-semibold text-white">{student.streak}-day</span> learning streak. Keep it up!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center bg-white/20 rounded-xl px-4 py-2">
              <p className="text-2xl font-extrabold">{student.streak}</p>
              <p className="text-xs text-white/80 flex items-center gap-1 justify-center"><Flame className="w-3 h-3" /> Day Streak</p>
            </div>
            <div className="text-center bg-white/20 rounded-xl px-4 py-2">
              <p className="text-2xl font-extrabold">#{student.rank}</p>
              <p className="text-xs text-white/80 flex items-center gap-1 justify-center"><Trophy className="w-3 h-3" /> Class Rank</p>
            </div>
          </div>
        </div>

        {/* ── Smart Alert Strip ── */}
        {(() => {
          const criticals = generateAlerts().filter(a => a.type === "critical").slice(0, 3);
          if (criticals.length === 0) return null;
          return (
            <div className="space-y-2">
              {criticals.map(alert => (
                <div key={alert.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700 font-medium flex-1 truncate">{alert.title}</p>
                  <Link to="/student/alerts" className="text-xs font-semibold text-red-600 hover:underline shrink-0">View →</Link>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── 8 Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon, bg, color, ring, ringColor }) => (
            <Card key={label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4 px-4">
                {ring ? (
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative shrink-0">
                      <Ring pct={parseInt(value)} size={48} stroke={5} color={ringColor} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-extrabold leading-none">{value}</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{label}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold leading-none">{value}</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{label}</p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Subject Performance ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-5 h-5 text-primary" /> Subject Performance
            </CardTitle>
            <CardDescription>Marks, attendance & quiz average per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left py-2 pr-4 font-medium">Subject</th>
                    <th className="text-left py-2 pr-4 font-medium">Marks</th>
                    <th className="text-left py-2 pr-4 font-medium">Progress</th>
                    <th className="text-left py-2 pr-4 font-medium">Attendance</th>
                    <th className="text-left py-2 pr-4 font-medium">Quiz Avg</th>
                    <th className="text-left py-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subjects.map(({ name, grade, marks, attendance, quizAvg }) => (
                    <tr key={name} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4 font-medium">{name}</td>
                      <td className="py-3 pr-4 font-semibold">{marks}/100</td>
                      <td className="py-3 pr-4">
                        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${marksBg(marks)}`} style={{ width: `${marks}%` }} />
                        </div>
                      </td>
                      <td className={`py-3 pr-4 font-semibold ${attendanceColor(attendance)}`}>{attendance}%</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          quizAvg >= 80 ? "bg-green-100 text-green-700" :
                          quizAvg >= 65 ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{quizAvg}%</span>
                      </td>
                      <td className={`py-3 font-bold text-base ${gradeColor(grade)}`}>{grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Assignments Overview ── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="w-5 h-5 text-primary" /> Assignments
                </CardTitle>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                  {assignmentSummary.total} total
                </span>
              </div>
              <CardDescription>Open the assignments page to review, submit, and resubmit tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-muted/20 border p-3 text-center">
                  <p className="text-xl font-extrabold text-yellow-600">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="rounded-2xl bg-muted/20 border p-3 text-center">
                  <p className="text-xl font-extrabold text-green-600">{submittedCount}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div className="rounded-2xl bg-muted/20 border p-3 text-center">
                  <p className="text-xl font-extrabold text-red-600">{overdueCount}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-violet-500/10 border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold">Assignment workspace</p>
                  <p className="text-sm text-muted-foreground">Dedicated page for uploads, comments, and resubmission.</p>
                </div>
                <Link
                  to="/student/assignments"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <ClipboardList className="w-4 h-4" /> Open Assignments
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ── Upcoming Tests ── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FlaskConical className="w-5 h-5 text-primary" /> Upcoming Tests
              </CardTitle>
              <CardDescription>Scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingTests.map(({ title, subject, date, type }) => (
                <div key={title} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{type}</span>
                      <span className="text-xs text-muted-foreground">{subject}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0">{date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Quiz Module ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="w-5 h-5 text-primary" /> Quiz Module
              </CardTitle>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                Score {student.quizAccuracy}%
              </span>
            </div>
            <CardDescription>Timed tests, quiz history, wrong answers, and performance tracking live on the quiz page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <div className="rounded-2xl bg-muted/20 border p-4">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-extrabold mt-1">{student.quizAccuracy}%</p>
              </div>
              <div className="rounded-2xl bg-muted/20 border p-4">
                <p className="text-xs text-muted-foreground">Rank</p>
                <p className="text-2xl font-extrabold mt-1">#{student.rank}</p>
              </div>
              <div className="rounded-2xl bg-muted/20 border p-4">
                <p className="text-xs text-muted-foreground">Quiz history</p>
                <p className="text-2xl font-extrabold mt-1">{quizHistory.length}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-gradient-to-r from-primary/10 to-violet-500/10 border p-4">
              <div>
                <p className="font-semibold">Open the dedicated quiz workspace</p>
                <p className="text-sm text-muted-foreground">Practice timed tests, review mistakes, and track improvements here.</p>
              </div>
              <Link
                to="/student/quizzes"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Timer className="w-4 h-4" /> Open Quizzes
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ── Learning Streak ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="w-5 h-5 text-pink-500" /> Learning Streak
            </CardTitle>
            <CardDescription>Your activity over the last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-pink-500">{student.streak}</p>
                <p className="text-xs text-muted-foreground">Current streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-orange-500">21</p>
                <p className="text-xs text-muted-foreground">Best streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-violet-500">26</p>
                <p className="text-xs text-muted-foreground">Active days</p>
              </div>
            </div>
            {/* 28-day heatmap */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }, (_, i) => {
                const active = [0,1,2,3,4,6,7,8,9,10,11,13,14,15,16,17,18,20,21,22,23,24,25,27].includes(i);
                const today  = i === 27;
                return (
                  <div
                    key={i}
                    title={`Day ${i + 1}`}
                    className={`h-7 rounded-md transition-colors ${
                      today   ? "bg-pink-500 ring-2 ring-pink-300" :
                      active  ? "bg-pink-200" :
                      "bg-muted"
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>4 weeks ago</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-muted inline-block" /> Inactive
                <span className="w-3 h-3 rounded-sm bg-pink-200 inline-block ml-2" /> Active
                <span className="w-3 h-3 rounded-sm bg-pink-500 inline-block ml-2" /> Today
              </div>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

      </main>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
