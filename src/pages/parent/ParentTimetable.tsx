import { useEffect, useState } from "react";
import {
  Clock,
  Loader2,
} from "lucide-react";

import {
  getParentStudent,
  getParentTimetable,
} from "../../services/parentPortalService";

interface Timetable {
  id?: string;
  day: string;
  subject: string;
  className: string;
  teacher?: string;
  startTime: string;
  endTime: string;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ParentTimetable() {
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const id = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!id) return;

      const student = await getParentStudent(id);

      if (!student) return;

      const data = await getParentTimetable(
        student.className
      );

      setTimetable(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Timetable
        </h1>

        <p className="text-slate-500 mt-1">
          Weekly class schedule.
        </p>
      </div>

      {timetable.length === 0 ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-400">
          No timetable available.
        </div>
      ) : (
        <div className="space-y-5">
          {days.map((day) => {
            const items = timetable.filter(
              (item) =>
                item.day?.toLowerCase() ===
                day.toLowerCase()
            );

            if (items.length === 0) return null;

            return (
              <div
                key={day}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 bg-slate-50 border-b">
                  <h2 className="font-bold">{day}</h2>
                </div>

                <div className="divide-y">
                  {items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-5 flex flex-col md:flex-row md:justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.subject}
                        </p>

                        {item.teacher && (
                          <p className="text-sm text-slate-500 mt-1">
                            Teacher: {item.teacher}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={16} />

                        {item.startTime} - {item.endTime}
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
    <div className="min-h-[60vh] flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      Loading timetable...
    </div>
  );
}