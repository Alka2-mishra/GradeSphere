import { useState, useRef } from "react";
import {
  UserCircle, Pencil, KeyRound, Upload, Mail, Phone,
  MapPin, BadgeCheck, Briefcase, GraduationCap, BookOpen,
  Building2, X, Eye, EyeOff, Save, Camera,
} from "lucide-react";
import TeacherLayout from "../layouts/TeacherLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const initialProfile = {
  name: "Prof. Robert Anderson",
  employeeId: "EMP-2024-0042",
  department: "Science & Technology",
  qualification: "Ph.D. in Computer Science",
  specialization: "Machine Learning & Data Structures",
  experience: "12 Years",
  email: "r.anderson@gradesphere.edu",
  phone: "+1 (555) 012-3456",
  address: "42 Campus Drive, Springfield, IL 62701",
  bio: "Passionate educator with over 12 years of experience in teaching computer science and mathematics. Committed to fostering critical thinking and problem-solving skills in students.",
  photo: null,
};

function Field({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
      />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
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

export default function TeacherProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileRef = useRef();

  // ── Image upload ──────────────────────────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfile((p) => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  // ── Edit Profile ──────────────────────────────────────────────────────────
  function handleEditChange(e) {
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleEditSave() {
    setProfile(editForm);
    setEditOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  // ── Change Password ───────────────────────────────────────────────────────
  function handlePwChange(e) {
    setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setPwError("");
  }

  function handlePwSave() {
    if (!pwForm.current) return setPwError("Enter your current password.");
    if (pwForm.next.length < 6) return setPwError("New password must be at least 6 characters.");
    if (pwForm.next !== pwForm.confirm) return setPwError("Passwords do not match.");
    setPwSuccess(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => { setPwSuccess(false); setPwOpen(false); }, 1800);
  }

  const togglePw = (field) => setShowPw((p) => ({ ...p, [field]: !p[field] }));

  return (
    <TeacherLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your personal & professional details.</p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <BadgeCheck className="w-4 h-4 shrink-0" /> Profile updated successfully.
          </div>
        )}

        {/* ── Profile Hero Card ── */}
        <Card className="border-0 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary to-violet-500" />

          <CardContent className="pt-0 pb-6 px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative w-24 h-24 shrink-0">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-primary/10 overflow-hidden flex items-center justify-center">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-14 h-14 text-primary/40" />
                  )}
                </div>
                {/* Camera overlay */}
                <button
                  onClick={() => fileRef.current.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors"
                  title="Change photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Name & ID */}
              <div className="flex-1 sm:pb-1">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {profile.employeeId}
                  </span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {profile.department}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 max-w-lg">{profile.bio}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 sm:pb-1 shrink-0">
                <Button size="sm" onClick={() => { setEditForm(profile); setEditOpen(true); }}>
                  <Pencil className="w-4 h-4" /> Edit Profile
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPwOpen(true)}>
                  <KeyRound className="w-4 h-4" /> Change Password
                </Button>
                <Button size="sm" variant="outline" onClick={() => fileRef.current.click()}>
                  <Upload className="w-4 h-4" /> Upload Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Details Grid ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Personal & Professional Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-primary" /> Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Full Name" value={profile.name} icon={UserCircle} />
              <Field label="Employee ID" value={profile.employeeId} icon={BadgeCheck} />
              <Field label="Department" value={profile.department} icon={Building2} />
              <Field label="Qualification" value={profile.qualification} icon={GraduationCap} />
              <Field label="Specialization" value={profile.specialization} icon={BookOpen} />
              <Field label="Experience" value={profile.experience} icon={Briefcase} />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Email Address" value={profile.email} icon={Mail} />
              <Field label="Phone Number" value={profile.phone} icon={Phone} />
              <Field label="Address" value={profile.address} icon={MapPin} />

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "Classes", value: "6" },
                  { label: "Students", value: "214" },
                  { label: "Exp.", value: "12 Yrs" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-muted/50 p-3 text-center">
                    <p className="text-lg font-extrabold text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {editOpen && (
        <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            <Input label="Full Name" name="name" value={editForm.name} onChange={handleEditChange} />
            <Input label="Employee ID" name="employeeId" value={editForm.employeeId} onChange={handleEditChange} />
            <Input label="Department" name="department" value={editForm.department} onChange={handleEditChange} />
            <Input label="Qualification" name="qualification" value={editForm.qualification} onChange={handleEditChange} />
            <Input label="Specialization" name="specialization" value={editForm.specialization} onChange={handleEditChange} />
            <Input label="Experience" name="experience" value={editForm.experience} onChange={handleEditChange} placeholder="e.g. 12 Years" />
            <Input label="Email" name="email" type="email" value={editForm.email} onChange={handleEditChange} />
            <Input label="Phone" name="phone" value={editForm.phone} onChange={handleEditChange} />
            <Input label="Address" name="address" value={editForm.address} onChange={handleEditChange} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Change Password Modal ── */}
      {pwOpen && (
        <Modal title="Change Password" onClose={() => { setPwOpen(false); setPwError(""); setPwSuccess(false); }}>
          <div className="space-y-4">
            {["current", "next", "confirm"].map((field) => {
              const labels = { current: "Current Password", next: "New Password", confirm: "Confirm New Password" };
              return (
                <div key={field} className="space-y-1.5">
                  <label className="text-sm font-medium">{labels[field]}</label>
                  <div className="relative">
                    <input
                      type={showPw[field] ? "text" : "password"}
                      name={field}
                      value={pwForm[field]}
                      onChange={handlePwChange}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                    <button
                      type="button"
                      onClick={() => togglePw(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}

            {pwError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{pwError}</p>
            )}
            {pwSuccess && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> Password changed successfully!
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
            <Button variant="outline" onClick={() => { setPwOpen(false); setPwError(""); }}>Cancel</Button>
            <Button onClick={handlePwSave}>
              <KeyRound className="w-4 h-4" /> Update Password
            </Button>
          </div>
        </Modal>
      )}
    </TeacherLayout>
  );
}
