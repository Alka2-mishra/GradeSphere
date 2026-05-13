import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, UserCircle, BookOpen,
  Users, BarChart3, CalendarDays, Bell, LogOut, Menu, X, Library, CalendarCheck,
  MessageCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import ThemeToggle from "../components/ui/theme-toggle";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/teacher/dashboard" },
  { label: "Profile",   icon: UserCircle,      to: "/teacher/profile"   },
  { label: "Classes",   icon: BookOpen,        to: "/teacher/classes"   },
  { label: "Attendance",icon: CalendarCheck,   to: "/teacher/attendance"},
  { label: "Subjects",  icon: Library,         to: "/teacher/subjects"  },
  { label: "Students",  icon: Users,           to: "/teacher/students"  },
  { label: "Grades",    icon: BarChart3,        to: "/teacher/grades"    },
  { label: "Schedule",  icon: CalendarDays,    to: "/teacher/schedule"  },
  { label: "Chat",      icon: MessageCircle,   to: "/teacher/chat"      },
];

export default function TeacherLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">GradeSphere</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b flex items-center justify-between px-6 shrink-0">
          <button className="lg:hidden p-1 rounded-md hover:bg-muted" onClick={() => setSidebarOpen((v) => !v)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
              </Button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </div>
            <Link to="/teacher/profile" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                P
              </div>
              <div className="hidden md:block text-sm leading-tight">
                <p className="font-semibold">Prof. Anderson</p>
                <p className="text-xs text-muted-foreground">Teacher</p>
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
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        <footer className="border-t bg-white dark:bg-card py-4 px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} GradeSphere. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
