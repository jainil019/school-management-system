import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
} from "lucide-react";

import { getStudentAttendance } from "../../services/studentPortalService";

interface Attendance {
  id?: string;
  date: string;
  classId: string;
  subjectId: string;
  studentId: string;
  status: "Present" | "Absent" | "Late" | "Leave";
}

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const studentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!studentId) return;

        const data = await getStudentAttendance(studentId);
        setAttendance(data);
      } catch (error) {
        console.error("Failed to load attendance:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  const stats = useMemo(() => {
    const present = attendance.filter(
      (item) => item.status === "Present"
    ).length;

    const late = attendance.filter(
      (item) => item.status === "Late"
    ).length;

    const absent = attendance.filter(
      (item) => item.status === "Absent"
    ).length;

    const leave = attendance.filter(
      (item) => item.status === "Leave"
    ).length;

    const attended = present + late;

    return {
      total: attendance.length,
      present,
      late,
      absent,
      leave,
      percentage:
        attendance.length > 0
          ? Math.round(
              (attended / attendance.length) * 100
            )
          : 0,
    };
  }, [attendance]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Attendance
        </h1>

        <p className="text-slate-500 mt-1">
          View your attendance records and percentage.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Attendance" value={`${stats.percentage}%`} />
        <Card title="Present" value={String(stats.present)} />
        <Card title="Late" value={String(stats.late)} />
        <Card title="Absent" value={String(stats.absent)} />
        <Card title="Leave" value={String(stats.leave)} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Attendance History
          </h2>
        </div>

        {attendance.length === 0 ? (
          <Empty />
        ) : (
          <div className="divide-y divide-slate-100">
            {attendance.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.date}
                    </p>

                    <p className="text-sm text-slate-500">
                      Attendance Record
                    </p>
                  </div>
                </div>

                <Status status={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>
    </div>
  );
}

function Status({
  status,
}: {
  status: Attendance["status"];
}) {
  const config = {
    Present: {
      icon: <CheckCircle size={16} />,
      className: "bg-green-50 text-green-700",
    },
    Absent: {
      icon: <XCircle size={16} />,
      className: "bg-red-50 text-red-700",
    },
    Late: {
      icon: <Clock size={16} />,
      className: "bg-yellow-50 text-yellow-700",
    },
    Leave: {
      icon: <CalendarDays size={16} />,
      className: "bg-blue-50 text-blue-700",
    },
  };

  const item = config[status];

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${item.className}`}
    >
      {item.icon}
      {status}
    </span>
  );
}

function Loading() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 mt-4">
        Loading attendance...
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div className="p-10 text-center text-slate-400">
      No attendance records found.
    </div>
  );
}