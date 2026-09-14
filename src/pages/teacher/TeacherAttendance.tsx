import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  Users,
} from "lucide-react";

import { getTeacher } from "../../services/teacherService";
import { getStudents } from "../../services/studentService";
import {
  getAttendance,
  createAttendance,
  updateAttendance,
} from "../../services/attendanceService";

type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Leave";

interface Teacher {
  id: string;
  name: string;
  assignedClass: string;
}

interface Student {
  id?: string;
  name: string;
  className: string;
  division: string;
  rollNo: number;
  status: string;
}

interface AttendanceRecord {
  id?: string;
  date: string;
  classId?: string;
  subjectId?: string;
  studentId: string;
  status: AttendanceStatus;
}

export default function TeacherAttendance() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const existing: Record<
      string,
      AttendanceStatus
    > = {};

    records
      .filter((item) => item.date === selectedDate)
      .forEach((item) => {
        existing[String(item.studentId)] = item.status;
      });

    const defaults: Record<
      string,
      AttendanceStatus
    > = {};

    students.forEach((student) => {
      if (student.id) {
        defaults[student.id] =
          existing[student.id] || "Present";
      }
    });

    setAttendance(defaults);
  }, [selectedDate, students, records]);

  const loadData = async () => {
    try {
      setLoading(true);

      const teacherId = localStorage.getItem(
        "school_current_teacher_id"
      );

      if (!teacherId) {
        setError("Teacher ID not found.");
        return;
      }

      const [teacherData, studentData, attendanceData] =
        await Promise.all([
          getTeacher(teacherId),
          getStudents(),
          getAttendance(),
        ]);

      setTeacher(teacherData);

      const myStudents = (studentData || [])
        .filter(
          (student: Student) =>
            student.className === teacherData.assignedClass &&
            student.status === "Active"
        )
        .sort((a: Student, b: Student) => a.rollNo - b.rollNo);

      setStudents(myStudents);
      setRecords(attendanceData || []);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<
      string,
      AttendanceStatus
    > = {};

    students.forEach((student) => {
      if (student.id) {
        updated[student.id] = status;
      }
    });

    setAttendance(updated);
  };

  const handleSave = async () => {
    if (students.length === 0) {
      alert("No students found.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const currentRecords = records.filter(
        (record) => record.date === selectedDate
      );

      for (const student of students) {
        if (!student.id) continue;

        const status = attendance[student.id] || "Present";

        const existing = currentRecords.find(
          (record) =>
            String(record.studentId) ===
            String(student.id)
        );

        if (existing?.id) {
          await updateAttendance(existing.id, {
            date: selectedDate,
            classId: existing.classId || "",
            subjectId: existing.subjectId || "",
            studentId: student.id,
            status,
          });
        } else {
          await createAttendance({
            date: selectedDate,
            classId: "",
            subjectId: "",
            studentId: student.id,
            status,
          });
        }
      }

      setMessage("Attendance saved successfully!");

      await loadData();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
          "Failed to save attendance."
      );
    } finally {
      setSaving(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const counts = useMemo(() => {
    return {
      present: students.filter(
        (s) => attendance[s.id || ""] === "Present"
      ).length,

      absent: students.filter(
        (s) => attendance[s.id || ""] === "Absent"
      ).length,

      late: students.filter(
        (s) => attendance[s.id || ""] === "Late"
      ).length,

      leave: students.filter(
        (s) => attendance[s.id || ""] === "Leave"
      ).length,
    };
  }, [students, attendance]);

  if (loading) {
    return <Loading />;
  }

  if (error || !teacher) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance
        </h1>

        <p className="text-slate-500 mt-1">
          Mark attendance for Class {teacher.assignedClass}.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Attendance Date
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => markAll("Present")}
              className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm"
            >
              Mark All Present
            </button>

            <button
              onClick={() => markAll("Absent")}
              className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm"
            >
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={<CheckCircle2 />}
          title="Present"
          value={counts.present}
        />

        <Stat
          icon={<XCircle />}
          title="Absent"
          value={counts.absent}
        />

        <Stat
          icon={<Clock3 />}
          title="Late"
          value={counts.late}
        />

        <Stat
          icon={<Users />}
          title="Leave"
          value={counts.leave}
        />
      </div>

      {message && (
        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Students
          </h2>
        </div>

        {students.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No active students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-4 text-sm text-slate-600">
                    Roll No
                  </th>

                  <th className="text-left px-5 py-4 text-sm text-slate-600">
                    Student
                  </th>

                  <th className="text-left px-5 py-4 text-sm text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-5 py-4">
                      {student.rollNo}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {student.name}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={
                          attendance[student.id || ""] ||
                          "Present"
                        }
                        onChange={(e) =>
                          updateStatus(
                            student.id || "",
                            e.target.value as AttendanceStatus
                          )
                        }
                        className="border border-slate-200 rounded-lg px-3 py-2"
                      >
                        <option value="Present">
                          Present
                        </option>

                        <option value="Absent">
                          Absent
                        </option>

                        <option value="Late">
                          Late
                        </option>

                        <option value="Leave">
                          Leave
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-5 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="text-blue-600">{icon}</div>

      <p className="text-sm text-slate-500 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3 text-slate-500">
      <Loader2 size={24} className="animate-spin" />
      Loading attendance...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-red-600">
      {message || "Failed to load attendance."}
    </div>
  );
}