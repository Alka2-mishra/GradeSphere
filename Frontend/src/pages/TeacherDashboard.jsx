import {
  Users, BarChart3, BookOpen, TrendingUp, CheckCircle,
  Clock, ClipboardList, CalendarCheck, FileCheck, Activity,
  AlertCircle, ArrowUpRight,
} from "lucide-react";
import TeacherLayout from "../layouts/TeacherLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

// ── Data ──────────────────────────────────────────────────────────────────────

const quickStats = [
  {
    label: "Total Classes",
    value: "6",
    sub: "+1 this semester",
    icon: BookOpen,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    trend: "up",
  },
  {
    label: "Total Students",
    value: "214",
    sub: "Across all classes",
    icon: Users,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    trend: "up",
  },
  {
    label: "Attendance",
    value: "87%",
    sub: "This week avg",
    icon: CalendarCheck,
    bg: "bg-green-50",
    iconColor: "text-green-600",
    trend: "up",
  },
  {
    label: "Pending Evaluations",
    value: "18",
    sub: "Needs grading",
    icon: ClipboardList,
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    trend: "down",
  },
  {
    label: "Upcoming Tests",
    value: "4",
    sub: "Next 7 days",
    icon: Clock,
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    trend: "neutral",
  },
  {
    label: "Assignments Submitted",
    value: "143",
    sub: "Out of 214",
    icon: FileCheck,
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
    trend: "up",
  },
  {
    label: "Avg Class Performance",
    value: "82%",
    sub: "+3% from last month",
    icon: Activity,
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
    trend: "up",
  },
];

const classes = [
  { name: "Mathematics 101", students: 38, avgScore: 85, attendance: 90 },
  { name: "Advanced Physics", students: 30, avgScore: 78, attendance: 83 },
  { name: "Computer Science", students: 42, avgScore: 91, attendance: 95 },
  { name: "English Literature", students: 35, avgScore: 76, attendance: 80 },
  { name: "Chemistry", students: 40, avgScore: 83, attendance: 88 },
  { name: "Biology", students: 29, avgScore: 79, attendance: 85 },
];

const upcomingTests = [
  { subject: "Mathematics 101", topic: "Calculus — Integration", date: "Tomorrow", students: 38, type: "Unit Test" },
  { subject: "Computer Science", topic: "Data Structures — Trees", date: "Wed, 15 May", students: 42, type: "Mid-Term" },
  { subject: "Chemistry", topic: "Organic Reactions", date: "Fri, 17 May", students: 40, type: "Quiz" },
  { subject: "Advanced Physics", topic: "Electromagnetism", date: "Mon, 20 May", students: 30, type: "Unit Test" },
];

const pendingEvaluations = [
  { title: "Math Problem Set 7", class: "Mathematics 101", submitted: 34, total: 38, daysAgo: 1 },
  { title: "CS Project Phase 2", class: "Computer Science", submitted: 40, total: 42, daysAgo: 2 },
  { title: "Physics Lab Report", class: "Advanced Physics", submitted: 28, total: 30, daysAgo: 3 },
  { title: "Bio Worksheet 4", class: "Biology", submitted: 25, total: 29, daysAgo: 4 },
];

