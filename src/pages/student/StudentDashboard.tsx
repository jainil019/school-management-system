import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  Clock,
  IndianRupee,
  Megaphone,
  Trophy,
} from "lucide-react";

import {
  getStudentProfile,
  getStudentAttendance,
  getStudentResultData,
  getStudentHomework,
  getStudentTimetable,
  getStudentFees,
  getStudentNotices,
} from "../../services/studentPortalService";

interface Student {
  id: string;
  name: string;
  className: string;
  division: string;
  rollNo: number;
}

interface Mark {
  id?: string;
  examId: string;
  studentId: string;
  marks: number;
  totalMarks: number;
  grade: string;
  result: string;
  exam?: Exam | null;
}

interface Exam {
  id: string;
  name: string;
  subjectId: string;
  totalMarks: number;
}

interface Subject {
  id: string;
  name: string;
}

interface Attendance {
  id?: string;
  studentId: string;
  status: string;
}

interface Fee {
  id?: string;
  studentId: string;
  amount: number;
  paidAmount: number;
}

interface Homework {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
}

interface Timetable {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface Notice {
  id: string;
  title: string;
  description: string;
  audience: string;
  date: string;
}

function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const studentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!studentId) {
          setStudent(null);
          return;
        }

        const [
          studentData,
          attendanceData,
          resultData,
          homeworkData,
          timetableData,
          feesData,
          noticesData,
        ] = await Promise.all([
          getStudentProfile(studentId),
          getStudentAttendance(studentId),
          getStudentResultData(studentId),
          getStudentHomework(""),
          getStudentTimetable(""),
          getStudentFees(studentId),
          getStudentNotices(),
        ]);

        setStudent(studentData);
        setAttendance(attendanceData);
        setMarks(resultData);

        /*
         * Results already contain exam information.
         * Extract exams and subjects from the returned result data.
         */
        const resultExams: Exam[] = resultData
          .map((item: Mark & { exam?: Exam | null }) => item.exam)
          .filter(Boolean);

        setExams(resultExams);

        /*
         * Subjects are not directly returned by the result endpoint.
         * They will be loaded from the subjects API below.
         */
        const subjectsResponse = await fetch(
          "http://127.0.0.1:8000/api/subjects/"
        );

        if (subjectsResponse.ok) {
          const subjectsData = await subjectsResponse.json();
          setSubjects(subjectsData);
        }

        /*
         * Load all homework/timetable first, then filter
         * according to the student's class.
         */
        const studentClass = studentData?.className;

        if (studentClass) {
          const [
            classHomework,
            classTimetable,
          ] = await Promise.all([
            getStudentHomework(studentClass),
            getStudentTimetable(studentClass),
          ]);

          setHomework(classHomework);
          setTimetable(classTimetable);
        } else {
          setHomework(homeworkData);
          setTimetable(timetableData);
        }

        setFees(feesData);
        setNotices(noticesData);
      } catch (error) {
        console.error(
          "Failed to load student dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const attendanceStats = useMemo(() => {
    if (!student) {
      return {
        total: 0,
        present: 0,
        percentage: 0,
      };
    }

    const records = attendance.filter(
      (item) =>
        String(item.studentId) === String(student.id)
    );

    const present = records.filter(
      (item) =>
        item.status === "Present" ||
        item.status === "Late"
    ).length;

    return {
      total: records.length,
      present,
      percentage:
        records.length > 0
          ? Math.round(
              (present / records.length) * 100
            )
          : 0,
    };
  }, [attendance, student]);

  const averageMarks = useMemo(() => {
    if (!marks.length) return 0;

    const percentages = marks.map((mark) => {
      const exam =
        mark.exam ||
        exams.find(
          (item) =>
            String(item.id) ===
            String(mark.examId)
        );

      if (!exam || !exam.totalMarks) return 0;

      return (
        (mark.marks / exam.totalMarks) *
        100
      );
    });

    return Math.round(
      percentages.reduce(
        (total, value) => total + value,
        0
      ) / percentages.length
    );
  }, [marks, exams]);

  const pendingFees = useMemo(() => {
    if (!student) return 0;

    return fees
      .filter(
        (fee) =>
          String(fee.studentId) ===
          String(student.id)
      )
      .reduce(
        (sum, fee) =>
          sum +
          Math.max(
            0,
            fee.amount - fee.paidAmount
          ),
        0
      );
  }, [fees, student]);

  const studentHomework = useMemo(() => {
    return homework.slice(0, 4);
  }, [homework]);

  const studentTimetable = useMemo(() => {
    return timetable.slice(0, 5);
  }, [timetable]);

  const studentNotices = useMemo(() => {
    return notices.slice(0, 3);
  }, [notices]);

  const recentResults = useMemo(() => {
    return marks.slice(0, 5);
  }, [marks]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />

        <p className="text-slate-500 mt-4">
          Loading student dashboard...
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          No Student Found
        </h2>

        <p className="text-slate-500 mt-2">
          Please log in as a student first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white">
        <p className="text-blue-100">
          Welcome back 👋
        </p>

        <h1 className="text-3xl font-bold mt-1">
          {student.name}
        </h1>

        <p className="text-blue-100 mt-2">
          Class {student.className}
          {student.division &&
            ` - ${student.division}`}{" "}
          · Roll No {student.rollNo}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<CheckCircle size={22} />}
          title="Attendance"
          value={`${attendanceStats.percentage}%`}
        />

        <StatCard
          icon={<Trophy size={22} />}
          title="Average Marks"
          value={`${averageMarks}%`}
        />

        <StatCard
          icon={<IndianRupee size={22} />}
          title="Fees Due"
          value={`₹${pendingFees.toLocaleString(
            "en-IN"
          )}`}
        />

        <StatCard
          icon={<BookOpen size={22} />}
          title="Homework"
          value={String(
            homework.length
          )}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework */}
        <Section
          title="Upcoming Homework"
          icon={<BookOpen size={20} />}
        >
          {studentHomework.length ? (
            studentHomework.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 py-4 border-b last:border-0"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.title}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {item.subject}
                  </p>
                </div>

                <span className="text-sm text-red-500 whitespace-nowrap">
                  Due: {item.dueDate || "-"}
                </span>
              </div>
            ))
          ) : (
            <Empty text="No homework available" />
          )}
        </Section>

        {/* Timetable */}
        <Section
          title="Class Timetable"
          icon={<CalendarDays size={20} />}
        >
          {studentTimetable.length ? (
            studentTimetable.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 py-4 border-b last:border-0"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.subject}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {item.day} · {item.teacher}
                  </p>
                </div>

                <span className="text-sm text-blue-600 whitespace-nowrap">
                  {item.startTime} -{" "}
                  {item.endTime}
                </span>
              </div>
            ))
          ) : (
            <Empty text="No timetable available" />
          )}
        </Section>

        {/* Results */}
        <Section
          title="Recent Results"
          icon={<Trophy size={20} />}
        >
          {recentResults.length ? (
            recentResults.map((mark) => {
              const exam =
                mark.exam ||
                exams.find(
                  (item) =>
                    String(item.id) ===
                    String(mark.examId)
                );

              const subject =
                subjects.find(
                  (item) =>
                    String(item.id) ===
                    String(
                      exam?.subjectId
                    )
                );

              return (
                <div
                  key={mark.id || mark.examId}
                  className="flex justify-between py-4 border-b last:border-0"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {subject?.name ||
                        "Subject"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {exam?.name ||
                        "Exam"}
                    </p>
                  </div>

                  <p className="font-bold text-blue-600">
                    {mark.marks}/
                    {mark.totalMarks ||
                      exam?.totalMarks ||
                      0}
                  </p>
                </div>
              );
            })
          ) : (
            <Empty text="No results available" />
          )}
        </Section>

        {/* Notices */}
        <Section
          title="Latest Notices"
          icon={<Megaphone size={20} />}
        >
          {studentNotices.length ? (
            studentNotices.map(
              (notice) => (
                <div
                  key={notice.id}
                  className="py-4 border-b last:border-0"
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold text-slate-900">
                      {notice.title}
                    </p>

                    <span className="text-xs text-slate-400">
                      {notice.date}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {notice.description}
                  </p>
                </div>
              )
            )
          ) : (
            <Empty text="No notices available" />
          )}
        </Section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <p className="text-sm text-slate-500 mt-4">
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-2 text-blue-600">
        {icon}

        <h2 className="font-bold text-slate-900">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-8 text-center text-sm text-slate-400">
      <Clock
        size={28}
        className="mx-auto mb-2"
      />

      {text}
    </div>
  );
}

export default StudentDashboard;