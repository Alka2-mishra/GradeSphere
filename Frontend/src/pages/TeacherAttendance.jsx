import { useState } from "react";
import { CalendarDays, Check, Clock, X, Users, CheckCircle, ChevronDown } from "lucide-react";
import TeacherLayout from "../layouts/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const CLASSES = [
  { id: 1, name: "Mathematics 101", color: "bg-violet-500" },
  { id: 2, name: "Advanced Physics", color: "bg-blue-500" },
  { id: 3, name: "Computer Science", color: "bg-green-500" },
  { id: 4, name: "English Literature", color: "bg-orange-500" },
  { id: 5, name: "Chemistry Basics", color: "bg-pink-500" },
];

const STUDENTS_BY_CLASS = {
  1: ["Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Singh", "Vikram Nair", "Sneha Iyer", "Arjun Verma", "Kavya Reddy"],
  2: ["Ishaan Gupta", "Pooja Joshi", "Karan Malhotra", "Divya Pillai", "Rahul Yadav", "Nisha Bose", "Aditya Kumar", "Meera Desai"],
  3: ["Siddharth Rao", "Riya Kapoor", "Aryan Mishra", "Tanvi Shah", "Nikhil Jain", "Shreya Nambiar", "Dhruv Pandey", "Lakshmi Menon"],
  4: ["Yash Agarwal", "Zara Khan", "Abhishek Tiwari", "Bhavna Choudhary", "Chirag Saxena", "Deepika Shetty", "Eshan Banerjee", "Falak Qureshi"],
  5: ["Gaurav Tripathi", "Harini Subramaniam", "Ishan Chauhan", "Jyoti Kulkarni", "Kartik Bhatt", "Lavanya Nair", "Manish Dubey", "Neha Patil"],
};

const STATUS = {
  present: { label: "Present", icon: Check, color: "bg-green-100 text-green-700 border-green-200", active: "bg-green-500 text-white border-green-500" },
  late:    { label: "Late",    icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200", active: "bg-yellow-500 text-white border-yellow-500" },
  absent:  { label: "Absent",  icon: X,     color: "bg-red-100 text-red-700 border-red-200",          active: "bg-red-500 text-white border-red-500" },
};

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [date, setDate] = useState(today());
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);
  const [classDropdown, setClassDropdown] = useState(false);

  const students = STUDENTS_BY_CLASS[selectedClass.id];
  const key = (name) => `${selectedClass.id}|${date}|${name}`;

  function mark(name, status) {
    setSaved(false);
    setAttendance((prev) => ({ ...prev, [key(name)]: status }));
  }

  function markAll(status) {
    setSaved(false);
    setAttendance((prev) => {
      const next = { ...prev };
      students.forEach((n) => { next[key(n)] = status; });
      return next;
    });
  }

  function handleSave() {
    // In a real app, POST to backend here
    setSaved(true);
  }

  const counts = students.reduce(
    (acc, n) => { const s = attendance[key(n)]; if (s) acc[s]++; return acc; },
    { present: 0, late: 0, absent: 0 }
  );
  const unmarked = students.length - counts.present - counts.late - counts.absent;

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Attendance</h1>
            <p className="text-sm text-muted-foreground mt-1">Mark and track student attendance.</p>
          </div>
          <Button onClick={handleSave} disabled={unmarked > 0 || saved}>
            <CheckCircle className="w-4 h-4" />
            {saved ? "Saved!" : "Save Attendance"}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Class selector */}
          <div className="relative">
            <button
              onClick={() => setClassDropdown((v) => !v)}
              className="flex items-center gap-2 h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted transition-colors min-w-52"
            >
              <span className={cn("w-3 h-3 rounded-full shrink-0", selectedClass.color)} />
              {selectedClass.name}
              <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
            </button>
            {classDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setClassDropdown(false)} />
                <div className="absolute left-0 top-11 z-20 w-full bg-white rounded-xl border shadow-lg py-1 text-sm">
                  {CLASSES.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => { setSelectedClass(cls); setClassDropdown(false); setSaved(false); }}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 hover:bg-muted transition-colors",
                        selectedClass.id === cls.id && "bg-muted font-semibold"
                      )}
                    >
                      <span className={cn("w-3 h-3 rounded-full shrink-0", cls.color)} />
                      {cls.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date picker */}
          <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => { setDate(e.target.value); setSaved(false); }}
              className="bg-transparent focus:outline-none text-sm"
            />
          </div>

          {/* Mark all */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-muted-foreground mr-1">Mark all:</span>
            {Object.entries(STATUS).map(([s, { label, icon: Icon, active }]) => (
              <button
                key={s}
                onClick={() => markAll(s)}
                className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors", active)}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Present", count: counts.present, color: "text-green-600", bg: "bg-green-50" },
            { label: "Late",    count: counts.late,    color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Absent",  count: counts.absent,  color: "text-red-600",   bg: "bg-red-50" },
            { label: "Unmarked", count: unmarked,      color: "text-muted-foreground", bg: "bg-muted/50" },
          ].map(({ label, count, color, bg }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className={cn("pt-4 pb-3 flex items-center gap-3 rounded-xl", bg)}>
                <div>
                  <p className={cn("text-2xl font-extrabold leading-none", color)}>{count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student list */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-primary" /> {selectedClass.name}
            </CardTitle>
            <CardDescription>{students.length} students · {date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {students.map((name, i) => {
              const current = attendance[key(name)];
              return (
                <div
                  key={name}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {Object.entries(STATUS).map(([s, { label, icon: Icon, color, active }]) => (
                      <button
                        key={s}
                        onClick={() => mark(name, s)}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors",
                          current === s ? active : color
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {unmarked > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            {unmarked} student{unmarked > 1 ? "s" : ""} not yet marked — mark all to enable save.
          </p>
        )}
      </div>
    </TeacherLayout>
  );
}