const recentActivity = [
  { action: "Graded Math Problem Set 6", time: "2 hours ago", type: "grade" },
  { action: "Posted CS Assignment — Sorting Algorithms", time: "Yesterday", type: "post" },
  { action: "Marked attendance for Chemistry", time: "Yesterday", type: "attendance" },
  { action: "Sent feedback to 8 students", time: "2 days ago", type: "feedback" },
  { action: "Scheduled Physics Mid-Term", time: "3 days ago", type: "schedule" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeColor(score) {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-500";
}

function progressColor(score) {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function activityIcon(type) {
  switch (type) {
    case "grade": return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "post": return <BookOpen className="w-4 h-4 text-blue-600" />;
    case "attendance": return <CalendarCheck className="w-4 h-4 text-teal-600" />;
    case "schedule": return <Clock className="w-4 h-4 text-yellow-600" />;
    default: return <TrendingUp className="w-4 h-4 text-primary" />;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  return (
    <TeacherLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary to-violet-500 text-white">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Prof. Anderson 👋</h1>
            <p className="text-white/80 text-sm mt-1">
              You have <span className="font-semibold text-white">18 pending evaluations</span> and{" "}
              <span className="font-semibold text-white">4 upcoming tests</span> this week.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-semibold">
              View Schedule
            </Button>
            <Button size="sm" variant="ghost" className="text-white border border-white/40 hover:bg-white/10">
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* ── Quick Stats Grid ── */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Quick Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {quickStats.map(({ label, value, sub, icon: Icon, bg, iconColor, trend }) => (
              <Card key={label} className="hover:shadow-md transition-shadow border-0 shadow-sm">
                <CardContent className="pt-5 pb-4 px-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <p className="text-2xl font-extrabold leading-none">{value}</p>
                  <p className="text-xs font-medium text-foreground mt-1">{label}</p>
                  <p className={`text-xs mt-1 flex items-center gap-0.5 ${
                    trend === "up" ? "text-green-600" : trend === "down" ? "text-orange-500" : "text-muted-foreground"
                  }`}>
                    {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                    {trend === "down" && <AlertCircle className="w-3 h-3" />}
                    {sub}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Class Performance + Upcoming Tests ── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Class Performance */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-5 h-5 text-primary" /> Avg Class Performance
              </CardTitle>
              <CardDescription>Score & attendance per class</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.map(({ name, students: count, avgScore, attendance }) => (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{count} students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">Att: {attendance}%</span>
                      <span className={`font-bold text-sm ${gradeColor(avgScore)}`}>{avgScore}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${progressColor(avgScore)}`}
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tests */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-5 h-5 text-primary" /> Upcoming Tests
              </CardTitle>
              <CardDescription>Scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTests.map(({ subject, topic, date, students: count, type }) => (
                <div key={topic} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{type}</span>
                      <span className="text-xs text-muted-foreground">{count} students</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0">{date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Pending Evaluations + Recent Activity ── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Pending Evaluations */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="w-5 h-5 text-primary" /> Pending Evaluations
                </CardTitle>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                  {pendingEvaluations.length} pending
                </span>
              </div>
              <CardDescription>Assignments awaiting your review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingEvaluations.map(({ title, class: cls, submitted, total, daysAgo }) => {
                const pct = Math.round((submitted / total) * 100);
                return (
                  <div key={title} className="p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-xs text-muted-foreground">{cls}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-orange-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{submitted}/{total} submitted</span>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" size="sm" className="w-full mt-1">
                View All Evaluations
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5 text-primary" /> Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map(({ action, time, type }) => (
                <div key={action} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white border flex items-center justify-center shrink-0 shadow-sm">
                    {activityIcon(type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{action}</p>
                    <p className="text-xs text-muted-foreground">{time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Assignments Submitted Overview ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCheck className="w-5 h-5 text-primary" /> Assignments Submitted — Class Breakdown
              </CardTitle>
              <span className="text-xs text-muted-foreground">This week</span>
            </div>
            <CardDescription>Submission rate per class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left py-2 pr-6 font-medium">Class</th>
                    <th className="text-left py-2 pr-6 font-medium">Submitted</th>
                    <th className="text-left py-2 pr-6 font-medium">Total</th>
                    <th className="text-left py-2 pr-6 font-medium">Rate</th>
                    <th className="text-left py-2 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { cls: "Mathematics 101", submitted: 34, total: 38 },
                    { cls: "Computer Science", submitted: 40, total: 42 },
                    { cls: "Advanced Physics", submitted: 25, total: 30 },
                    { cls: "English Literature", submitted: 28, total: 35 },
                    { cls: "Chemistry", submitted: 36, total: 40 },
                    { cls: "Biology", submitted: 22, total: 29 },
                  ].map(({ cls, submitted, total }) => {
                    const rate = Math.round((submitted / total) * 100);
                    return (
                      <tr key={cls} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-6 font-medium">{cls}</td>
                        <td className="py-3 pr-6 text-green-600 font-semibold">{submitted}</td>
                        <td className="py-3 pr-6 text-muted-foreground">{total}</td>
                        <td className="py-3 pr-6">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            rate >= 90 ? "bg-green-100 text-green-700" :
                            rate >= 75 ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {rate}%
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${progressColor(rate)}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </TeacherLayout>
  );
}
