import { useState } from "react";
import {
  Eye,
  EyeOff,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getStudents } from "../../services/studentService";
import { getTeachers } from "../../services/teacherService";

type Role = "admin" | "student" | "teacher" | "parent";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      /* ================= ADMIN ================= */

      if (role === "admin") {
        if (
          email.toLowerCase() === "admin@school.com" &&
          password === "admin123"
        ) {
          localStorage.setItem(
            "school_role",
            "admin"
          );

          navigate("/admin");
          return;
        }

        setError(
          "Invalid admin email or password."
        );

        return;
      }

      /* ================= STUDENT ================= */

      if (role === "student") {
        const students: Student[] =
          await getStudents();

        const student = students.find(
          (item) =>
            item.email.toLowerCase() ===
            email.toLowerCase()
        );

        if (!student) {
          setError(
            "Student email not found."
          );

          return;
        }

        if (password !== "student123") {
          setError(
            "Invalid student password."
          );

          return;
        }

        localStorage.setItem(
          "school_role",
          "student"
        );

        localStorage.setItem(
          "school_current_student_id",
          String(student.id)
        );

        navigate("/student");

        return;
      }

      /* ================= TEACHER ================= */

      if (role === "teacher") {
        const teachers: Teacher[] =
          await getTeachers();

        const teacher = teachers.find(
          (item) =>
            item.email.toLowerCase() ===
            email.toLowerCase()
        );

        if (!teacher) {
          setError(
            "Teacher email not found."
          );

          return;
        }

        if (password !== "teacher123") {
          setError(
            "Invalid teacher password."
          );

          return;
        }

        localStorage.setItem(
          "school_role",
          "teacher"
        );

        localStorage.setItem(
          "school_current_teacher_id",
          String(teacher.id)
        );

        navigate("/teacher");

        return;
      }

      /* ================= PARENT ================= */

      if (role === "parent") {
        const students: Student[] =
          await getStudents();

        const student = students.find(
          (item) =>
            item.email.toLowerCase() ===
            email.toLowerCase()
        );

        if (!student) {
          setError(
            "No student found with this email."
          );

          return;
        }

        if (password !== "parent123") {
          setError(
            "Invalid parent password."
          );

          return;
        }

        localStorage.setItem(
          "school_role",
          "parent"
        );

        localStorage.setItem(
          "school_parent_student_id",
          String(student.id)
        );

        navigate("/parent");

        return;
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const roleButton = (
    value: Role,
    label: string
  ) => (
    <button
      type="button"
      onClick={() => {
        setRole(value);
        setError("");
      }}
      className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        role === value
          ? "bg-blue-600 text-white shadow"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <GraduationCap size={34} />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            School Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Login to your portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">

          {/* Roles */}
          <div className="grid grid-cols-4 gap-2">
            {roleButton(
              "admin",
              "Admin"
            )}

            {roleButton(
              "student",
              "Student"
            )}

            {roleButton(
              "teacher",
              "Teacher"
            )}

            {roleButton(
              "parent",
              "Parent"
            )}
          </div>

          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder={
                  role === "admin"
                    ? "admin@school.com"
                    : "Enter registered email"
                }
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn size={19} />

              {loading
                ? "Logging in..."
                : `Login as ${
                    role.charAt(0).toUpperCase() +
                    role.slice(1)
                  }`}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-600">
              Demo Credentials
            </p>

            {role === "admin" && (
              <div className="mt-2 text-xs text-slate-500">
                <p>
                  Email: admin@school.com
                </p>

                <p>
                  Password: admin123
                </p>
              </div>
            )}

            {role === "student" && (
              <div className="mt-2 text-xs text-slate-500">
                <p>
                  Email: Use a student's registered email
                </p>

                <p>
                  Password: student123
                </p>
              </div>
            )}

            {role === "teacher" && (
              <div className="mt-2 text-xs text-slate-500">
                <p>
                  Email: Use a teacher's registered email
                </p>

                <p>
                  Password: teacher123
                </p>
              </div>
            )}

            {role === "parent" && (
              <div className="mt-2 text-xs text-slate-500">
                <p>
                  Email: Use your child's registered email
                </p>

                <p>
                  Password: parent123
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 School Management System
        </p>
      </div>
    </div>
  );
}