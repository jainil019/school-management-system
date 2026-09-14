import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
} from "lucide-react";

import {
  getStudents,
  type Student,
} from "../../services/studentService";

import {
  getClasses,
  type ClassData,
} from "../../services/classService";

import {
  getAttendance,
  type Attendance,
} from "../../services/attendanceService";



interface StudentReport {
  student: Student;
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  percentage: number;
}

export default function AttendanceReports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [records, setRecords] = useState<Attendance[]>([]);

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState(() => {
      const date = new Date();

      return `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
    });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        studentsData,
        classesData,
        attendanceData,
      ] = await Promise.all([
        getStudents(),
        getClasses(),
        getAttendance(),
      ]);

      setStudents(studentsData);
      setClasses(classesData);
      setRecords(attendanceData);
    } catch (error) {
      console.error(
        "Failed to load attendance reports:",
        error
      );

      alert(
        "Failed to load attendance reports. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // SELECT FIRST ACTIVE CLASS
  // ==========================================

  useEffect(() => {
    if (
      !selectedClass &&
      classes.length > 0
    ) {
      const activeClass = classes.find(
        (item) =>
          item.status === "Active"
      );

      if (activeClass?.id) {
        setSelectedClass(
          String(activeClass.id)
        );
      }
    }
  }, [classes, selectedClass]);

  // ==========================================
  // CLASS STUDENTS
  // ==========================================

  const classStudents = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    const classData = classes.find(
      (item) =>
        String(item.id) ===
        String(selectedClass)
    );

    if (!classData) {
      return [];
    }

    return students
      .filter(
        (student) =>
          student.className ===
            classData.className &&
          student.division ===
            classData.division &&
          student.status === "Active"
      )
      .sort(
        (a, b) =>
          a.rollNo - b.rollNo
      );
  }, [
    students,
    classes,
    selectedClass,
  ]);

  // ==========================================
  // MONTHLY RECORDS
  // ==========================================

  const monthlyRecords = useMemo(() => {
    if (
      !selectedMonth ||
      !selectedClass
    ) {
      return [];
    }

    return records.filter(
      (record) =>
        record.date.startsWith(
          selectedMonth
        ) &&
        String(record.classId) ===
          String(selectedClass)
    );
  }, [
    records,
    selectedMonth,
    selectedClass,
  ]);

  // ==========================================
  // STUDENT REPORTS
  // ==========================================

  const reports: StudentReport[] =
    useMemo(() => {
      return classStudents.map(
        (student) => {
          const studentRecords =
            monthlyRecords.filter(
              (record) =>
                String(
                  record.studentId
                ) === String(student.id)
            );

          const present =
            studentRecords.filter(
              (record) =>
                record.status ===
                "Present"
            ).length;

          const absent =
            studentRecords.filter(
              (record) =>
                record.status ===
                "Absent"
            ).length;

          const late =
            studentRecords.filter(
              (record) =>
                record.status ===
                "Late"
            ).length;

          const leave =
            studentRecords.filter(
              (record) =>
                record.status ===
                "Leave"
            ).length;

          const total =
            present +
            absent +
            late +
            leave;

          const percentage =
            total > 0
              ? Math.round(
                  ((present + late) /
                    total) *
                    100
                )
              : 0;

          return {
            student,
            present,
            absent,
            late,
            leave,
            total,
            percentage,
          };
        }
      );
    }, [
      classStudents,
      monthlyRecords,
    ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredReports =
    reports.filter((report) => {
      const text =
        search.toLowerCase();

      return (
        report.student.name
          .toLowerCase()
          .includes(text) ||
        String(
          report.student.rollNo
        ).includes(text)
      );
    });

  // ==========================================
  // OVERALL STATISTICS
  // ==========================================

  const totalPresent =
    reports.reduce(
      (total, report) =>
        total + report.present,
      0
    );

  const totalAbsent =
    reports.reduce(
      (total, report) =>
        total + report.absent,
      0
    );

  const totalLate =
    reports.reduce(
      (total, report) =>
        total + report.late,
      0
    );

  const totalLeave =
    reports.reduce(
      (total, report) =>
        total + report.leave,
      0
    );

  const totalAttendanceDays =
    totalPresent +
    totalAbsent +
    totalLate +
    totalLeave;

  const overallPercentage =
    totalAttendanceDays > 0
      ? Math.round(
          ((totalPresent +
            totalLate) /
            totalAttendanceDays) *
            100
        )
      : 0;

  const goodAttendance =
    reports.filter(
      (report) =>
        report.percentage >= 75
    ).length;

  const poorAttendance =
    reports.filter(
      (report) =>
        report.total > 0 &&
        report.percentage < 75
    ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading attendance reports...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance Reports
        </h1>

        <p className="text-slate-500 mt-1">
          View monthly student attendance
          performance
        </p>
      </div>

      {/* Filters */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Month */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Month
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="month"
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* Class */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select Class
              </option>

              {classes
                .filter(
                  (item) =>
                    item.status ===
                    "Active"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    Class{" "}
                    {item.className}-
                    {item.division}
                  </option>
                ))}

            </select>

          </div>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        <ReportCard
          title="Overall"
          value={`${overallPercentage}%`}
          icon={
            <CalendarDays size={20} />
          }
        />

        <ReportCard
          title="Present"
          value={totalPresent}
          icon={
            <CheckCircle2 size={20} />
          }
        />

        <ReportCard
          title="Absent"
          value={totalAbsent}
          icon={
            <XCircle size={20} />
          }
        />

        <ReportCard
          title="Late"
          value={totalLate}
          icon={
            <Clock3 size={20} />
          }
        />

        <ReportCard
          title="Leave"
          value={totalLeave}
          icon={
            <FileText size={20} />
          }
        />

      </div>

      {/* Student Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Good */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={22} />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Good Attendance
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {goodAttendance}
              </p>

            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            Students with attendance
            of 75% or above.
          </p>

        </div>

        {/* Poor */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Users size={22} />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Need Attention
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {poorAttendance}
              </p>

            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            Students below 75%
            attendance.
          </p>

        </div>

      </div>

      {/* Student Table */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Toolbar */}

        <div className="p-5 border-b border-slate-200">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Student Attendance
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monthly attendance details
              </p>

            </div>

            <div className="relative w-full md:w-72">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Roll No
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Student
                </th>

                <th className="text-center px-4 py-4 text-sm font-semibold text-emerald-600">
                  Present
                </th>

                <th className="text-center px-4 py-4 text-sm font-semibold text-red-600">
                  Absent
                </th>

                <th className="text-center px-4 py-4 text-sm font-semibold text-amber-600">
                  Late
                </th>

                <th className="text-center px-4 py-4 text-sm font-semibold text-purple-600">
                  Leave
                </th>

                <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">
                  Total
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Attendance
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredReports.map(
                (report) => (

                  <tr
                    key={
                      report.student.id
                    }
                    className="hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {
                        report.student
                          .rollNo
                      }
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {report.student.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {
                              report
                                .student
                                .name
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              report
                                .student
                                .email
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-emerald-600">
                      {
                        report.present
                      }
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-red-600">
                      {
                        report.absent
                      }
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-amber-600">
                      {report.late}
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-purple-600">
                      {
                        report.leave
                      }
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-slate-700">
                      {report.total}
                    </td>

                    <td className="px-6 py-4">

                      <div className="min-w-[150px]">

                        <div className="flex items-center justify-between mb-1">

                          <span
                            className={`text-sm font-bold ${
                              report.percentage >=
                              75
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {
                              report.percentage
                            }%
                          </span>

                          <span className="text-xs text-slate-400">
                            {report.percentage >=
                            75
                              ? "Good"
                              : "Low"}
                          </span>

                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${
                              report.percentage >=
                              75
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${report.percentage}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {filteredReports.length ===
          0 && (
          <div className="py-14 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">

              <CalendarDays
                size={25}
                className="text-slate-400"
              />

            </div>

            <p className="font-medium text-slate-700 mt-3">
              No attendance data
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Attendance records for
              the selected month will
              appear here.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

// ==========================================
// REPORT CARD
// ==========================================

function ReportCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
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