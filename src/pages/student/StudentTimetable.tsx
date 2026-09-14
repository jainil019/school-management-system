import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
} from "lucide-react";

import {
  getStudentProfile,
  getStudentTimetable,
} from "../../services/studentPortalService";

interface Timetable {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function StudentTimetable() {
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimetable() {
      try {
        const studentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!studentId) return;

        const student = await getStudentProfile(studentId);

        const data = await getStudentTimetable(
          student.className
        );

        setTimetable(data);
      } catch (error) {
        console.error(
          "Failed to load timetable:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadTimetable();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Timetable
        </h1>

        <p className="text-slate-500 mt-1">
          Your class weekly timetable.
        </p>
      </div>

      {timetable.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
          No timetable available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {timetable.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {item.day}
                </span>

                <CalendarDays
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-5">
                {item.subject}
              </h2>

              <div className="space-y-3 mt-5">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Clock size={17} className="text-blue-600" />
                  {item.startTime} - {item.endTime}
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <User size={17} className="text-blue-600" />
                  {item.teacher}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 mt-4">
        Loading timetable...
      </p>
    </div>
  );
}