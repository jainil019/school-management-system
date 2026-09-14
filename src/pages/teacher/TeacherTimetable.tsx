import { useEffect, useState } from "react";
import { CalendarDays, Clock, Loader2 } from "lucide-react";

import { getTeacher } from "../../services/teacherService";
import { getTimetable } from "../../services/timetableService";

interface Teacher {
  id: string;
  name: string;
  assignedClass: string;
  subject: string;
}

interface Timetable {
  id?: string;
  day: string;
  subject: string;
  teacher: string;
  className: string;
  startTime: string;
  endTime: string;
  roomNo?: string;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TeacherTimetable() {
  const [, setTeacher] = useState<Teacher | null>(null);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const teacherId = localStorage.getItem("school_current_teacher_id");

      if (!teacherId) {
        setError("Teacher ID not found.");
        return;
      }

      const [teacherData, timetableData] = await Promise.all([
        getTeacher(teacherId),
        getTimetable(),
      ]);

      setTeacher(teacherData);

      const filtered = (timetableData || []).filter(
        (item: Timetable) =>
          item.teacher === teacherData.name ||
          item.className === teacherData.assignedClass,
      );

      setTimetable(filtered);
    } catch (err: any) {
      console.error(err);

      setError(err?.response?.data?.detail || "Failed to load timetable.");
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
        <h1 className="text-2xl font-bold text-slate-900">My Timetable</h1>

        <p className="text-slate-500 mt-1">Your weekly teaching schedule.</p>
      </div>

      {timetable.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <CalendarDays size={42} className="mx-auto text-slate-300 mb-3" />

          <p className="font-semibold text-slate-700">No timetable found</p>
        </div>
      ) : (
        <div className="space-y-5">
          {days.map((day) => {
            const dayItems = timetable.filter(
              (item) => item.day?.toLowerCase() === day.toLowerCase(),
            );

            if (dayItems.length === 0) return null;

            return (
              <div
                key={day}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="font-bold text-slate-900">{day}</h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {dayItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Clock size={21} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {item.subject}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            Class {item.className}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-slate-600">
                        <span className="font-medium">{item.startTime}</span> -{" "}
                        <span className="font-medium">{item.endTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3 text-slate-500">
      <Loader2 size={24} className="animate-spin" />
      Loading timetable...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-red-600">
      {message || "Failed to load timetable."}
    </div>
  );
}
