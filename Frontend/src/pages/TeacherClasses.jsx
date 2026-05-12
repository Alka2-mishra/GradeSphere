import { useState } from "react";
import {
  Plus, Search, MoreVertical, Pencil, Archive, Trash2,
  Copy, Check, BookOpen, Users, Hash, X, Save,
  ArchiveRestore, RefreshCw, GraduationCap, Filter,
} from "lucide-react";
import TeacherLayout from "../layouts/TeacherLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { cn } from "../lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "English Literature", "History",
  "Geography", "Economics", "Art & Design",
];

const COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-yellow-500",
];

const initialClasses = [
  { id: 1, name: "Mathematics 101", subject: "Mathematics", section: "A", room: "Room 204", students: 38, code: "MAT101", color: "bg-violet-500", archived: false, createdAt: "Jan 10, 2025" },
  { id: 2, name: "Advanced Physics", subject: "Physics", section: "B", room: "Lab 3", students: 30, code: "PHY202", color: "bg-blue-500", archived: false, createdAt: "Jan 12, 2025" },
  { id: 3, name: "Computer Science", subject: "Computer Science", section: "A", room: "CS Lab", students: 42, code: "CS303", color: "bg-green-500", archived: false, createdAt: "Jan 15, 2025" },
  { id: 4, name: "English Literature", subject: "English Literature", section: "C", room: "Room 101", students: 35, code: "ENG404", color: "bg-orange-500", archived: false, createdAt: "Jan 18, 2025" },
  { id: 5, name: "Chemistry Basics", subject: "Chemistry", section: "A", room: "Lab 1", students: 40, code: "CHE505", color: "bg-pink-500", archived: false, createdAt: "Feb 2, 2025" },
  { id: 6, name: "Biology Advanced", subject: "Biology", section: "B", room: "Lab 2", students: 29, code: "BIO606", color: "bg-teal-500", archived: true, createdAt: "Sep 5, 2024" },
];

const emptyForm = { name: "", subject: "", section: "", room: "", color: COLORS[0] };

// ── Sub-components ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, size = "md" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={cn("bg-white rounded-2xl shadow-xl w-full", size === "sm" ? "max-w-sm" : "max-w-lg")}>
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

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
    />
  );
}

