import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, BookOpen, ClipboardList, Clock, CheckCircle,
  AlertCircle, Timer, Trophy, Target, History, Flame, BarChart3, ChevronRight,
  HelpCircle, FileText, RotateCcw, Send, Award, ListChecks, MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import ThemeToggle from "../components/ui/theme-toggle";
import { cn } from "../lib/utils";

const QUIZZES = [
  {
    id: 1,
    title: "Mathematics Mid-Term Drill",
    subject: "Mathematics",
    duration: 20,
    score: 18,
    accuracy: 90,
    rank: 3,
    status: "completed",
    completedAt: "12 May 2026, 10:15 AM",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "What is the derivative of x^2?",
        options: ["2x", "x", "x^2", "2"],
        answer: 0,
        selected: 1,
        explanation: "The power rule gives d/dx(x^n) = n*x^(n-1), so d/dx(x^2) = 2x.",
      },
      {
        id: "q2",
        type: "descriptive",
        prompt: "Explain the difference between a function and a relation.",
        answer: "A function assigns exactly one output to each input, while a relation can pair an input with multiple outputs.",
        response: "A function assigns one output for each input. A relation can map one input to many outputs.",
        explanation: "The response captures the core idea correctly and uses clear comparison language.",
      },
      {
        id: "q3",
        type: "mcq",
        prompt: "Which theorem is used to differentiate composite functions?",
        options: ["Pythagorean theorem", "Chain rule", "Binomial theorem", "Mean value theorem"],
        answer: 1,
        selected: 1,
        explanation: "The chain rule is used when one function is nested inside another.",
      },
    ],
  },
  {
    id: 2,
    title: "Computer Science Concepts",
    subject: "Computer Science",
    duration: 15,
    score: 16,
    accuracy: 80,
    rank: 5,
    status: "review",
    completedAt: "10 May 2026, 03:45 PM",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "Which data structure uses FIFO order?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: 1,
        selected: 0,
        explanation: "Queue is FIFO, while a stack is LIFO.",
      },
      {
        id: "q2",
        type: "descriptive",
        prompt: "What is recursion?",
        answer: "A function calling itself to solve a problem by breaking it into smaller instances.",
        response: "When a function calls itself to solve a smaller part of the same problem.",
        explanation: "The answer is correct and concise.",
      },
    ],
  },
  {
    id: 3,
    title: "Physics Unit Test Prep",
    subject: "Physics",
    duration: 10,
    score: 12,
    accuracy: 60,
    rank: 8,
    status: "review",
    completedAt: "08 May 2026, 11:20 AM",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "Which quantity is measured in Newtons?",
        options: ["Energy", "Force", "Power", "Voltage"],
        answer: 1,
        selected: 2,
        explanation: "Force is measured in Newtons.",
      },
      {
        id: "q2",
        type: "descriptive",
        prompt: "State Newton's first law in your own words.",
        answer: "An object remains at rest or in uniform motion unless acted upon by a net external force.",
        response: "Objects keep moving unless something stops them.",
        explanation: "The answer is directionally right but missing the at-rest part and external force detail.",
      },
    ],
  },
];

const LIVE_QUIZ = {
  id: 99,
  title: "Chemistry Timed Quiz",
  subject: "Chemistry",
  duration: 12,
  instructions: "Answer the MCQ and descriptive questions before the timer ends.",
  questions: [
    {
      id: "l1",
      type: "mcq",
      prompt: "What is the pH of a neutral solution?",
      options: ["0", "7", "10", "14"],
      answer: 1,
    },
    {
      id: "l2",
      type: "mcq",
      prompt: "Which bond involves sharing of electrons?",
      options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
      answer: 1,
    },
    {
      id: "l3",
      type: "descriptive",
      prompt: "Describe one practical use of acids in everyday life.",
      answer: "Acids are used in cleaning, food preservation, and battery production.",
    },
  ],
};

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
          <Link to="/student/assignments" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <ClipboardList className="w-4 h-4" /> Assignments
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

function statTone(type) {
  if (type === "good") return "bg-green-50 text-green-700 border-green-200";
  if (type === "warn") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-violet-50 text-violet-700 border-violet-200";
}

