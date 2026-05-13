import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherClasses from "./pages/TeacherClasses";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherSchedule from "./pages/TeacherSchedule";
import StudentProfile from "./pages/StudentProfile";
import StudentSubjects from "./pages/StudentSubjects";
import StudentMaterials from "./pages/StudentMaterials";
import StudentAttendance from "./pages/StudentAttendance";
import StudentAlerts from "./pages/StudentAlerts";
import StudentAssignments from "./pages/StudentAssignments";
import StudentQuizzes from "./pages/StudentQuizzes";
import StudentChat from "./pages/StudentChat";
import TeacherChat from "./pages/TeacherChat";

function ProtectedRoute({ role, children }) {
  const storedRole = localStorage.getItem("gs_role");
  if (storedRole !== role) return <Navigate to={`/login?role=${role}`} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute role="teacher">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/classes"
          element={
            <ProtectedRoute role="teacher">
              <TeacherClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute role="teacher">
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/schedule"
          element={
            <ProtectedRoute role="teacher">
              <TeacherSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/subjects"
          element={
            <ProtectedRoute role="student">
              <StudentSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/materials"
          element={
            <ProtectedRoute role="student">
              <StudentMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute role="student">
              <StudentAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/quizzes"
          element={
            <ProtectedRoute role="student">
              <StudentQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute role="student">
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/alerts"
          element={
            <ProtectedRoute role="student">
              <StudentAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/chat"
          element={
            <ProtectedRoute role="student">
              <StudentChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/chat"
          element={
            <ProtectedRoute role="teacher">
              <TeacherChat />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
