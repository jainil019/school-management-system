import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Loader2,
} from "lucide-react";

import {
  getParentStudent,
  getParentHomework,
} from "../../services/parentPortalService";

interface Homework {
  id?: string;
  title: string;
  description?: string;
  subject?: string;
  className?: string;
  dueDate?: string;
  status?: string;
}

export default function ParentHomework() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const id = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!id) return;

      const student = await getParentStudent(id);

      if (!student) return;

      const data = await getParentHomework(
        student.className
      );

      setHomework(data || []);
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
          Homework
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor your child's homework.
        </p>
      </div>

      {homework.length === 0 ? (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <BookOpen
            size={42}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="text-slate-500">
            No homework available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {homework.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen />
              </div>

              <h2 className="font-bold text-lg mt-5">
                {item.title}
              </h2>

              {item.description && (
                <p className="text-sm text-slate-500 mt-2">
                  {item.description}
                </p>
              )}

              <p className="text-sm text-slate-500 mt-4">
                Subject:{" "}
                <span className="font-medium text-slate-800">
                  {item.subject || "-"}
                </span>
              </p>

              {item.dueDate && (
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                  <CalendarDays size={16} />
                  Due: {item.dueDate}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      Loading homework...
    </div>
  );
}