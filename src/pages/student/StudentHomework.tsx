import { useEffect, useState } from "react";
import { BookOpen, CalendarDays } from "lucide-react";

import { getStudentProfile } from "../../services/studentPortalService";
import { getStudentHomework } from "../../services/studentPortalService";

interface Homework {
  id: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  dueDate: string;
}

export default function StudentHomework() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomework() {
      try {
        const studentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!studentId) return;

        const student = await getStudentProfile(studentId);

        const data = await getStudentHomework(
          student.className
        );

        setHomework(data);
      } catch (error) {
        console.error("Failed to load homework:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHomework();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Homework
        </h1>

        <p className="text-slate-500 mt-1">
          Homework assigned to your class.
        </p>
      </div>

      {homework.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
          No homework available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {homework.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={22} />
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600">
                  Due {item.dueDate}
                </span>
              </div>

              <h2 className="font-bold text-lg text-slate-900 mt-5">
                {item.title}
              </h2>

              <p className="text-sm text-blue-600 font-medium mt-1">
                {item.subject}
              </p>

              <p className="text-sm text-slate-500 mt-4 leading-6">
                {item.description || "No description provided."}
              </p>

              <div className="flex items-center gap-2 mt-5 text-sm text-slate-500">
                <CalendarDays size={16} />
                Due Date: {item.dueDate}
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
        Loading homework...
      </p>
    </div>
  );
}