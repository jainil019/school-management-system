import { useEffect, useState } from "react";
import {
  User,
  CalendarCheck,
  GraduationCap,
  IndianRupee,
  BookOpen,
  Clock,
  Megaphone,
  Loader2,
} from "lucide-react";

import {
  getParentStudent,
  getParentAttendance,
  getParentResults,
  getParentFees,
  getParentHomework,
  getParentTimetable,
  getParentNotices,
} from "../../services/parentPortalService";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  division: string;
  rollNo: number;
  gender: string;
  status: string;
}

interface Attendance {
  studentId: string;
  status: string;
}

interface Result {
  marks: number;
  totalMarks?: number;
  grade?: string;
  result?: string;
  exam?: {
    name?: string;
  };
}

interface Fee {
  amount: number;
  paidAmount?: number;
  status?: string;
}

interface Homework {
  id?: string;
  title: string;
  subject?: string;
  dueDate?: string;
}

interface Timetable {
  id?: string;
  day?: string;
  subject?: string;
  startTime?: string;
  endTime?: string;
}

interface Notice {
  id?: string;
  title: string;
  description?: string;
  date?: string;
}

export default function ParentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
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
      const studentId = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!studentId) {
        setError("Student information not found. Please login again.");
        return;
      }

      const studentData = await getParentStudent(studentId);

      if (!studentData) {
        setError("Student account not found.");
        return;
      }

      setStudent(studentData);

      const [
        attendanceData,
        resultData,
        feeData,
        homeworkData,
        timetableData,
        noticeData,
      ] = await Promise.all([
        getParentAttendance(studentId),
        getParentResults(studentId),
        getParentFees(studentId),
        getParentHomework(studentData.className),
        getParentTimetable(studentData.className),
        getParentNotices(),
      ]);

      setAttendance(attendanceData || []);
      setResults(resultData || []);
      setFees(feeData || []);
      setHomework(homeworkData || []);
      setTimetable(timetableData || []);
      setNotices(noticeData || []);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load parent dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error || !student) {
    return <ErrorState message={error} />;
  }

  const present = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round((present / attendance.length) * 100)
      : 0;

  const averageMarks =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, item) => sum + Number(item.marks || 0),
            0
          ) / results.length
        )
      : 0;

  const totalFees = fees.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const paidFees = fees.reduce(
    (sum, item) => sum + Number(item.paidAmount || 0),
    0
  );

  const pendingFees = Math.max(totalFees - paidFees, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Parent Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor your child's academic progress and activities.
        </p>
      </div>

      {/* Student */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User size={30} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {student.name}
            </h2>

            <p className="text-slate-500">
              Class {student.className} - Division{" "}
              {student.division}
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Roll No: {student.rollNo}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat
          icon={<CalendarCheck />}
          title="Attendance"
          value={`${attendancePercentage}%`}
        />

        <Stat
          icon={<GraduationCap />}
          title="Average Marks"
          value={`${averageMarks}%`}
        />

        <Stat
          icon={<IndianRupee />}
          title="Pending Fees"
          value={`₹${pendingFees}`}
        />

        <Stat
          icon={<BookOpen />}
          title="Homework"
          value={homework.length}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="Recent Homework"
          icon={<BookOpen size={20} />}
        >
          {homework.length === 0 ? (
            <Empty text="No homework available." />
          ) : (
            homework.slice(0, 5).map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-xl bg-slate-50"
              >
                <p className="font-semibold text-slate-900">
                  {item.title}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {item.subject || "Subject not specified"}
                </p>

                {item.dueDate && (
                  <p className="text-xs text-slate-400 mt-2">
                    Due: {item.dueDate}
                  </p>
                )}
              </div>
            ))
          )}
        </Section>

        <Section
          title="Today's Timetable"
          icon={<Clock size={20} />}
        >
          {timetable.length === 0 ? (
            <Empty text="No timetable available." />
          ) : (
            timetable.slice(0, 5).map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-xl bg-slate-50 flex justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.subject}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.day}
                  </p>
                </div>

                <p className="text-sm font-medium text-slate-600">
                  {item.startTime} - {item.endTime}
                </p>
              </div>
            ))
          )}
        </Section>
      </div>

      {/* Notices */}
      <Section
        title="Latest Notices"
        icon={<Megaphone size={20} />}
      >
        {notices.length === 0 ? (
          <Empty text="No notices available." />
        ) : (
          notices.slice(0, 5).map((notice, index) => (
            <div
              key={notice.id || index}
              className="p-4 rounded-xl bg-slate-50"
            >
              <p className="font-semibold text-slate-900">
                {notice.title}
              </p>

              {notice.description && (
                <p className="text-sm text-slate-500 mt-1">
                  {notice.description}
                </p>
              )}

              {notice.date && (
                <p className="text-xs text-slate-400 mt-2">
                  {notice.date}
                </p>
              )}
            </div>
          ))
        )}
      </Section>
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
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="text-blue-600">{icon}</div>

      <p className="text-sm text-slate-500 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>

        <h2 className="font-bold text-slate-900">
          {title}
        </h2>
      </div>

      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="text-sm text-slate-400 py-4">
      {text}
    </p>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center gap-3 text-slate-500">
      <Loader2 className="animate-spin" size={24} />
      Loading parent dashboard...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Parent Portal Error
        </h2>

        <p className="text-slate-500 mt-2">
          {message || "Unable to load student information."}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem(
              "school_parent_student_id"
            );
            localStorage.removeItem("school_role");
            window.location.href = "/login";
          }}
          className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
        >
          Login Again
        </button>
      </div>
    </div>
  );
}