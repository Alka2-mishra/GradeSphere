import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { GraduationCap, BookOpen, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student"; // "student" | "teacher"
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudent = role === "student";

  // Demo credentials
  const DEMO = {
    student: { email: "student@gradesphere.com", password: "student123" },
    teacher: { email: "teacher@gradesphere.com", password: "teacher123" },
  };

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const creds = DEMO[role];
      if (form.email === creds.email && form.password === creds.password) {
        localStorage.setItem("gs_role", role);
        navigate(isStudent ? "/student/dashboard" : "/teacher/dashboard");
      } else {
        setError("Invalid email or password. Use the demo credentials below.");
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="border-b bg-background/80 dark:bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GradeSphere</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative">
          {/* Role toggle */}
          <div className="flex rounded-xl border bg-muted/40 p-1 mb-6">
            <Link
              to="/login?role=student"
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                isStudent ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Student
            </Link>
            <Link
              to="/login?role=teacher"
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                !isStudent ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Teacher
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                {isStudent ? (
                  <BookOpen className="w-7 h-7 text-primary" />
                ) : (
                  <GraduationCap className="w-7 h-7 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isStudent ? "Student Login" : "Teacher Login"}
              </CardTitle>
              <CardDescription>
                {isStudent
                  ? "Access your grades, courses & assignments"
                  : "Manage your classes, grades & students"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={DEMO[role].email}
                    required
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Signing in..." : `Sign in as ${isStudent ? "Student" : "Teacher"}`}
                </Button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-5 p-3 rounded-lg bg-muted/60 border text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Demo credentials</p>
                <p>Email: <span className="font-mono">{DEMO[role].email}</span></p>
                <p>Password: <span className="font-mono">{DEMO[role].password}</span></p>
              </div>
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
