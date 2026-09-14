import { useEffect, useState } from "react";
import { Users, Loader2, GraduationCap } from "lucide-react";

import { getTeacher } from "../../services/teacherService";
import { getClasses } from "../../services/classService";
import { getStudents } from "../../services/studentService";

interface Teacher {
  id: string;
  name: string;
  assignedClass: string;
}

interface SchoolClass {
  id?: string;
  className: string;
  division: string;
  classTeacher: string;
  roomNo: string;
  students: number;
  academicYear: string;
  status: string;
}

interface Student {
  id?: string;
  name: string;
  className: string;
  division: string;
  rollNo: number;
  status: string;
}

export default function TeacherClasses() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const teacherId = localStorage.getItem(
        "school_current_teacher_id"
      );

      if (!teacherId) {
        setError("Teacher ID not found. Please login again.");
        return;
      }

      const [teacherData, classData, studentData] =
        await Promise.all([
          getTeacher(teacherId),
          getClasses(),
          getStudents(),
        ]);

      setTeacher(teacherData);
      setClasses(classData || []);
      setStudents(studentData || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to load classes."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !teacher) {
    return <ErrorState message={error} />;
  }

  const myClasses = classes.filter(
    (item) =>
      item.className === teacher.assignedClass ||
      item.classTeacher === teacher.name
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Classes
        </h1>

        <p className="text-slate-500 mt-1">
          Classes assigned to you.
        </p>
      </div>

      {myClasses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <GraduationCap className="mx-auto text-slate-300 mb-3" size={42} />

          <h2 className="font-semibold text-slate-700">
            No classes assigned
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            No class is currently assigned to you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {myClasses.map((item) => {
            const count = students.filter(
              (student) =>
                student.className === item.className &&
                student.division === item.division &&
                student.status === "Active"
            ).length;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GraduationCap size={25} />
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-5">
                  Class {item.className}
                </h2>

                <p className="text-slate-500 mt-1">
                  Division {item.division}
                </p>

                <div className="mt-5 space-y-3 text-sm">
                  <Info
                    label="Class Teacher"
                    value={item.classTeacher}
                  />

                  <Info
                    label="Room"
                    value={item.roomNo}
                  />

                  <Info
                    label="Academic Year"
                    value={item.academicYear}
                  />

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Users size={16} />
                      Active Students
                    </span>

                    <span className="font-bold text-slate-900">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex gap-3 items-center text-slate-500">
        <Loader2 className="animate-spin" size={24} />
        Loading classes...
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
      <p className="font-semibold text-red-600">
        {message || "Failed to load classes."}
      </p>
    </div>
  );
}