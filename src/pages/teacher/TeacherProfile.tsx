import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";

import { getTeacher } from "../../services/teacherService";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: number;
  assignedClass: string;
  joiningDate: string;
  status: string;
}

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      setLoading(true);
      setError("");

      const teacherId = localStorage.getItem(
        "school_current_teacher_id"
      );

      if (!teacherId) {
        setError("Teacher ID not found. Please login again.");
        return;
      }

      const data = await getTeacher(teacherId);

      if (!data) {
        setError("Teacher account not found.");
        return;
      }

      setTeacher(data);
    } catch (err: any) {
      console.error("Teacher profile error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load teacher profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <User className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Teacher Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            {error || "Please login with a valid teacher account."}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem(
                "school_current_teacher_id"
              );
              localStorage.removeItem("school_role");
              window.location.href = "/login";
            }}
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="text-gray-500 mt-1">
          View your personal and professional information.
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {teacher.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {teacher.subject} Teacher
            </p>

            <span
              className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                teacher.status === "Active"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {teacher.status}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            Personal Information
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoItem
            icon={<User />}
            label="Full Name"
            value={teacher.name}
          />

          <InfoItem
            icon={<Mail />}
            label="Email"
            value={teacher.email}
          />

          <InfoItem
            icon={<Phone />}
            label="Phone"
            value={teacher.phone}
          />

          <InfoItem
            icon={<GraduationCap />}
            label="Qualification"
            value={teacher.qualification}
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            Professional Information
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoItem
            icon={<BookOpen />}
            label="Subject"
            value={teacher.subject}
          />

          <InfoItem
            icon={<Users />}
            label="Assigned Class"
            value={teacher.assignedClass || "Not assigned"}
          />

          <InfoItem
            icon={<Briefcase />}
            label="Experience"
            value={`${teacher.experience} ${
              teacher.experience === 1 ? "Year" : "Years"
            }`}
          />

          <InfoItem
            icon={<Calendar />}
            label="Joining Date"
            value={teacher.joiningDate || "Not available"}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-white flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>

        <p className="font-medium text-gray-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}