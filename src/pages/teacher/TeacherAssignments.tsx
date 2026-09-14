import { useEffect, useState } from "react";
import {
  ClipboardList,
  Loader2,
  CalendarDays,
  BookOpen,
} from "lucide-react";

import { getTeacher } from "../../services/teacherService";
import { getAssignments } from "../../services/assignmentService";

interface Teacher {
  id: string;
  name: string;
  subject: string;
}

interface Assignment {
  id?: string;
  classId?: string;
  subjectId?: string;
  teacherId?: string;
  weeklyPeriods?: number;
  academicYear?: string;
  status?: string;
}

export default function TeacherAssignments() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const teacherId = localStorage.getItem(
        "school_current_teacher_id"
      );

      if (!teacherId) {
        setError("Teacher ID not found.");
        return;
      }

      const [teacherData, assignmentData] =
        await Promise.all([
          getTeacher(teacherId),
          getAssignments(),
        ]);

      setTeacher(teacherData);

      const filtered = (assignmentData || []).filter(
        (item: Assignment) =>
          String(item.teacherId) === String(teacherId)
      );

      setAssignments(filtered);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Assignments
        </h1>

        <p className="text-slate-500 mt-1">
          Teaching assignments for {teacher?.name}.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <ClipboardList
            size={42}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="font-semibold text-slate-700">
            No assignments found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {assignments.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={22} />
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.status || "Active"}
                </span>
              </div>

              <h2 className="font-bold text-lg text-slate-900 mt-5">
                Teaching Assignment
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <Row
                  icon={<ClipboardList size={17} />}
                  label="Class ID"
                  value={item.classId || "-"}
                />

                <Row
                  icon={<BookOpen size={17} />}
                  label="Subject ID"
                  value={item.subjectId || "-"}
                />

                <Row
                  icon={<CalendarDays size={17} />}
                  label="Weekly Periods"
                  value={item.weeklyPeriods || 0}
                />

                <Row
                  icon={<CalendarDays size={17} />}
                  label="Academic Year"
                  value={item.academicYear || "-"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-slate-500">
        {icon}
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3 text-slate-500">
      <Loader2 size={24} className="animate-spin" />
      Loading assignments...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-10 text-center text-red-600">
      {message}
    </div>
  );
}