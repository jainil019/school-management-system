import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/Home";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import ParentLayout from "../layouts/ParentLayout";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import AdminStudentProfile from "../pages/admin/AdminStudentProfile";
import Teachers from "../pages/admin/Teachers";
import AdminTeacherProfile from "../pages/admin/AdminTeacherProfile";
import Classes from "../pages/admin/Classes";
import Subjects from "../pages/admin/Subjects";
import Assignments from "../pages/admin/Assignments";
import Attendance from "../pages/admin/Attendance";
import AttendanceReports from "../pages/admin/AttendanceReports";
import Exams from "../pages/admin/Exams";
import Marks from "../pages/admin/Marks";
import Results from "../pages/admin/Results";
import Fees from "../pages/admin/Fees";
import Homework from "../pages/admin/Homework";
import Timetable from "../pages/admin/Timetable";
import Notices from "../pages/admin/Notices";

// Student
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentResults from "../pages/student/StudentResults";
import StudentHomework from "../pages/student/StudentHomework";
import StudentTimetable from "../pages/student/StudentTimetable";
import StudentFees from "../pages/student/StudentFees";
import StudentNotices from "../pages/student/StudentNotices";

// Teacher
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import TeacherClasses from "../pages/teacher/TeacherClasses";
import TeacherAssignments from "../pages/teacher/TeacherAssignments";
import TeacherAttendance from "../pages/teacher/TeacherAttendance";
import TeacherHomework from "../pages/teacher/TeacherHomework";
import TeacherTimetable from "../pages/teacher/TeacherTimetable";
import TeacherNotices from "../pages/teacher/TeacherNotices";

// Parent
import ParentDashboard from "../pages/parent/ParentDashboard";
import ParentStudentProfile from "../pages/parent/ParentStudentProfile";
import ParentAttendance from "../pages/parent/ParentAttendance";
import ParentResults from "../pages/parent/ParentResults";
import ParentFees from "../pages/parent/ParentFees";
import ParentHomework from "../pages/parent/ParentHomework";
import ParentTimetable from "../pages/parent/ParentTimetable";
import ParentNotices from "../pages/parent/ParentNotices";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]} />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="students/:id"
            element={<AdminStudentProfile />}
          />

          <Route
            path="teachers"
            element={<Teachers />}
          />

          <Route
            path="teachers/:id"
            element={<AdminTeacherProfile />}
          />

          <Route
            path="classes"
            element={<Classes />}
          />

          <Route
            path="subjects"
            element={<Subjects />}
          />

          <Route
            path="assignments"
            element={<Assignments />}
          />

          <Route
            path="attendance"
            element={<Attendance />}
          />

          <Route
            path="attendance-reports"
            element={<AttendanceReports />}
          />

          <Route
            path="exams"
            element={<Exams />}
          />

          <Route
            path="marks"
            element={<Marks />}
          />

          <Route
            path="results"
            element={<Results />}
          />

          <Route
            path="fees"
            element={<Fees />}
          />

          <Route
            path="homework"
            element={<Homework />}
          />

          <Route
            path="timetable"
            element={<Timetable />}
          />

          <Route
            path="notices"
            element={<Notices />}
          />
        </Route>
      </Route>

      {/* ================= STUDENT ================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["student"]} />
        }
      >
        <Route
          path="/student"
          element={<StudentLayout />}
        >
          <Route
            index
            element={<StudentDashboard />}
          />

          <Route
            path="profile"
            element={<StudentProfile />}
          />

          <Route
            path="attendance"
            element={<StudentAttendance />}
          />

          <Route
            path="results"
            element={<StudentResults />}
          />

          <Route
            path="homework"
            element={<StudentHomework />}
          />

          <Route
            path="timetable"
            element={<StudentTimetable />}
          />

          <Route
            path="fees"
            element={<StudentFees />}
          />

          <Route
            path="notices"
            element={<StudentNotices />}
          />
        </Route>
      </Route>

      {/* ================= TEACHER ================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["teacher"]} />
        }
      >
        <Route
          path="/teacher"
          element={<TeacherLayout />}
        >
          <Route
            index
            element={<TeacherDashboard />}
          />

          <Route
            path="profile"
            element={<TeacherProfile />}
          />

          <Route
            path="classes"
            element={<TeacherClasses />}
          />

          <Route
            path="assignments"
            element={<TeacherAssignments />}
          />

          <Route
            path="attendance"
            element={<TeacherAttendance />}
          />

          <Route
            path="homework"
            element={<TeacherHomework />}
          />

          <Route
            path="timetable"
            element={<TeacherTimetable />}
          />

          <Route
            path="notices"
            element={<TeacherNotices />}
          />
        </Route>
      </Route>

      {/* ================= PARENT ================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["parent"]} />
        }
      >
        <Route
          path="/parent"
          element={<ParentLayout />}
        >
          <Route
            index
            element={<ParentDashboard />}
          />

          <Route
            path="profile"
            element={<ParentStudentProfile />}
          />

          <Route
            path="attendance"
            element={<ParentAttendance />}
          />

          <Route
            path="results"
            element={<ParentResults />}
          />

          <Route
            path="fees"
            element={<ParentFees />}
          />

          <Route
            path="homework"
            element={<ParentHomework />}
          />

          <Route
            path="timetable"
            element={<ParentTimetable />}
          />

          <Route
            path="notices"
            element={<ParentNotices />}
          />
        </Route>
      </Route>

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}