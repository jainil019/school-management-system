import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Save,
  Search,
  X,
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
  getSubjects,
  type Subject,
} from "../../services/subjectService";

import {
  getAttendance,
  createAttendance,
  updateAttendance,
  type Attendance,
} from "../../services/attendanceService";

type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Leave";

const today = new Date().toISOString().split("T")[0];

export default function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [records, setRecords] = useState<Attendance[]>([]);

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [search, setSearch] = useState("");

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const [savedMessage, setSavedMessage] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        studentsData,
        classesData,
        subjectsData,
        attendanceData,
      ] = await Promise.all([
        getStudents(),
        getClasses(),
        getSubjects(),
        getAttendance(),
      ]);

      setStudents(studentsData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setRecords(attendanceData);
    } catch (error) {
      console.error(
        "Failed to load attendance data:",
        error
      );

      alert(
        "Failed to load attendance data. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // ACTIVE STUDENTS
  // ==========================================

  const classStudents = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    const classData = classes.find(
      (item) =>
        String(item.id) === String(selectedClass)
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
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [
    students,
    classes,
    selectedClass,
  ]);

  // ==========================================
  // LOAD EXISTING ATTENDANCE
  // ==========================================

  useEffect(() => {
    if (
      !selectedClass ||
      !selectedSubject
    ) {
      setAttendance({});
      return;
    }

    const existing: Record<
      string,
      AttendanceStatus
    > = {};

    records
      .filter(
        (record) =>
          record.date === selectedDate &&
          String(record.classId) ===
            String(selectedClass) &&
          String(record.subjectId) ===
            String(selectedSubject)
      )
      .forEach((record) => {
        existing[String(record.studentId)] =
          record.status;
      });

    const defaultAttendance: Record<
      string,
      AttendanceStatus
    > = {};

    classStudents.forEach((student) => {
      defaultAttendance[String(student.id)] =
        existing[String(student.id)] ||
        "Present";
    });

    setAttendance(defaultAttendance);
  }, [
    selectedDate,
    selectedClass,
    selectedSubject,
    classStudents,
    records,
  ]);

  // ==========================================
  // FILTER STUDENTS
  // ==========================================

  const filteredStudents =
    classStudents.filter((student) => {
      const text = search.toLowerCase();

      return (
        student.name
          .toLowerCase()
          .includes(text) ||
        String(student.rollNo).includes(text)
      );
    });

  // ==========================================
  // STATISTICS
  // ==========================================

  const presentCount = classStudents.filter(
    (student) =>
      attendance[String(student.id)] ===
      "Present"
  ).length;

  const absentCount = classStudents.filter(
    (student) =>
      attendance[String(student.id)] ===
      "Absent"
  ).length;

  const lateCount = classStudents.filter(
    (student) =>
      attendance[String(student.id)] ===
      "Late"
  ).length;

  const leaveCount = classStudents.filter(
    (student) =>
      attendance[String(student.id)] ===
      "Leave"
  ).length;

  // ==========================================
  // STATUS CHANGE
  // ==========================================

  const updateStatus = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ==========================================
  // MARK ALL
  // ==========================================

  const markAll = (
    status: AttendanceStatus
  ) => {
    const updated: Record<
      string,
      AttendanceStatus
    > = {};

    classStudents.forEach((student) => {
      updated[String(student.id)] = status;
    });

    setAttendance(updated);
  };

  // ==========================================
  // SAVE ATTENDANCE
  // ==========================================

  const handleSave = async () => {
    if (
      !selectedClass ||
      !selectedSubject
    ) {
      alert(
        "Please select class and subject."
      );
      return;
    }

    if (classStudents.length === 0) {
      alert(
        "No active students found for this class."
      );
      return;
    }

    try {
      setSaving(true);

      const currentRecords = records.filter(
        (record) =>
          record.date === selectedDate &&
          String(record.classId) ===
            String(selectedClass) &&
          String(record.subjectId) ===
            String(selectedSubject)
      );

      const savedRecords: Attendance[] = [];

      for (const student of classStudents) {
        const studentId = String(student.id);

        const attendanceData: Attendance = {
          date: selectedDate,
          classId: String(selectedClass),
          subjectId: String(selectedSubject),
          studentId,
          status:
            attendance[studentId] ||
            "Present",
        };

        const existingRecord =
          currentRecords.find(
            (record) =>
              String(record.studentId) ===
              studentId
          );

        let savedRecord: Attendance;

        if (existingRecord?.id) {
          savedRecord =
            await updateAttendance(
              existingRecord.id,
              attendanceData
            );
        } else {
          savedRecord =
            await createAttendance(
              attendanceData
            );
        }

        savedRecords.push(savedRecord);
      }

      // Update local React state from API results
      setRecords((prev) => {
        const oldRecords = prev.filter(
          (record) =>
            !(
              record.date === selectedDate &&
              String(record.classId) ===
                String(selectedClass) &&
              String(record.subjectId) ===
                String(selectedSubject)
            )
        );

        return [
          ...oldRecords,
          ...savedRecords,
        ];
      });

      setSavedMessage(
        "Attendance saved successfully!"
      );

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save attendance:",
        error
      );

      alert(
        "Failed to save attendance. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading attendance...
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
          Attendance
        </h1>

        <p className="text-slate-500 mt-1">
          Mark and manage student attendance
        </p>
      </div>

      {/* Filters */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Date */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
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
                    item.status === "Active"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    Class {item.className}-
                    {item.division}
                  </option>
                ))}

            </select>
          </div>

          {/* Subject */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>

            <select
              value={selectedSubject}
              onChange={(e) =>
                setSelectedSubject(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select Subject
              </option>

              {subjects
                .filter(
                  (item) =>
                    item.status === "Active"
                )
                .map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ))}

            </select>
          </div>

        </div>

      </div>

      {/* Empty Selection */}

      {(!selectedClass ||
        !selectedSubject) && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarDays size={30} />
          </div>

          <h2 className="text-lg font-bold text-slate-800 mt-4">
            Select Class & Subject
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Select the date, class and subject
            to mark attendance.
          </p>

        </div>
      )}

      {/* Attendance */}

      {selectedClass &&
        selectedSubject && (
          <>
            {/* Summary */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

              <AttendanceCard
                title="Present"
                value={presentCount}
                icon={<Check size={21} />}
              />

              <AttendanceCard
                title="Absent"
                value={absentCount}
                icon={<X size={21} />}
              />

              <AttendanceCard
                title="Late"
                value={lateCount}
                icon={<Clock3 size={21} />}
              />

              <AttendanceCard
                title="Leave"
                value={leaveCount}
                icon={<FileText size={21} />}
              />

            </div>

            {/* Student List */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Toolbar */}

              <div className="p-5 border-b border-slate-200">

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Student Attendance
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {classStudents.length}{" "}
                      students
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        markAll("Present")
                      }
                      className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100"
                    >
                      Mark All Present
                    </button>

                    <button
                      onClick={() =>
                        markAll("Absent")
                      }
                      className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100"
                    >
                      Mark All Absent
                    </button>

                  </div>

                </div>

                {/* Search */}

                <div className="relative max-w-md mt-4">

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

              {/* Table */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Roll No
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Student
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Attendance
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredStudents.map(
                      (student) => {
                        const studentId =
                          String(
                            student.id
                          );

                        const status =
                          attendance[
                            studentId
                          ] || "Present";

                        return (
                          <tr
                            key={
                              student.id
                            }
                            className="hover:bg-slate-50 transition"
                          >

                            {/* Roll */}

                            <td className="px-6 py-4">

                              <span className="font-semibold text-slate-700">
                                {
                                  student.rollNo
                                }
                              </span>

                            </td>

                            {/* Student */}

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                  {student.name
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <p className="font-semibold text-slate-800">
                                    {
                                      student.name
                                    }
                                  </p>

                                  <p className="text-sm text-slate-500">
                                    {
                                      student.gender
                                    }
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* Status */}

                            <td className="px-6 py-4">

                              <div className="flex flex-wrap gap-2">

                                <StatusButton
                                  label="Present"
                                  active={
                                    status ===
                                    "Present"
                                  }
                                  type="Present"
                                  onClick={() =>
                                    updateStatus(
                                      studentId,
                                      "Present"
                                    )
                                  }
                                />

                                <StatusButton
                                  label="Absent"
                                  active={
                                    status ===
                                    "Absent"
                                  }
                                  type="Absent"
                                  onClick={() =>
                                    updateStatus(
                                      studentId,
                                      "Absent"
                                    )
                                  }
                                />

                                <StatusButton
                                  label="Late"
                                  active={
                                    status ===
                                    "Late"
                                  }
                                  type="Late"
                                  onClick={() =>
                                    updateStatus(
                                      studentId,
                                      "Late"
                                    )
                                  }
                                />

                                <StatusButton
                                  label="Leave"
                                  active={
                                    status ===
                                    "Leave"
                                  }
                                  type="Leave"
                                  onClick={() =>
                                    updateStatus(
                                      studentId,
                                      "Leave"
                                    )
                                  }
                                />

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

              {filteredStudents.length ===
                0 && (
                <div className="py-12 text-center text-slate-500">
                  No students found.
                </div>
              )}

              {/* Save */}

              <div className="p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="text-sm text-slate-500">

                  Attendance for{" "}

                  <span className="font-medium text-slate-700">
                    {selectedDate}
                  </span>

                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  <Save size={19} />

                  {saving
                    ? "Saving..."
                    : "Save Attendance"}

                </button>

              </div>

            </div>

            {/* Success Message */}

            {savedMessage && (
              <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <Check size={18} />
                {savedMessage}
              </div>
            )}
          </>
        )}

    </div>
  );
}

// ==========================================
// ATTENDANCE CARD
// ==========================================

function AttendanceCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
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

// ==========================================
// STATUS BUTTON
// ==========================================

function StatusButton({
  label,
  active,
  type,
  onClick,
}: {
  label: string;
  active: boolean;
  type: AttendanceStatus;
  onClick: () => void;
}) {
  const classes = {
    Present:
      "bg-emerald-100 text-emerald-700 border-emerald-200",

    Absent:
      "bg-red-100 text-red-700 border-red-200",

    Late:
      "bg-amber-100 text-amber-700 border-amber-200",

    Leave:
      "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition ${
        active
          ? classes[type]
          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}