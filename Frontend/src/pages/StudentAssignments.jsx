import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BookOpen, ClipboardList, Search, Filter,
  Clock, CheckCircle, AlertCircle, Upload, Paperclip, RotateCcw, Send,
  CalendarDays, FileText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";

const ASSIGNMENTS = [
  {
    id: 1,
    title: "Math Problem Set 7",
    subject: "Mathematics",
    deadline: "14 May 2026",
    dueLabel: "Tomorrow",
    status: "pending",
    instructions: "Solve all problems and include working for the last three questions.",
    canResubmit: true,
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Physics",
    deadline: "16 May 2026",
    dueLabel: "In 3 days",
    status: "pending",
    instructions: "Upload the lab report in PDF format with data tables and observations.",
    canResubmit: true,
  },
  {
    id: 3,
    title: "CS Project Phase 2",
    subject: "Computer Science",
    deadline: "Submitted",
    dueLabel: "Submitted",
    status: "submitted",
    instructions: "Share the source archive and a short note on features completed this week.",
    canResubmit: true,
    submittedAt: "12 May 2026, 04:20 PM",
    fileName: "cs-project-phase-2.zip",
    comment: "Added authentication flow and dashboard polish.",
  },
  {
    id: 4,
    title: "English Essay Draft",
    subject: "English Literature",
    deadline: "13 May 2026",
    dueLabel: "Overdue",
    status: "overdue",
    instructions: "Submit the essay draft with introduction, body, and conclusion sections.",
    canResubmit: true,
  },
  {
    id: 5,
    title: "Chemistry Worksheet 4",
    subject: "Chemistry",
    deadline: "18 May 2026",
    dueLabel: "In 5 days",
    status: "pending",
    instructions: "Complete the worksheet and upload a clear scan or typed answer sheet.",
    canResubmit: false,
  },
];

const subjectOptions = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Computer Science",
  "English Literature",
  "Chemistry",
];

