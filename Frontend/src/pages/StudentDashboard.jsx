import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap, BookOpen, BarChart3, Bell, LogOut,
  TrendingUp, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

const courses = [
  { name: "Mathematics", grade: "A", score: 92, progress: 92, status: "On Track" },
  { name: "Physics", grade: "B+", score: 87, progress: 87, status: "On Track" },
  { name: "Computer Science", grade: "A+", score: 97, progress: 97, status: "Excellent" },
  { name: "English Literature", grade: "B", score: 83, progress: 83, status: "On Track" },
];

const assignments = [
  { title: "Math Problem Set 5", due: "Tomorrow", status: "pending" },
  { title: "Physics Lab Report", due: "In 3 days", status: "pending" },
  { title: "CS Project Milestone", due: "Submitted", status: "done" },
  { title: "Essay Draft", due: "Overdue", status: "overdue" },
];

const stats = [
  { label: "GPA", value: "3.8", icon: TrendingUp, color: "text-green-600" },
  { label: "Courses", value: "4", icon: BookOpen, color: "text-primary" },
  { label: "Pending", value: "2", icon: Clock, color: "text-yellow-600" },
  { label: "Completed", value: "12", icon: CheckCircle, color: "text-blue-600" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GradeSphere</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              S
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Student 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your academic overview for this semester.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="pt-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Courses & Grades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> My Grades
              </CardTitle>
              <CardDescription>Current semester performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map(({ name, grade, score, progress }) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{score}%</span>
                      <span className="text-sm font-bold text-primary">{grade}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Assignments
              </CardTitle>
              <CardDescription>Upcoming & recent tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.map(({ title, due, status }) => (
                <div key={title} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    {status === "done" ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : status === "overdue" ? (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                    )}
                    <span className="text-sm font-medium">{title}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      status === "done"
                        ? "bg-green-100 text-green-700"
                        : status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {due}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
