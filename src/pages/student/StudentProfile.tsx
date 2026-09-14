import { useEffect, useState, type ReactNode } from "react";
import {
  Mail,
  Phone,
  User,
  GraduationCap,
  Calendar,
} from "lucide-react";

import { getStudent } from "../../services/studentService";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  division: string;
  rollNo: number;
  gender: string;
  status: "Active" | "Inactive";
}

function StudentProfile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        setError("");

        const currentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!currentId) {
          setStudent(null);
          return;
        }

        const data = await getStudent(currentId);

        setStudent(data);
      } catch (error) {
        console.error(
          "Failed to load student profile:",
          error
        );

        setError(
          "Unable to load student profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <User
            size={50}
            className="mx-auto text-red-300 mb-4"
          />

          <h2 className="text-2xl font-bold text-slate-900">
            Unable to Load Profile
          </h2>

          <p className="text-slate-500 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <User
            size={50}
            className="mx-auto text-slate-300 mb-4"
          />

          <h2 className="text-2xl font-bold text-slate-900">
            Student Not Found
          </h2>

          <p className="text-slate-500 mt-2">
            Please login with a valid student account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <GraduationCap size={38} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {student.name}
            </h1>

            <p className="text-slate-500 mt-1">
              Class {student.className}
              {student.division &&
                ` - ${student.division}`}
              {" · "}Roll No {student.rollNo}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                student.status === "Active"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {student.status}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <Section title="Personal Information">
        <Info
          icon={<User size={18} />}
          label="Full Name"
          value={student.name}
        />

        <Info
          icon={<User size={18} />}
          label="Gender"
          value={student.gender || "-"}
        />

        <Info
          icon={<Mail size={18} />}
          label="Email"
          value={student.email || "-"}
        />

        <Info
          icon={<Phone size={18} />}
          label="Phone"
          value={student.phone || "-"}
        />
      </Section>

      {/* Academic Information */}
      <Section title="Academic Information">
        <Info
          icon={<GraduationCap size={18} />}
          label="Class"
          value={student.className}
        />

        <Info
          icon={<User size={18} />}
          label="Division"
          value={student.division || "-"}
        />

        <Info
          icon={<Calendar size={18} />}
          label="Roll Number"
          value={String(student.rollNo)}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-5">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-900 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

export default StudentProfile;