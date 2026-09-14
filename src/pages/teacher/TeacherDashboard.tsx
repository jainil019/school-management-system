import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Clock,
  Megaphone,
  Loader2,
} from "lucide-react";

import { getTeacher } from "../../services/teacherService";
import { getClasses } from "../../services/classService";
import { getAssignments } from "../../services/assignmentService";
import { getHomework } from "../../services/homeworkService";
import { getTimetable } from "../../services/timetableService";
import { getNotices } from "../../services/noticeService";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: number;
  assignedClass: string;
  joiningDate: string;
  status: string;
}

interface SchoolClass {
  id?: string;
  className: string;
  division?: string;
  classTeacher?: string;
}

interface Assignment {
  id?: string;
  title?: string;
  name?: string;
  teacherId?: string;
  dueDate?: string;
}

interface Homework {
  id?: string;
  title?: string;
  subject?: string;
  className?: string;
  dueDate?: string;
}

interface Timetable {
  id?: string;
  day?: string;
  subject?: string;
  teacher?: string;
  className?: string;
  startTime?: string;
  endTime?: string;
}

interface Notice {
  id?: string;
  title: string;
  description?: string;
  audience: string;
  date?: string;
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const teacherId = localStorage.getItem("school_current_teacher_id");

      console.log("Teacher ID:", teacherId);

      if (!teacherId) {
        setError("Teacher ID not found. Please login again.");
        return;
      }

      // Get teacher from MongoDB
      const teacherData = await getTeacher(teacherId);

      if (!teacherData) {
        setError("Teacher account was not found.");
        return;
      }

      setTeacher(teacherData);

      // Load dashboard data
      const [
        classesData,
        assignmentsData,
        homeworkData,
        timetableData,
        noticesData,
      ] = await Promise.all([
        getClasses(),
        getAssignments(),
        getHomework(),
        getTimetable(),
        getNotices(),
      ]);

      setClasses(classesData || []);

      setAssignments(
        (assignmentsData || []).filter(
          (item: Assignment) =>
            String(item.teacherId) === String(teacherId)
        )
      );

      setHomework(
        (homeworkData || []).filter(
          (item: Homework) =>
            item.className === teacherData.assignedClass
        )
      );

      setTimetable(
        (timetableData || []).filter(
          (item: Timetable) =>
            item.teacher === teacherData.name ||
            item.className === teacherData.assignedClass
        )
      );

      setNotices(
        (noticesData || []).filter(
          (item: Notice) =>
            item.audience === "All" ||
            item.audience === "Teachers"
        )
      );
    } catch (err: any) {
      console.error("Teacher dashboard error:", err);

      if (err?.response?.status === 404) {
        setError("Teacher account was not found. Please login again.");
      } else {
        setError(
          err?.response?.data?.detail ||
            "Failed to load teacher dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading teacher dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Teacher Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            {error || "Please login with a valid teacher account."}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("school_current_teacher_id");
              localStorage.removeItem("school_role");
              window.location.href = "/login";
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  const assignedClasses = classes.filter(
    (item) =>
      item.className === teacher.assignedClass ||
      item.classTeacher === teacher.name
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {teacher.name} 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Here's what's happening in your teaching dashboard.
        </p>
      </div>

      {/* Teacher Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {teacher.name}
            </h2>

            <p className="text-gray-500">
              {teacher.subject} Teacher
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Assigned Class:{" "}
            <span className="font-semibold text-gray-900">
              {teacher.assignedClass || "Not assigned"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="My Classes"
          value={assignedClasses.length}
          icon={<Users className="w-6 h-6" />}
        />

        <StatCard
          title="Assignments"
          value={assignments.length}
          icon={<ClipboardList className="w-6 h-6" />}
        />

        <StatCard
          title="Homework"
          value={homework.length}
          icon={<BookOpen className="w-6 h-6" />}
        />

        <StatCard
          title="Timetable"
          value={timetable.length}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">
              My Assignments
            </h2>
          </div>

          <div className="p-5">
            {assignments.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No assignments found.
              </p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-4 rounded-xl bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">
                      {item.title || item.name || "Assignment"}
                    </p>

                    {item.dueDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {item.dueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-gray-900">
              Recent Homework
            </h2>
          </div>

          <div className="p-5">
            {homework.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No homework found.
              </p>
            ) : (
              <div className="space-y-3">
                {homework.slice(0, 5).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-4 rounded-xl bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">
                      {item.title || "Homework"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.subject || teacher.subject}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-orange-500" />

          <h2 className="font-bold text-gray-900">
            Notices
          </h2>
        </div>

        <div className="p-5">
          {notices.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No notices available.
            </p>
          ) : (
            <div className="space-y-3">
              {notices.slice(0, 5).map((notice, index) => (
                <div
                  key={notice.id || index}
                  className="p-4 rounded-xl bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900">
                    {notice.title}
                  </h3>

                  {notice.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {notice.description}
                    </p>
                  )}

                  {notice.date && (
                    <p className="text-xs text-gray-400 mt-2">
                      {notice.date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}