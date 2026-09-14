import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Hash,
  Users,
  Loader2,
} from "lucide-react";

import { getParentStudent } from "../../services/parentPortalService";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  division: string;
  rollNo: number;
  gender: string;
  status: string;
}

export default function ParentStudentProfile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const id = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!id) {
        setError("Student ID not found.");
        return;
      }

      const data = await getParentStudent(id);

      if (!data) {
        setError("Student not found.");
        return;
      }

      setStudent(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load student profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!student) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Student Profile
        </h1>

        <p className="text-slate-500 mt-1">
          Your child's personal and academic information.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User size={38} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {student.name}
            </h2>

            <p className="text-slate-500">
              Class {student.className} - Division{" "}
              {student.division}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold">Student Information</h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info
            icon={<User />}
            label="Name"
            value={student.name}
          />

          <Info
            icon={<Mail />}
            label="Email"
            value={student.email}
          />

          <Info
            icon={<Phone />}
            label="Phone"
            value={student.phone}
          />

          <Info
            icon={<GraduationCap />}
            label="Class"
            value={`${student.className} - ${student.division}`}
          />

          <Info
            icon={<Hash />}
            label="Roll Number"
            value={student.rollNo}
          />

          <Info
            icon={<Users />}
            label="Gender"
            value={student.gender}
          />

          <Info
            icon={<User />}
            label="Status"
            value={student.status}
          />
        </div>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 flex gap-3">
      <div className="text-blue-600">{icon}</div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-medium text-slate-900 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      Loading profile...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-red-600">
      {message || "Student not found."}
    </div>
  );
}