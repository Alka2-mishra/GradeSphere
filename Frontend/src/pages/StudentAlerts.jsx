import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BookOpen, FileText, CalendarCheck,
  AlertTriangle, AlertCircle, Info, CheckCircle, X, ChevronRight, Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";
import { generateAlerts, ALERT_META } from "../lib/alertsData";

// ── Icon map ──────────────────────────────────────────────────────────────────

const TYPE_ICONS = {
  critical: AlertCircle,
  warning:  AlertTriangle,
  info:     Info,
  success:  CheckCircle,
};

// ── Navbar ────────────────────────────────────────────────────────────────────

function StudentNav({ onLogout, alertCount }) {
  return (
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
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {alertCount}
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

// ── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard({ alert, onDismiss }) {
  const meta   = ALERT_META[alert.type];
  const Icon   = TYPE_ICONS[alert.type];

  return (
    <div className={cn("relative flex gap-4 p-4 rounded-2xl border transition-all", meta.bg, meta.border)}>
      {/* Icon */}
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/70")}>
        <Icon className={cn("w-5 h-5", meta.text)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-semibold leading-tight", meta.text)}>{alert.title}</p>
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-0.5 rounded hover:bg-black/10 transition-colors shrink-0 mt-0.5"
          >
            <X className={cn("w-3.5 h-3.5", meta.text)} />
          </button>
        </div>
        <p className={cn("text-xs mt-1 leading-relaxed opacity-80", meta.text)}>{alert.message}</p>
        {alert.action && (
          <Link
            to={alert.action.href}
            className={cn("inline-flex items-center gap-1 text-xs font-semibold mt-2 hover:underline", meta.text)}
          >
            {alert.action.label} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Type dot */}
      <span className={cn("absolute top-3 right-8 w-2 h-2 rounded-full", meta.dot)} />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["all", "attendance", "assignment", "test"];
const TYPES      = ["all", "critical", "warning", "info", "success"];

export default function StudentAlerts() {
  const navigate = useNavigate();
  const [dismissed,      setDismissed]      = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType,     setActiveType]     = useState("all");

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const allAlerts = generateAlerts();
  const visible   = allAlerts
    .filter(a => !dismissed.includes(a.id))
    .filter(a => activeCategory === "all" || a.category === activeCategory)
    .filter(a => activeType     === "all" || a.type     === activeType);

  const counts = {
    critical: allAlerts.filter(a => !dismissed.includes(a.id) && a.type === "critical").length,
    warning:  allAlerts.filter(a => !dismissed.includes(a.id) && a.type === "warning").length,
    info:     allAlerts.filter(a => !dismissed.includes(a.id) && a.type === "info").length,
    success:  allAlerts.filter(a => !dismissed.includes(a.id) && a.type === "success").length,
  };
  const urgentCount = counts.critical + counts.warning;

  function dismiss(id)    { setDismissed(p => [...p, id]); }
  function dismissAll()   { setDismissed(allAlerts.map(a => a.id)); }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} alertCount={urgentCount} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Smart Alerts
              {urgentCount > 0 && (
                <span className="text-sm font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {urgentCount} urgent
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Personalised alerts based on your attendance, assignments and tests.</p>
          </div>
          {dismissed.length < allAlerts.length && (
            <button
              onClick={dismissAll}
              className="text-xs text-muted-foreground hover:text-foreground border px-3 py-1.5 rounded-lg transition-colors"
            >
              Dismiss all
            </button>
          )}
        </div>

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "critical", label: "Critical", color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"    },
            { key: "warning",  label: "Warnings", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
            { key: "info",     label: "Info",     color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200"   },
            { key: "success",  label: "Good",     color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200"  },
          ].map(({ key, label, color, bg, border }) => (
            <button
              key={key}
              onClick={() => setActiveType(activeType === key ? "all" : key)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all hover:shadow-sm",
                bg, border,
                activeType === key && "ring-2 ring-offset-1 ring-primary"
              )}
            >
              <p className={cn("text-2xl font-extrabold leading-none", color)}>{counts[key]}</p>
              <p className={cn("text-xs font-medium mt-1", color)}>{label}</p>
            </button>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Category:</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize",
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted-foreground hover:bg-muted border-input"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Alert list ── */}
        {visible.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <p className="font-semibold">All clear!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {dismissed.length > 0 ? "All alerts dismissed." : "No alerts in this category."}
              </p>
              {dismissed.length > 0 && (
                <button
                  onClick={() => setDismissed([])}
                  className="text-xs text-primary mt-3 hover:underline"
                >
                  Restore dismissed alerts
                </button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Group by category */}
            {(activeCategory === "all" ? ["critical", "warning", "info", "success"] : [activeType === "all" ? "critical" : activeType]).map(type => {
              const group = visible.filter(a => activeType === "all" ? a.type === type : true && a.type === type);
              if (activeType !== "all" && type !== activeType) return null;
              const groupAlerts = activeType === "all" ? group : visible;
              if (activeType !== "all") {
                // flat list when type filter active
                return null;
              }
              if (group.length === 0) return null;
              const meta = ALERT_META[type];
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("w-2 h-2 rounded-full", meta.dot)} />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{meta.label}</p>
                    <span className="text-xs text-muted-foreground">({group.length})</span>
                  </div>
                  <div className="space-y-2">
                    {group.map(alert => (
                      <AlertCard key={alert.id} alert={alert} onDismiss={dismiss} />
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Flat list when type filter is active */}
            {activeType !== "all" && visible.map(alert => (
              <AlertCard key={alert.id} alert={alert} onDismiss={dismiss} />
            ))}
          </div>
        )}

      </main>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
