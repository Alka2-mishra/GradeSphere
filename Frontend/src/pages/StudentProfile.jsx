import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, UserCircle, Camera, Upload,
  Pencil, KeyRound, Save, X, Eye, EyeOff, BadgeCheck,
  Mail, Phone, MapPin, Hash, BookOpen, Layers, Users, CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

// ── Initial Data ──────────────────────────────────────────────────────────────

const initialProfile = {
  name:        "Aarav Sharma",
  rollNumber:  "CS-2022-0341",
  branch:      "Computer Science & Engineering",
  semester:    "4th Semester",
  section:     "Section A",
  email:       "aarav.sharma@gradesphere.edu",
  phone:       "+91 98765 43210",
  address:     "42, Shivaji Nagar, Pune, Maharashtra - 411005",
  dob:         "12 March 2004",
  gender:      "Male",
  guardian:    "Rajesh Sharma",
  guardianPhone: "+91 99887 76655",
  bio:         "Passionate about technology and problem-solving. Aiming for a career in software engineering with a focus on AI and machine learning.",
  photo:       null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function FormInput({ label, name, value, onChange, type = "text", placeholder, readOnly }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} readOnly={readOnly}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition disabled:opacity-60"
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

// ── Navbar (shared student nav) ───────────────────────────────────────────────

function StudentNav({ name, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">GradeSphere</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <Link to="/student/subjects" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <BookOpen className="w-4 h-4" /> Subjects
          </Link>
          <Link to="/student/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {name[0]}
            </div>
            <span className="hidden md:block text-sm font-semibold">{name}</span>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentProfile() {
  const navigate  = useNavigate();
  const fileRef   = useRef();

  const [profile,     setProfile]     = useState(initialProfile);
  const [editOpen,    setEditOpen]     = useState(false);
  const [pwOpen,      setPwOpen]       = useState(false);
  const [editForm,    setEditForm]     = useState(profile);
  const [pwForm,      setPwForm]       = useState({ current: "", next: "", confirm: "" });
  const [showPw,      setShowPw]       = useState({ current: false, next: false, confirm: false });
  const [pwError,     setPwError]      = useState("");
  const [pwSuccess,   setPwSuccess]    = useState(false);
  const [saveSuccess, setSaveSuccess]  = useState(false);

  function handleLogout() {
    localStorage.removeItem("gs_role");
    navigate("/");
  }

  // ── Photo ────────────────────────────────────────────────────────────────
  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfile(p => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  function handleEditChange(e) {
    setEditForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }
  function handleEditSave() {
    setProfile(editForm);
    setEditOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  // ── Password ─────────────────────────────────────────────────────────────
  function handlePwChange(e) {
    setPwForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setPwError("");
  }
  function handlePwSave() {
    if (!pwForm.current)           return setPwError("Enter your current password.");
    if (pwForm.next.length < 6)    return setPwError("New password must be at least 6 characters.");
    if (pwForm.next !== pwForm.confirm) return setPwError("Passwords do not match.");
    setPwSuccess(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => { setPwSuccess(false); setPwOpen(false); }, 1800);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
      <StudentNav name={profile.name} onLogout={handleLogout} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your personal & academic details.</p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <BadgeCheck className="w-4 h-4 shrink-0" /> Profile updated successfully.
          </div>
        )}

        {/* ── Hero Card ── */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-violet-500" />
          <CardContent className="pt-0 pb-6 px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">

              {/* Avatar */}
              <div className="relative w-24 h-24 shrink-0">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-primary/10 overflow-hidden flex items-center justify-center">
                  {profile.photo
                    ? <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                    : <UserCircle className="w-14 h-14 text-primary/40" />
                  }
                </div>
                <button
                  onClick={() => fileRef.current.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>

              {/* Name & badges */}
              <div className="flex-1 sm:pb-1">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{profile.rollNumber}</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{profile.branch}</span>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">{profile.semester}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{profile.section}</span>
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

          {/* Academic Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Full Name"    value={profile.name}       icon={UserCircle}  />
              <Field label="Roll Number"  value={profile.rollNumber}  icon={Hash}        />
              <Field label="Branch"       value={profile.branch}      icon={BookOpen}    />
              <Field label="Semester"     value={profile.semester}    icon={Layers}      />
              <Field label="Section"      value={profile.section}     icon={Users}       />
              <Field label="Date of Birth" value={profile.dob}        icon={CalendarDays}/>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Contact & Guardian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Email Address"    value={profile.email}          icon={Mail}    />
              <Field label="Phone Number"     value={profile.phone}          icon={Phone}   />
              <Field label="Address"          value={profile.address}        icon={MapPin}  />
              <Field label="Guardian Name"    value={profile.guardian}       icon={UserCircle} />
              <Field label="Guardian Phone"   value={profile.guardianPhone}  icon={Phone}   />

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: "Subjects",  value: "6"   },
                  { label: "Semester",  value: "4th" },
                  { label: "Section",   value: "A"   },
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
      </main>

      <footer className="border-t bg-white py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GradeSphere. All rights reserved.
      </footer>

      {/* ── Edit Profile Modal ── */}
      {editOpen && (
        <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            <FormInput label="Full Name"      name="name"          value={editForm.name}          onChange={handleEditChange} />
            <FormInput label="Roll Number"    name="rollNumber"    value={editForm.rollNumber}    onChange={handleEditChange} readOnly />
            <FormInput label="Branch"         name="branch"        value={editForm.branch}        onChange={handleEditChange} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Semester" name="semester" value={editForm.semester} onChange={handleEditChange} />
              <FormInput label="Section"  name="section"  value={editForm.section}  onChange={handleEditChange} />
            </div>
            <FormInput label="Date of Birth"  name="dob"           value={editForm.dob}           onChange={handleEditChange} />
            <FormInput label="Email"          name="email"         value={editForm.email}         onChange={handleEditChange} type="email" />
            <FormInput label="Phone"          name="phone"         value={editForm.phone}         onChange={handleEditChange} />
            <FormInput label="Address"        name="address"       value={editForm.address}       onChange={handleEditChange} />
            <FormInput label="Guardian Name"  name="guardian"      value={editForm.guardian}      onChange={handleEditChange} />
            <FormInput label="Guardian Phone" name="guardianPhone" value={editForm.guardianPhone} onChange={handleEditChange} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                name="bio" value={editForm.bio} onChange={handleEditChange} rows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave}><Save className="w-4 h-4" /> Save Changes</Button>
          </div>
        </Modal>
      )}

      {/* ── Change Password Modal ── */}
      {pwOpen && (
        <Modal title="Change Password" onClose={() => { setPwOpen(false); setPwError(""); setPwSuccess(false); }}>
          <div className="space-y-4">
            {(["current", "next", "confirm"]).map((field) => {
              const labels = { current: "Current Password", next: "New Password", confirm: "Confirm New Password" };
              return (
                <div key={field} className="space-y-1.5">
                  <label className="text-sm font-medium">{labels[field]}</label>
                  <div className="relative">
                    <input
                      type={showPw[field] ? "text" : "password"}
                      name={field} value={pwForm[field]} onChange={handlePwChange}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
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
            <Button onClick={handlePwSave}><KeyRound className="w-4 h-4" /> Update Password</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
