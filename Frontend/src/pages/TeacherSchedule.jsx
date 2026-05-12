import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2,
  FlaskConical, ClipboardList, Users, Bell, CalendarDays, Clock,
} from "lucide-react";
import TeacherLayout from "../layouts/TeacherLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "../lib/utils";

// ── Config ────────────────────────────────────────────────────────────────────

const EVENT_TYPES = {
  test:       { label: "Test / Exam",          icon: FlaskConical,  color: "bg-red-500",    light: "bg-red-50 text-red-700 border-red-200"    },
  assignment: { label: "Assignment Deadline",  icon: ClipboardList, color: "bg-orange-500", light: "bg-orange-50 text-orange-700 border-orange-200" },
  meeting:    { label: "Meeting",              icon: Users,         color: "bg-blue-500",   light: "bg-blue-50 text-blue-700 border-blue-200"  },
  reminder:   { label: "Reminder",             icon: Bell,          color: "bg-violet-500", light: "bg-violet-50 text-violet-700 border-violet-200" },
};

const CLASSES = ["Mathematics 101", "Advanced Physics", "Computer Science", "English Literature", "Chemistry Basics"];
const DAYS    = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Seed data (relative to today) ────────────────────────────────────────────

function makeDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

const seedEvents = [
  { id: 1,  date: makeDate(1),  type: "test",       title: "Mathematics Mid-Term",          class: "Mathematics 101",    time: "09:00", note: "Chapters 1–6, bring calculator." },
  { id: 2,  date: makeDate(2),  type: "assignment",  title: "Physics Lab Report Due",        class: "Advanced Physics",   time: "11:59", note: "Submit via portal." },
  { id: 3,  date: makeDate(3),  type: "meeting",     title: "Parent-Teacher Meeting",        class: "",                   time: "14:00", note: "Room 301, all parents invited." },
  { id: 4,  date: makeDate(4),  type: "reminder",    title: "Upload CS Grades",              class: "Computer Science",   time: "08:00", note: "" },
  { id: 5,  date: makeDate(5),  type: "test",        title: "Chemistry Quiz 3",              class: "Chemistry Basics",   time: "10:00", note: "Organic reactions chapter." },
  { id: 6,  date: makeDate(6),  type: "assignment",  title: "English Essay Deadline",        class: "English Literature", time: "23:59", note: "Min 1500 words." },
  { id: 7,  date: makeDate(8),  type: "meeting",     title: "Staff Coordination Meeting",    class: "",                   time: "13:00", note: "Conference hall B." },
  { id: 8,  date: makeDate(9),  type: "test",        title: "Physics Unit Test",             class: "Advanced Physics",   time: "09:30", note: "Electromagnetism unit." },
  { id: 9,  date: makeDate(10), type: "reminder",    title: "Submit Attendance Report",      class: "",                   time: "17:00", note: "Monthly report to admin." },
  { id: 10, date: makeDate(12), type: "assignment",  title: "CS Project Phase 2 Due",        class: "Computer Science",   time: "23:59", note: "GitHub link required." },
  { id: 11, date: makeDate(14), type: "test",        title: "Mathematics Final Exam",        class: "Mathematics 101",    time: "09:00", note: "Full syllabus." },
  { id: 12, date: makeDate(15), type: "meeting",     title: "Curriculum Review Meeting",     class: "",                   time: "11:00", note: "Bring syllabus copy." },
  { id: 13, date: makeDate(-1), type: "test",        title: "Chemistry Mid-Term",            class: "Chemistry Basics",   time: "10:00", note: "" },
  { id: 14, date: makeDate(-3), type: "assignment",  title: "Math Problem Set 7 Due",        class: "Mathematics 101",    time: "23:59", note: "" },
  { id: 15, date: makeDate(-5), type: "reminder",    title: "Board Exam Registration",       class: "",                   time: "09:00", note: "Deadline for registration." },
];

const emptyForm = { title: "", type: "test", class: "", time: "", note: "" };

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOf(year, month)  { return new Date(year, month, 1).getDay(); }
function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function fmt12(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}
function todayStr() { return new Date().toISOString().split("T")[0]; }

// ── Sub-components ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function EventPill({ event, onClick }) {
  const { color } = EVENT_TYPES[event.type];
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      className={cn("w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white leading-tight", color)}
    >
      {event.title}
    </button>
  );
}