function CopyCode({ code }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-mono bg-muted px-2 py-1 rounded-md hover:bg-muted/80 transition-colors"
      title="Copy code"
    >
      <Hash className="w-3 h-3 text-muted-foreground" />
      {code}
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

function ClassCard({ cls, onEdit, onArchive, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className={cn("border-0 shadow-sm hover:shadow-md transition-shadow relative", cls.archived && "opacity-70")}>
      {/* Color bar */}
      <div className={cn("h-2 rounded-t-xl", cls.color)} />

      <CardContent className="pt-4 pb-5 px-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cls.color)}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{cls.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{cls.subject}</p>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl border shadow-lg py-1 text-sm">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(cls); }}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-blue-500" /> Edit Details
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onArchive(cls.id); }}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted transition-colors"
                  >
                    {cls.archived
                      ? <><ArchiveRestore className="w-4 h-4 text-green-600" /> Unarchive</>
                      : <><Archive className="w-4 h-4 text-yellow-600" /> Archive</>
                    }
                  </button>
                  <div className="border-t my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(cls); }}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Class
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Section {cls.section}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{cls.room}</span>
          {cls.archived && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Archived</span>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{cls.students} students</span>
          </div>
          <CopyCode code={cls.code} />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeacherClasses() {
  const [classes, setClasses] = useState(initialClasses);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active"); // "active" | "archived" | "all"
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // ── Derived list ─────────────────────────────────────────────────────────
  const visible = classes.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true : filter === "archived" ? c.archived : !c.archived;
    return matchSearch && matchFilter;
  });

  const activeCount = classes.filter((c) => !c.archived).length;
  const archivedCount = classes.filter((c) => c.archived).length;
  const totalStudents = classes.filter((c) => !c.archived).reduce((s, c) => s + c.students, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function openCreate() {
    setForm(emptyForm);
    setGeneratedCode(generateCode());
    setCodeCopied(false);
    setCreateOpen(true);
  }

  function handleCreate() {
    if (!form.name || !form.subject) return;
    const newClass = {
      id: Date.now(),
      ...form,
      code: generatedCode,
      students: 0,
      archived: false,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setClasses((p) => [newClass, ...p]);
    setCreateOpen(false);
  }

  function openEdit(cls) {
    setEditTarget(cls);
    setForm({ name: cls.name, subject: cls.subject, section: cls.section, room: cls.room, color: cls.color });
  }

  function handleEdit() {
    setClasses((p) => p.map((c) => c.id === editTarget.id ? { ...c, ...form } : c));
    setEditTarget(null);
  }

  function handleArchive(id) {
    setClasses((p) => p.map((c) => c.id === id ? { ...c, archived: !c.archived } : c));
  }

  function handleDelete() {
    setClasses((p) => p.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <TeacherLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Classroom Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Create and manage your classrooms.</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" /> Create Classroom
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Classes", value: activeCount, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
            { label: "Total Students", value: totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Archived", value: archivedCount, icon: Archive, color: "text-yellow-600", bg: "bg-yellow-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="pt-5 pb-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold leading-none">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by class name or subject..."
              className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border">
            {[
              { key: "active", label: "Active" },
              { key: "archived", label: "Archived" },
              { key: "all", label: "All" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  filter === key ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Class grid */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold">No classrooms found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? "Try a different search term." : "Create your first classroom to get started."}
            </p>
            {!search && (
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="w-4 h-4" /> Create Classroom
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onEdit={openEdit}
                onArchive={handleArchive}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Create Classroom Modal ── */}
      {createOpen && (
        <Modal title="Create Classroom" onClose={() => setCreateOpen(false)}>
          <div className="space-y-4">
            <FormField label="Class Name *">
              <Input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Mathematics 101" />
            </FormField>

            <FormField label="Subject *">
              <select
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              >
                <option value="">Select a subject</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Section">
                <Input name="section" value={form.section} onChange={handleFormChange} placeholder="e.g. A" />
              </FormField>
              <FormField label="Room / Location">
                <Input name="room" value={form.room} onChange={handleFormChange} placeholder="e.g. Room 204" />
              </FormField>
            </div>

            {/* Color picker */}
            <FormField label="Class Color">
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((p) => ({ ...p, color: c }))}
                    className={cn("w-7 h-7 rounded-full transition-transform", c, form.color === c && "ring-2 ring-offset-2 ring-primary scale-110")}
                  />
                ))}
              </div>
            </FormField>

            {/* Generated code */}
            <FormField label="Classroom Code">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-10 px-3 rounded-md border border-input bg-muted/50 text-sm font-mono flex items-center font-semibold tracking-widest text-primary">
                  {generatedCode}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setGeneratedCode(generateCode())}
                  title="Regenerate code"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyCode(generatedCode)}
                  title="Copy code"
                >
                  {codeCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Share this code with students to join the class.</p>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.subject}>
              <Plus className="w-4 h-4" /> Create Classroom
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Edit Classroom Modal ── */}
      {editTarget && (
        <Modal title="Edit Classroom" onClose={() => setEditTarget(null)}>
          <div className="space-y-4">
            <FormField label="Class Name *">
              <Input name="name" value={form.name} onChange={handleFormChange} />
            </FormField>

            <FormField label="Subject *">
              <select
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Section">
                <Input name="section" value={form.section} onChange={handleFormChange} />
              </FormField>
              <FormField label="Room / Location">
                <Input name="room" value={form.room} onChange={handleFormChange} />
              </FormField>
            </div>

            <FormField label="Class Color">
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((p) => ({ ...p, color: c }))}
                    className={cn("w-7 h-7 rounded-full transition-transform", c, form.color === c && "ring-2 ring-offset-2 ring-primary scale-110")}
                  />
                ))}
              </div>
            </FormField>

            {/* Show existing code (read-only) */}
            <FormField label="Classroom Code">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-10 px-3 rounded-md border border-input bg-muted/50 text-sm font-mono flex items-center font-semibold tracking-widest text-primary">
                  {editTarget.code}
                </div>
                <CopyCode code={editTarget.code} />
              </div>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit}>
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <Modal title="Delete Classroom" onClose={() => setDeleteTarget(null)} size="sm">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <p className="font-semibold">Delete "{deleteTarget.name}"?</p>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the classroom and all its data. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </Modal>
      )}
    </TeacherLayout>
  );
}