function quizTone(score) {
  if (score >= 90) return "bg-green-500";
  if (score >= 75) return "bg-blue-500";
  return "bg-yellow-500";
}

export default function StudentQuizzes() {
  const navigate = useNavigate();
  const [selectedQuizId, setSelectedQuizId] = useState(LIVE_QUIZ.id);
  const [historySection, setHistorySection] = useState("review");
  const [answers, setAnswers] = useState({});
  const [descriptiveAnswers, setDescriptiveAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(LIVE_QUIZ.duration * 60);

  const selectedQuiz = useMemo(() => QUIZZES.find((quiz) => quiz.id === selectedQuizId) ?? QUIZZES[0], [selectedQuizId]);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  const timedProgress = Math.max(0, Math.min(100, Math.round((remaining / (LIVE_QUIZ.duration * 60)) * 100)));
  const liveCorrect = LIVE_QUIZ.questions.reduce((count, question) => {
    if (question.type === "mcq") return count + (answers[question.id] === question.answer ? 1 : 0);
    const text = (descriptiveAnswers[question.id] ?? "").trim().toLowerCase();
    return count + (text.length > 0 ? 1 : 0);
  }, 0);
  const liveAccuracy = Math.round((liveCorrect / LIVE_QUIZ.questions.length) * 100);
  const liveScore = liveCorrect * 10;

  const quizHistory = QUIZZES.map((quiz) => ({
    ...quiz,
    wrongCount: quiz.questions.filter((question) => {
      if (question.type === "mcq") return question.selected !== question.answer;
      return (question.response ?? "").trim().length === 0 || question.accuracy === 60;
    }).length,
    improvement: quiz.id === 1 ? "+12%" : quiz.id === 2 ? "+4%" : "-8%",
  }));

  function handleSubmitLiveQuiz(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  function handleResetLiveQuiz() {
    setAnswers({});
    setDescriptiveAnswers({});
    setSubmitted(false);
    setRemaining(LIVE_QUIZ.duration * 60);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNav onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-primary to-violet-500 text-white p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-card/15 text-xs font-semibold uppercase tracking-[0.2em]">
                <Timer className="w-3.5 h-3.5" /> Quiz & Online Test Module
              </span>
              <div>
                <h1 className="text-3xl font-bold">Attend quizzes, review mistakes, and track improvement</h1>
                <p className="mt-2 text-sm text-white/80 max-w-xl">
                  Practice MCQs and descriptive questions in timed tests, then inspect your score, accuracy, rank, and wrong answers in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0">
                  <div className="rounded-2xl bg-white dark:bg-card border p-2">
                <p className="text-2xl font-extrabold">{selectedQuiz.score}</p>
                <p className="text-xs text-white/75">Score</p>
              </div>
              <div className="rounded-2xl bg-white/15 dark:bg-card/15 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold">{selectedQuiz.accuracy}%</p>
                <p className="text-xs text-white/75">Accuracy</p>
              </div>
              <div className="rounded-2xl bg-white/15 dark:bg-card/15 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold">#{selectedQuiz.rank}</p>
                <p className="text-xs text-white/75">Rank</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Timer className="w-5 h-5 text-primary" /> Live Timed Test
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Answer MCQ and descriptive questions before time runs out.
                  </CardDescription>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  <Clock className="w-3.5 h-3.5" /> {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-semibold">{LIVE_QUIZ.title}</p>
                    <span className="text-xs text-muted-foreground">{LIVE_QUIZ.subject} • {LIVE_QUIZ.duration} min</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{LIVE_QUIZ.instructions}</p>
                  <div className="mt-4 h-2 rounded-full bg-white dark:bg-card overflow-hidden border">
                    <div className={cn("h-full rounded-full transition-all", quizTone(timedProgress))} style={{ width: `${timedProgress}%` }} />
                  </div>
                </div>

                <form onSubmit={handleSubmitLiveQuiz} className="space-y-4">
                  {LIVE_QUIZ.questions.map((question, index) => (
                    <div key={question.id} className="rounded-2xl border bg-white dark:bg-card p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            <ListChecks className="w-3.5 h-3.5" /> Question {index + 1}
                          </div>
                          <p className="mt-1 text-sm font-semibold">{question.prompt}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-semibold">
                          {question.type === "mcq" ? "MCQ" : "Descriptive"}
                        </span>
                      </div>

                      {question.type === "mcq" ? (
                        <div className="grid gap-2">
                          {question.options.map((option, optionIndex) => {
                            const isSelected = answers[question.id] === optionIndex;
                            const isSubmittedCorrect = submitted && optionIndex === question.answer;
                            const isSubmittedWrong = submitted && optionIndex === answers[question.id] && optionIndex !== question.answer;

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                                className={cn(
                                  "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                                  isSubmittedCorrect && "border-green-300 bg-green-50",
                                  isSubmittedWrong && "border-red-300 bg-red-50",
                                  !isSubmittedCorrect && !isSubmittedWrong && isSelected && "border-primary bg-primary/5",
                                  !isSelected && !isSubmittedCorrect && !isSubmittedWrong && "hover:bg-muted/40"
                                )}
                              >
                                <span className="text-sm">{option}</span>
                                {isSubmittedCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isSubmittedWrong && <AlertCircle className="w-4 h-4 text-red-600" />}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div>
                          <textarea
                            rows={4}
                            value={descriptiveAnswers[question.id] ?? ""}
                            onChange={(event) => setDescriptiveAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                            placeholder="Write your answer here..."
                            className="w-full rounded-2xl border bg-muted/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                          />
                        </div>
                      )}

                      {submitted && (
                        <div className="rounded-xl bg-muted/20 border p-3 text-sm text-muted-foreground space-y-1">
                          <p className="font-medium text-foreground">Feedback</p>
                          <p>{question.explanation ?? "Review the expected answer and compare your response."}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Send className="w-4 h-4" /> Submit Quiz
                    </button>
                    <button
                      type="button"
                      onClick={handleResetLiveQuiz}
                      className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border text-sm font-semibold hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="w-5 h-5 text-primary" /> Quiz Dashboard
              </CardTitle>
              <CardDescription>Current performance and quick stats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Score", value: `${liveScore}`, tone: "good", icon: Trophy },
                  { label: "Accuracy", value: `${liveAccuracy}%`, tone: "good", icon: Target },
                  { label: "Rank", value: "#3", tone: "warn", icon: Award },
                  { label: "Wrong", value: submitted ? String(LIVE_QUIZ.questions.length - liveCorrect) : "-", tone: "neutral", icon: AlertCircle },
                ].map(({ label, value, tone, icon: Icon }) => (
                  <div key={label} className={cn("rounded-2xl border p-3", statTone(tone))}>
                    <div className="flex items-center justify-between gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                    </div>
                    <p className="mt-3 text-2xl font-extrabold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold">Attempt Summary</p>
                    <p className="text-xs text-muted-foreground">Answered {liveCorrect}/{LIVE_QUIZ.questions.length}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    <History className="w-3.5 h-3.5" /> Live
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between"><span>MCQ answered</span><span className="font-semibold">{Object.keys(answers).length}</span></div>
                  <div className="flex items-center justify-between"><span>Descriptive answered</span><span className="font-semibold">{Object.values(descriptiveAnswers).filter((value) => value.trim()).length}</span></div>
                  <div className="flex items-center justify-between"><span>Timer progress</span><span className="font-semibold">{timedProgress}%</span></div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white dark:bg-card p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                  <HelpCircle className="w-4 h-4 text-primary" /> How to use
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> MCQs are marked instantly after submission.</li>
                  <li className="flex gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Descriptive answers can be reviewed against the model response.</li>
                  <li className="flex gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Timed tests help you practice under exam pressure.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <History className="w-5 h-5 text-primary" /> Quiz History
                    </CardTitle>
                    <CardDescription className="mt-1">Review previous quizzes, mistakes, and improvement in structured sections.</CardDescription>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    {quizHistory.length} attempts
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/30 p-1.5">
                  {[
                    { id: "review", label: "Review History", icon: History },
                    { id: "mistakes", label: "Mistake Analysis", icon: ListChecks },
                    { id: "improvement", label: "Improvement", icon: Flame },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setHistorySection(id)}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                        historySection === id ? "bg-white dark:bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          {historySection === "review" && (
            <div className="grid lg:grid-cols-[1fr_0.9fr] gap-6 items-start">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <History className="w-5 h-5 text-primary" /> Previous Quizzes
                  </CardTitle>
                  <CardDescription>Pick a quiz to review its score, accuracy, and wrong answers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizHistory.map((quiz) => {
                    const selected = quiz.id === selectedQuiz.id;
                    return (
                      <button
                        key={quiz.id}
                        type="button"
                        onClick={() => setSelectedQuizId(quiz.id)}
                        className={cn(
                          "w-full rounded-2xl border p-4 text-left transition-colors",
                          selected ? "border-primary bg-primary/5 shadow-sm" : "bg-muted/20 hover:bg-muted/40 border-transparent"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{quiz.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{quiz.subject} • {quiz.completedAt}</p>
                          </div>
                          <span className="text-xs font-semibold text-primary">{quiz.improvement}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                          <div className="rounded-xl bg-white dark:bg-card border p-2">
                            <p className="text-muted-foreground">Score</p>
                            <p className="font-semibold mt-1">{quiz.score}</p>
                          </div>
                          <div className="rounded-xl bg-white dark:bg-card border p-2">
                            <p className="text-muted-foreground">Accuracy</p>
                            <p className="font-semibold mt-1">{quiz.accuracy}%</p>
                          </div>
                          <div className="rounded-xl bg-white dark:bg-card border p-2">
                            <p className="text-muted-foreground">Wrong</p>
                            <p className="font-semibold mt-1">{quiz.wrongCount}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ListChecks className="w-5 h-5 text-primary" /> Mistake Analysis
                    </CardTitle>
                    <CardDescription>Wrong answers and model responses for the selected quiz.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border bg-muted/20 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-semibold">{selectedQuiz.title}</p>
                          <p className="text-xs text-muted-foreground">{selectedQuiz.subject} • {selectedQuiz.questions.length} questions</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {selectedQuiz.accuracy}% accuracy
                        </span>
                      </div>
                      <div className="space-y-3">
                        {selectedQuiz.questions.map((question, index) => {
                          const wrong = question.type === "mcq"
                            ? question.selected !== question.answer
                            : (question.response ?? "").trim().length === 0 || selectedQuiz.accuracy < 70;

                          return (
                            <div key={question.id} className="rounded-2xl bg-white dark:bg-card border p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Question {index + 1}</p>
                                  <p className="text-sm font-semibold mt-1">{question.prompt}</p>
                                </div>
                                <span className={cn("text-xs px-2 py-1 rounded-full font-semibold", wrong ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                                  {wrong ? "Wrong" : "Correct"}
                                </span>
                              </div>
                              <div className="mt-3 text-sm space-y-2">
                                {question.type === "mcq" ? (
                                  <>
                                    <p className="text-muted-foreground">Your answer: <span className="font-medium text-foreground">{question.options[question.selected] ?? "Not answered"}</span></p>
                                    <p className="text-muted-foreground">Correct answer: <span className="font-medium text-foreground">{question.options[question.answer]}</span></p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-muted-foreground">Your answer: <span className="font-medium text-foreground">{question.response ?? "Not answered"}</span></p>
                                    <p className="text-muted-foreground">Model answer: <span className="font-medium text-foreground">{question.answer}</span></p>
                                  </>
                                )}
                                <p className="text-xs text-muted-foreground pt-1">{question.explanation}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Flame className="w-5 h-5 text-pink-500" /> Improvement Track
                    </CardTitle>
                    <CardDescription>See how each quiz changed over time.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quizHistory.map((quiz) => {
                      const scoreBar = quiz.score * 5;
                      const accuracyBar = quiz.accuracy;

                      return (
                        <div key={quiz.id} className="rounded-2xl border bg-muted/20 p-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="text-sm font-semibold">{quiz.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{quiz.subject}</p>
                            </div>
                            <span className="text-xs font-semibold text-primary">{quiz.improvement}</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Score</span>
                                <span className="font-semibold">{quiz.score}/20</span>
                              </div>
                              <div className="h-2 rounded-full bg-white dark:bg-card overflow-hidden border">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${scoreBar}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Accuracy</span>
                                <span className="font-semibold">{accuracyBar}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-white dark:bg-card overflow-hidden border">
                                <div className={cn("h-full rounded-full", quizTone(accuracyBar))} style={{ width: `${accuracyBar}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {historySection === "mistakes" && (
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ListChecks className="w-5 h-5 text-primary" /> Mistake Index
                  </CardTitle>
                  <CardDescription>Focus on the quizzes with the most wrong answers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizHistory
                    .slice()
                    .sort((a, b) => b.wrongCount - a.wrongCount)
                    .map((quiz) => (
                      <div key={quiz.id} className="rounded-2xl border bg-muted/20 p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{quiz.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{quiz.subject}</p>
                        </div>
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", quiz.wrongCount > 1 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700")}>
                          {quiz.wrongCount} wrong
                        </span>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="w-5 h-5 text-primary" /> Deep Error Review
                  </CardTitle>
                  <CardDescription>Compare your response with the correct answer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedQuiz.questions.map((question, index) => {
                    const wrong = question.type === "mcq"
                      ? question.selected !== question.answer
                      : (question.response ?? "").trim().length === 0 || selectedQuiz.accuracy < 70;

                    if (!wrong) return null;

                    return (
                      <div key={question.id} className="rounded-2xl border bg-muted/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Question {index + 1}</p>
                            <p className="text-sm font-semibold mt-1">{question.prompt}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-semibold bg-red-100 text-red-700">Wrong</span>
                        </div>
                        <div className="mt-3 rounded-xl bg-white dark:bg-card border p-3 text-sm space-y-2">
                          <p className="text-muted-foreground">Your answer: <span className="font-medium text-foreground">{question.type === "mcq" ? (question.options[question.selected] ?? "Not answered") : (question.response ?? "Not answered")}</span></p>
                          <p className="text-muted-foreground">Correct answer: <span className="font-medium text-foreground">{question.type === "mcq" ? question.options[question.answer] : question.answer}</span></p>
                          <p className="text-xs text-muted-foreground pt-1">{question.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {historySection === "improvement" && (
            <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Flame className="w-5 h-5 text-pink-500" /> Improvement Overview
                  </CardTitle>
                  <CardDescription>Track score changes and consistent progress.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border bg-muted/20 p-4 text-center">
                      <p className="text-xs text-muted-foreground">Best score</p>
                      <p className="text-2xl font-extrabold mt-1">{Math.max(...quizHistory.map((quiz) => quiz.score))}</p>
                    </div>
                    <div className="rounded-2xl border bg-muted/20 p-4 text-center">
                      <p className="text-xs text-muted-foreground">Best accuracy</p>
                      <p className="text-2xl font-extrabold mt-1">{Math.max(...quizHistory.map((quiz) => quiz.accuracy))}%</p>
                    </div>
                    <div className="rounded-2xl border bg-muted/20 p-4 text-center">
                      <p className="text-xs text-muted-foreground">Recent trend</p>
                      <p className="text-2xl font-extrabold mt-1 text-green-600">+12%</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-white dark:bg-card p-4 space-y-3">
                    {quizHistory.map((quiz, index) => (
                      <div key={quiz.id} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-muted-foreground truncate">Q{index + 1}</div>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden border">
                          <div className={cn("h-full rounded-full", quizTone(quiz.accuracy))} style={{ width: `${quiz.accuracy}%` }} />
                        </div>
                        <div className="w-12 text-xs font-semibold text-right">{quiz.accuracy}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="w-5 h-5 text-primary" /> Improvement Notes
                  </CardTitle>
                  <CardDescription>What the trend says about your performance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizHistory.map((quiz) => (
                    <div key={quiz.id} className="rounded-2xl border bg-muted/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{quiz.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{quiz.subject}</p>
                        </div>
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", quiz.improvement.startsWith("+") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                          {quiz.improvement}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {quiz.improvement.startsWith("+")
                          ? "You improved on this quiz compared with your earlier attempts."
                          : "This result shows a dip; review the wrong answers and retry similar questions."
                        }
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t bg-white dark:bg-card py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>
    </div>
  );
}
