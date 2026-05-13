// ── Shared data (mirrors StudentAttendance.jsx) ───────────────────────────────

const ATTENDANCE = [
  { name: "Database Management Systems", code: "CS401", total: 36, present: 33 },
  { name: "Operating Systems",           code: "CS402", total: 28, present: 24 },
  { name: "Engineering Mathematics IV",  code: "MA401", total: 40, present: 38 },
  { name: "Artificial Intelligence & ML",code: "CS403", total: 32, present: 31 },
  { name: "Computer Networks",           code: "CS404", total: 24, present: 20 },
  { name: "Professional Ethics",         code: "HS401", total: 16, present: 14 },
];

const ASSIGNMENTS = [
  { title: "Math Problem Set 7",       subject: "Engineering Mathematics IV",  due: "Tomorrow",  status: "pending"  },
  { title: "ER Diagram — Hospital DB", subject: "Database Management Systems", due: "Tomorrow",  status: "pending"  },
  { title: "English Essay Draft",      subject: "Professional Ethics",         due: "Overdue",   status: "overdue"  },
  { title: "Memory Management Report", subject: "Operating Systems",           due: "Overdue",   status: "overdue"  },
  { title: "Network Topology Design",  subject: "Computer Networks",           due: "In 2 days", status: "pending"  },
  { title: "CS Project Phase 2",       subject: "Artificial Intelligence & ML",due: "Submitted", status: "done"     },
];

const TESTS = [
  { title: "Mathematics Mid-Term",  subject: "Engineering Mathematics IV",  date: "Tomorrow",    type: "Mid-Term"  },
  { title: "DBMS Mid-Term",         subject: "Database Management Systems", date: "Wed, 15 May", type: "Mid-Term"  },
  { title: "Chemistry Quiz 3",      subject: "Computer Networks",           date: "Fri, 17 May", type: "Quiz"      },
  { title: "AI/ML Unit Test 3",     subject: "Artificial Intelligence & ML",date: "Wed, 22 May", type: "Unit Test" },
];

// ── Alert generator ───────────────────────────────────────────────────────────

export function generateAlerts() {
  const alerts = [];

  // 1. Attendance alerts
  ATTENDANCE.forEach(sub => {
    const p = Math.round((sub.present / sub.total) * 100);

    if (p < 75) {
      // How many consecutive classes needed to reach 75%
      // (present + x) / (total + x) >= 0.75  →  x >= (0.75*total - present) / 0.25
      const needed = Math.ceil((0.75 * sub.total - sub.present) / 0.25);
      alerts.push({
        id:       `att-critical-${sub.code}`,
        type:     "critical",
        category: "attendance",
        title:    `Attendance below 75% in ${sub.code}`,
        message:  `Your attendance in ${sub.name} is ${p}% (${sub.present}/${sub.total}). You need to attend ${needed} more consecutive class${needed > 1 ? "es" : ""} to reach eligibility.`,
        action:   { label: "View Attendance", href: "/student/attendance" },
      });
    } else if (p < 85) {
      const safeAbsences = Math.floor(sub.present - 0.75 * sub.total);
      alerts.push({
        id:       `att-warning-${sub.code}`,
        type:     "warning",
        category: "attendance",
        title:    `Attendance dropping in ${sub.code}`,
        message:  `Your attendance in ${sub.name} is ${p}%. You can afford only ${safeAbsences} more absence${safeAbsences !== 1 ? "s" : ""} before falling below 75%.`,
        action:   { label: "View Attendance", href: "/student/attendance" },
      });
    } else if (p >= 90) {
      alerts.push({
        id:       `att-good-${sub.code}`,
        type:     "success",
        category: "attendance",
        title:    `Great attendance in ${sub.code}!`,
        message:  `You have ${p}% attendance in ${sub.name}. Keep it up to maintain your eligibility.`,
        action:   null,
      });
    }
  });

  // 2. Overdue assignment alerts
  ASSIGNMENTS.filter(a => a.status === "overdue").forEach(a => {
    alerts.push({
      id:       `assign-overdue-${a.title.replace(/\s/g, "-")}`,
      type:     "critical",
      category: "assignment",
      title:    `Overdue: ${a.title}`,
      message:  `"${a.title}" for ${a.subject} is past its deadline. Submit immediately to avoid a zero.`,
      action:   { label: "View Subjects", href: "/student/subjects" },
    });
  });

  // 3. Due-tomorrow assignment alerts
  ASSIGNMENTS.filter(a => a.status === "pending" && a.due === "Tomorrow").forEach(a => {
    alerts.push({
      id:       `assign-tomorrow-${a.title.replace(/\s/g, "-")}`,
      type:     "warning",
      category: "assignment",
      title:    `Due tomorrow: ${a.title}`,
      message:  `"${a.title}" for ${a.subject} is due tomorrow. Make sure to submit on time.`,
      action:   { label: "View Subjects", href: "/student/subjects" },
    });
  });

  // 4. Upcoming test alerts
  TESTS.filter(t => t.date === "Tomorrow").forEach(t => {
    alerts.push({
      id:       `test-tomorrow-${t.title.replace(/\s/g, "-")}`,
      type:     "warning",
      category: "test",
      title:    `${t.type} tomorrow: ${t.title}`,
      message:  `You have a ${t.type} in ${t.subject} tomorrow. Review your notes and study materials tonight.`,
      action:   { label: "View Materials", href: "/student/materials" },
    });
  });

  TESTS.filter(t => t.date !== "Tomorrow").forEach(t => {
    alerts.push({
      id:       `test-upcoming-${t.title.replace(/\s/g, "-")}`,
      type:     "info",
      category: "test",
      title:    `Upcoming ${t.type}: ${t.title}`,
      message:  `${t.subject} — ${t.type} scheduled on ${t.date}. Start preparing early.`,
      action:   { label: "View Materials", href: "/student/materials" },
    });
  });

  // 5. Overall attendance health
  const totalPresent = ATTENDANCE.reduce((s, a) => s + a.present, 0);
  const totalClasses = ATTENDANCE.reduce((s, a) => s + a.total,   0);
  const overall      = Math.round((totalPresent / totalClasses) * 100);
  if (overall >= 90) {
    alerts.push({
      id:       "overall-excellent",
      type:     "success",
      category: "attendance",
      title:    "Excellent overall attendance!",
      message:  `Your overall attendance is ${overall}% — well above the 75% eligibility threshold. Great discipline!`,
      action:   null,
    });
  }

  return alerts;
}

export const ALERT_META = {
  critical: { label: "Critical", bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    dot: "bg-red-500",    icon: "🚨" },
  warning:  { label: "Warning",  bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500", icon: "⚠️" },
  info:     { label: "Info",     bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   dot: "bg-blue-500",   icon: "ℹ️" },
  success:  { label: "Good",     bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  dot: "bg-green-500",  icon: "✅" },
};