function EventCard({ event, onEdit, onDelete }) {
  const { label, icon: Icon, light } = EVENT_TYPES[event.type];
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-xl border", light)}>
      <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{event.title}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
          <span className="text-xs opacity-70">{label}</span>
          {event.time && <span className="text-xs opacity-70 flex items-center gap-0.5"><Clock className="w-3 h-3" />{fmt12(event.time)}</span>}
          {event.class && <span className="text-xs opacity-70 truncate">{event.class}</span>}
        </div>
        {event.note && <p className="text-xs opacity-60 mt-1 truncate">{event.note}</p>}
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={() => onEdit(event)} className="p-1 rounded hover:bg-white/50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDelete(event.id)} className="p-1 rounded hover:bg-white/50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeacherSchedule() {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [events, setEvents] = useState(seedEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ ...emptyForm, date: todayStr() });

  // ── Navigation ──────────────────────────────────────────────────────────
  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  // ── Calendar grid ───────────────────────────────────────────────────────
  const totalDays  = daysInMonth(year, month);
  const startDay   = firstDayOf(year, month);
  const cells      = Array.from({ length: startDay + totalDays }, (_, i) =>
    i < startDay ? null : i - startDay + 1
  );

  function eventsOn(dateStr) {
    return events.filter(e => e.date === dateStr);
  }

  // ── CRUD ────────────────────────────────────────────────────────────────
  function openCreate(date) {
    setEditTarget(null);
    setForm({ ...emptyForm, date: date || selectedDate });
    setModalOpen(true);
  }

  function openEdit(event) {
    setEditTarget(event);
    setForm({ title: event.title, type: event.type, class: event.class, time: event.time, note: event.note, date: event.date });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (editTarget) {
      setEvents(prev => prev.map(e => e.id === editTarget.id ? { ...e, ...form } : e));
    } else {
      setEvents(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setModalOpen(false);
  }

  function handleDelete(id) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  const dayEvents = eventsOn(selectedDate);

  // ── Upcoming (next 7 days) ───────────────────────────────────────────────
  const upcoming = events
    .filter(e => e.date >= todayStr())
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5);

  return (
    <TeacherLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar & Schedule</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage tests, deadlines, meetings and reminders.</p>
          </div>
          <Button onClick={() => openCreate(selectedDate)}>
            <Plus className="w-4 h-4" /> Add Event
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(EVENT_TYPES).map(([key, { label, icon: Icon, color }]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("w-2.5 h-2.5 rounded-full", color)} />
              {label}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">

          {/* ── Calendar ── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{MONTHS[month]} {year}</CardTitle>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelectedDate(todayStr()); }}
                    className="px-2.5 py-1 text-xs font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    Today
                  </button>
                  <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              {/* Date cells */}
              <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
                {cells.map((day, i) => {
                  if (!day) return <div key={i} className="bg-muted/30 min-h-[80px]" />;
                  const dateStr   = toDateStr(year, month, day);
                  const dayEvts   = eventsOn(dateStr);
                  const isToday   = dateStr === todayStr();
                  const isSelected = dateStr === selectedDate;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={cn(
                        "bg-white min-h-[80px] p-1.5 cursor-pointer transition-colors hover:bg-primary/5",
                        isSelected && "bg-primary/10 hover:bg-primary/10"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1 mx-auto",
                        isToday ? "bg-primary text-white" : "text-foreground"
                      )}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvts.slice(0, 2).map(ev => (
                          <EventPill key={ev.id} event={ev} onClick={openEdit} />
                        ))}
                        {dayEvts.length > 2 && (
                          <p className="text-[10px] text-muted-foreground text-center">+{dayEvts.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Right panel ── */}
          <div className="space-y-4">

            {/* Selected day events */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  </CardTitle>
                  <button
                    onClick={() => openCreate(selectedDate)}
                    className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarDays className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No events on this day.</p>
                    <button onClick={() => openCreate(selectedDate)} className="text-xs text-primary mt-1 hover:underline">
                      + Add one
                    </button>
                  </div>
                ) : (
                  dayEvents
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(ev => (
                      <EventCard key={ev.id} event={ev} onEdit={openEdit} onDelete={handleDelete} />
                    ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming events */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcoming.map(ev => {
                  const { color, icon: Icon } = EVENT_TYPES[ev.type];
                  const evDate = new Date(ev.date + "T00:00:00");
                  const diff   = Math.round((evDate - new Date(todayStr() + "T00:00:00")) / 86400000);
                  const label  = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : `In ${diff} days`;
                  return (
                    <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => { setSelectedDate(ev.date); setYear(new Date(ev.date).getFullYear()); setMonth(new Date(ev.date).getMonth()); }}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white", color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{ev.title}</p>
                        {ev.class && <p className="text-[11px] text-muted-foreground truncate">{ev.class}</p>}
                      </div>
                      <span className="text-[11px] font-semibold text-primary shrink-0">{label}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <Modal title={editTarget ? "Edit Event" : "Add Event"} onClose={() => setModalOpen(false)}>
          <div className="space-y-4">

            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Event Type</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(EVENT_TYPES).map(([key, { label, icon: Icon, color }]) => (
                  <button
                    key={key}
                    onClick={() => setForm(p => ({ ...p, type: key }))}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                      form.type === key
                        ? cn("text-white border-transparent", color)
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Mathematics Mid-Term"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
            </div>

            {/* Class */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Class (optional)</label>
              <select
                value={form.class}
                onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              >
                <option value="">— None —</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Note</label>
              <textarea
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                rows={2}
                placeholder="Optional details..."
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title.trim() || !form.date}>
              {editTarget ? "Save Changes" : "Add Event"}
            </Button>
          </div>
        </Modal>
      )}
    </TeacherLayout>
  );
}
