import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface Homework {
  id: number;
  title: string;
  description: string;
  className: string;
  subject: string;
  dueDate: string;
}

function TeacherHomework() {
  const [items, setItems] = useState<Homework[]>([]);

  useEffect(() => {
    const teachers = JSON.parse(
      localStorage.getItem("school_teachers") || "[]"
    );

    const id = Number(
      localStorage.getItem("school_current_teacher_id")
    );

    const teacher = teachers.find((t: any) => t.id === id);

    const homework = JSON.parse(
      localStorage.getItem("school_homework") || "[]"
    );

    if (teacher) {
      setItems(
        homework.filter(
          (h: Homework) =>
            h.subject === teacher.subject &&
            h.className === teacher.assignedClass
        )
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      <Header />

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
          No homework found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <BookOpen className="text-blue-600 mb-3" />

              <h2 className="font-bold text-lg">
                {item.title}
              </h2>

              <p className="text-slate-600 text-sm mt-2">
                {item.description}
              </p>

              <p className="text-sm text-slate-500 mt-4">
                Due: {item.dueDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Homework
      </h1>
      <p className="text-slate-500 mt-1">
        Homework for your classes
      </p>
    </div>
  );
}

export default TeacherHomework;