function statusMeta(status) {
  if (status === "submitted") {
    return {
      label: "Submitted",
      icon: CheckCircle,
      chip: "bg-green-100 text-green-700 border-green-200",
      dot: "bg-green-500",
    };
  }

  if (status === "overdue") {
    return {
      label: "Overdue",
      icon: AlertCircle,
      chip: "bg-red-100 text-red-700 border-red-200",
      dot: "bg-red-500",
    };
  }

  return {
    label: "Pending",
    icon: Clock,
    chip: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  };
}

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
            <FileText className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/student/materials" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <BookOpen className="w-4 h-4" /> Materials
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

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [assignmentList, setAssignmentList] = useState(ASSIGNMENTS);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(ASSIGNMENTS[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [submissionComment, setSubmissionComment] = useState("");
  const [message, setMessage] = useState("");

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const filteredAssignments = assignmentList.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(search.toLowerCase()) || assignment.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === "All Subjects" || assignment.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const selectedAssignment = assignmentList.find((assignment) => assignment.id === selectedAssignmentId) ?? filteredAssignments[0] ?? null;
  const pendingCount = assignmentList.filter((assignment) => assignment.status === "pending").length;
  const submittedCount = assignmentList.filter((assignment) => assignment.status === "submitted").length;
  const overdueCount = assignmentList.filter((assignment) => assignment.status === "overdue").length;

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : "");
  }

  function handleSubmitAssignment(event) {
    event.preventDefault();

    if (!selectedAssignment) return;

    const timestamp = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setAssignmentList((current) => current.map((assignment) => (
      assignment.id === selectedAssignment.id
        ? {
            ...assignment,
            status: "submitted",
            dueLabel: assignment.status === "submitted" ? "Resubmitted" : "Submitted",
            submittedAt: timestamp,
            fileName: selectedFileName || assignment.fileName || "assignment-upload.pdf",
            comment: submissionComment.trim(),
          }
        : assignment
    )));

    setMessage(selectedAssignment.status === "submitted" ? "Resubmission saved." : "Assignment submitted successfully.");
    setSubmissionComment("");
    setSelectedFileName("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-primary to-violet-500 text-white p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-[0.2em]">
                <ClipboardList className="w-3.5 h-3.5" /> Assignments Module
              </span>
              <div>
                <h1 className="text-3xl font-bold">Manage submissions in one place</h1>
                <p className="mt-2 text-sm text-white/80 max-w-xl">
                  Review each assignment, track deadlines and status, upload files, add comments, and resubmit when allowed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="rounded-2xl bg-white/15 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold">{pendingCount}</p>
                <p className="text-xs text-white/75">Pending</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold">{submittedCount}</p>
                <p className="text-xs text-white/75">Submitted</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold">{overdueCount}</p>
                <p className="text-xs text-white/75">Overdue</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ClipboardList className="w-5 h-5 text-primary" /> All Assignments
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Select an assignment to review details and submit work.
                    </CardDescription>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                    {filteredAssignments.length} visible
                  </span>
                </div>

                <div className="grid sm:grid-cols-[1fr_220px] gap-3">
                  <label className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by title or subject"
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </label>

                  <label className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select
                      value={subjectFilter}
                      onChange={(event) => setSubjectFilter(event.target.value)}
                      className="w-full bg-transparent outline-none text-sm"
                    >
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const meta = statusMeta(assignment.status);
                  const isSelected = assignment.id === selectedAssignment?.id;
                  const ActionIcon = assignment.status === "submitted" ? RotateCcw : Upload;

                  return (
                    <button
                      key={assignment.id}
                      type="button"
                      onClick={() => setSelectedAssignmentId(assignment.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all",
                        isSelected ? "border-primary bg-primary/5 shadow-sm" : "bg-muted/20 hover:bg-muted/40 border-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn("w-2.5 h-2.5 rounded-full", meta.dot)} />
                            <p className="text-sm font-semibold truncate">{assignment.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1">Deadline: {assignment.deadline}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-semibold border", meta.chip)}>
                            <meta.icon className="w-3 h-3" /> {meta.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{assignment.dueLabel}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-3">
                        <p className="text-xs text-muted-foreground truncate">{assignment.instructions}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary shrink-0">
                          <ActionIcon className="w-3.5 h-3.5" /> {assignment.status === "submitted" ? "Resubmit" : "Submit"}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border bg-muted/20 p-6 text-sm text-muted-foreground">
                  No assignments match your filters.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Send className="w-5 h-5 text-primary" /> Submit Assignment
              </CardTitle>
              <CardDescription>
                Upload files, add comments, and resubmit if the assignment allows it.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {selectedAssignment ? (
                <form className="space-y-4" onSubmit={handleSubmitAssignment}>
                  <div className="rounded-2xl border bg-muted/20 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{selectedAssignment.title}</p>
                        <p className="text-xs text-muted-foreground">{selectedAssignment.subject}</p>
                      </div>
                      <span className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-semibold border", statusMeta(selectedAssignment.status).chip)}>
                        {statusMeta(selectedAssignment.status).label}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{selectedAssignment.instructions}</p>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-white p-3 border">
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-semibold mt-1">{selectedAssignment.deadline}</p>
                      </div>
                      <div className="rounded-xl bg-white p-3 border">
                        <p className="text-muted-foreground">Current file</p>
                        <p className="font-semibold mt-1 truncate">{selectedAssignment.fileName || "No file uploaded"}</p>
                      </div>
                    </div>

                    {selectedAssignment.submittedAt && (
                      <p className="text-xs text-muted-foreground">
                        Last submitted: {selectedAssignment.submittedAt}
                      </p>
                    )}

                    {selectedAssignment.comment && (
                      <p className="text-xs text-muted-foreground">
                        Last comment: {selectedAssignment.comment}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Upload file</label>
                    <label className="flex items-center justify-between gap-3 rounded-2xl border border-dashed bg-white px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Paperclip className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{selectedFileName || "Choose a file to upload"}</p>
                          <p className="text-xs text-muted-foreground">PDF, ZIP, DOCX, PNG, or JPG</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary shrink-0">Browse</span>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <textarea
                      rows={4}
                      value={submissionComment}
                      onChange={(event) => setSubmissionComment(event.target.value)}
                      placeholder="Add notes for your teacher, mention corrections, or explain your upload."
                      className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>

                  {message && (
                    <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    disabled={selectedAssignment.status === "overdue" && !selectedAssignment.canResubmit}
                  >
                    {selectedAssignment.status === "submitted" ? <RotateCcw className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    {selectedAssignment.status === "submitted" ? "Resubmit Assignment" : "Submit Assignment"}
                  </button>

                  <p className="text-xs text-muted-foreground">
                    {selectedAssignment.canResubmit
                      ? "Resubmission is enabled for this assignment."
                      : "Resubmission is disabled for this assignment."
                    }
                  </p>
                </form>
              ) : (
                <div className="rounded-2xl border bg-muted/20 p-6 text-sm text-muted-foreground">
                  Select an assignment to view submission options.
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: CalendarDays, label: "Upcoming deadlines", value: "3" },
            { icon: Upload, label: "Uploads this week", value: "12" },
            { icon: FileText, label: "Resubmission enabled", value: "4" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="pt-5 pb-4 px-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-extrabold leading-none">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
