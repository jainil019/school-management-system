import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Check,
  Search,
  Save,
  XCircle,
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
  getExams,
  type Exam,
} from "../../services/examService";

import {
  getMarks,
  createMark,
  updateMark,
  type Mark,
} from "../../services/marksService";

function getGrade(marks: number, totalMarks: number) {
  if (totalMarks <= 0) return "-";

  const percentage = (marks / totalMarks) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";

  return "F";
}

interface MarkRow {
  studentId: string;
  marks: string;
}

export default function Marks() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [records, setRecords] = useState<Mark[]>([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [search, setSearch] = useState("");

  const [marks, setMarks] = useState<MarkRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [savedMessage, setSavedMessage] = useState("");

  /* =========================
     Load Data
  ========================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          studentsData,
          classesData,
          subjectsData,
          examsData,
          marksData,
        ] = await Promise.all([
          getStudents(),
          getClasses(),
          getSubjects(),
          getExams(),
          getMarks(),
        ]);

        setStudents(studentsData);
        setClasses(classesData);
        setSubjects(subjectsData);
        setExams(examsData);
        setRecords(marksData);
      } catch (error) {
        console.error("Failed to load marks data:", error);
        alert("Failed to load marks data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================
     Selected Exam
  ========================= */

  const exam = useMemo(() => {
    return exams.find(
      (item) => String(item.id) === selectedExam
    );
  }, [exams, selectedExam]);

  /* =========================
     Selected Class
  ========================= */

  const selectedClass = useMemo(() => {
    if (!exam) return null;

    return classes.find(
      (item) =>
        String(item.id) === String(exam.classId)
    );
  }, [exam, classes]);

  /* =========================
     Selected Subject
  ========================= */

  const selectedSubject = useMemo(() => {
    if (!exam) return null;

    return subjects.find(
      (item) =>
        String(item.id) === String(exam.subjectId)
    );
  }, [exam, subjects]);

  /* =========================
     Students For Exam
  ========================= */

  const examStudents = useMemo(() => {
    if (!selectedClass) return [];

    return students
      .filter(
        (student) =>
          student.className === selectedClass.className &&
          student.division === selectedClass.division &&
          student.status === "Active"
      )
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [students, selectedClass]);

  /* =========================
     Load Existing Marks
  ========================= */

  useEffect(() => {
    if (!exam) {
      setMarks([]);
      return;
    }

    const existingMarks: MarkRow[] =
      examStudents.map((student) => {
        const existing = records.find(
          (record) =>
            String(record.examId) === String(exam.id) &&
            String(record.studentId) === String(student.id)
        );

        return {
          studentId: String(student.id),
          marks:
            existing !== undefined
              ? String(existing.marks)
              : "",
        };
      });

    setMarks(existingMarks);
  }, [exam, examStudents, records]);

  /* =========================
     Search
  ========================= */

  const filteredStudents = examStudents.filter(
    (student) => {
      const text = search.toLowerCase();

      return (
        student.name.toLowerCase().includes(text) ||
        String(student.rollNo).includes(text)
      );
    }
  );

  /* =========================
     Update Mark
  ========================= */

  const updateMarks = (
    studentId: string,
    value: string
  ) => {
    if (!exam) return;

    if (value === "") {
      setMarks((prev) =>
        prev.map((item) =>
          item.studentId === studentId
            ? {
                ...item,
                marks: "",
              }
            : item
        )
      );

      return;
    }

    const numericValue = Number(value);

    if (
      Number.isNaN(numericValue) ||
      numericValue < 0 ||
      numericValue > exam.totalMarks
    ) {
      return;
    }

    setMarks((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? {
              ...item,
              marks: value,
            }
          : item
      )
    );
  };

  /* =========================
     Save Marks
  ========================= */

  const handleSave = async () => {
    if (!exam) {
      alert("Please select an exam.");
      return;
    }

    if (marks.length === 0) {
      alert("No students found for this exam.");
      return;
    }

    try {
      setSaving(true);

      const enteredRows = marks.filter(
        (item) => item.marks !== ""
      );

      for (const row of enteredRows) {
        const student = examStudents.find(
          (item) =>
            String(item.id) === String(row.studentId)
        );

        if (!student) continue;

        const numericMarks = Number(row.marks);

        if (
          Number.isNaN(numericMarks) ||
          numericMarks < 0 ||
          numericMarks > exam.totalMarks
        ) {
          continue;
        }

        const percentage =
          (numericMarks / exam.totalMarks) * 100;

        const grade = getGrade(
          numericMarks,
          exam.totalMarks
        );

        const result =
          numericMarks >= exam.passingMarks
            ? "Pass"
            : "Fail";

        const existing = records.find(
          (record) =>
            String(record.examId) === String(exam.id) &&
            String(record.studentId) === String(student.id)
        );

        const markData = {
          examId: String(exam.id),
          studentId: String(student.id),
          marks: numericMarks,
          totalMarks: exam.totalMarks,
          grade,
          result,
        };

        if (existing?.id) {
          const updated = await updateMark(
            existing.id,
            markData
          );

          setRecords((prev) =>
            prev.map((record) =>
              record.id === existing.id
                ? updated
                : record
            )
          );
        } else {
          const created = await createMark(
            markData
          );

          setRecords((prev) => [
            ...prev,
            created,
          ]);
        }

        // Prevent unused calculation warning.
        void percentage;
      }

      setSavedMessage(
        "Marks saved successfully!"
      );

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to save marks:", error);
      alert("Failed to save marks.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     Statistics
  ========================= */

  const enteredMarks = marks.filter(
    (item) => item.marks !== ""
  );

  const totalEntered = enteredMarks.length;

  const totalStudents = examStudents.length;

  const averageMarks =
    totalEntered > 0 && exam
      ? Math.round(
          enteredMarks.reduce(
            (total, item) =>
              total + Number(item.marks),
            0
          ) / totalEntered
        )
      : 0;

  const passedStudents = enteredMarks.filter(
    (item) =>
      exam &&
      Number(item.marks) >= exam.passingMarks
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Marks Entry
        </h1>

        <p className="text-slate-500 mt-1">
          Enter and manage student examination marks
        </p>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">
          <p className="text-slate-500">
            Loading marks data...
          </p>
        </div>
      ) : (
        <>
          {/* Exam Selection */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Exam
            </label>

            <select
              value={selectedExam}
              onChange={(e) =>
                setSelectedExam(e.target.value)
              }
              className="w-full md:max-w-xl px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select an exam
              </option>

              {exams.map((item) => (

                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name} — Class{" "}
                  {getClassName(
                    item.classId,
                    classes
                  )}{" "}
                  —{" "}
                  {getSubjectName(
                    item.subjectId,
                    subjects
                  )}
                </option>

              ))}

            </select>

          </div>

          {/* Exam Information */}

          {exam && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

                  <Info
                    label="Exam"
                    value={exam.name}
                  />

                  <Info
                    label="Class"
                    value={
                      selectedClass
                        ? `${selectedClass.className}-${selectedClass.division}`
                        : "-"
                    }
                  />

                  <Info
                    label="Subject"
                    value={
                      selectedSubject?.name || "-"
                    }
                  />

                  <Info
                    label="Total Marks"
                    value={String(exam.totalMarks)}
                  />

                  <Info
                    label="Passing Marks"
                    value={String(exam.passingMarks)}
                  />

                </div>

              </div>

              {/* Statistics */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <StatCard
                  icon={<Award size={21} />}
                  title="Students"
                  value={totalStudents}
                />

                <StatCard
                  icon={<Check size={21} />}
                  title="Marks Entered"
                  value={`${totalEntered}/${totalStudents}`}
                />

                <StatCard
                  icon={<Award size={21} />}
                  title="Average Marks"
                  value={averageMarks}
                />

                <StatCard
                  icon={<Check size={21} />}
                  title="Passed"
                  value={passedStudents}
                />

              </div>

              {/* Student Marks */}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Toolbar */}

                <div className="p-5 border-b border-slate-200">

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Student Marks
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Enter marks out of{" "}
                        {exam.totalMarks}
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
                          setSearch(e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>

                </div>

                {/* Table */}

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[850px]">

                    <thead className="bg-slate-50 border-b border-slate-200">

                      <tr>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                          Roll No
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                          Student
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                          Marks
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                          Percentage
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                          Grade
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                          Result
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {filteredStudents.map(
                        (student) => {

                          const row = marks.find(
                            (item) =>
                              String(item.studentId) ===
                              String(student.id)
                          );

                          const value =
                            row?.marks || "";

                          const numericMarks =
                            Number(value);

                          const percentage =
                            value !== "" && exam
                              ? Math.round(
                                  (numericMarks /
                                    exam.totalMarks) *
                                    100
                                )
                              : 0;

                          const grade =
                            value !== "" && exam
                              ? getGrade(
                                  numericMarks,
                                  exam.totalMarks
                                )
                              : "-";

                          const passed =
                            value !== "" &&
                            exam &&
                            numericMarks >=
                              exam.passingMarks;

                          return (
                            <tr
                              key={student.id}
                              className="hover:bg-slate-50 transition"
                            >

                              <td className="px-6 py-4 font-semibold text-slate-700">
                                {student.rollNo}
                              </td>

                              <td className="px-6 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                    {student.name
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>

                                    <p className="font-semibold text-slate-800">
                                      {student.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {student.email}
                                    </p>

                                  </div>

                                </div>

                              </td>

                              <td className="px-6 py-4">

                                <div className="flex items-center gap-2">

                                  <input
                                    type="number"
                                    min="0"
                                    max={
                                      exam.totalMarks
                                    }
                                    value={value}
                                    onChange={(e) =>
                                      updateMarks(
                                        String(student.id),
                                        e.target.value
                                      )
                                    }
                                    placeholder="0"
                                    className="w-28 px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                  />

                                  <span className="text-sm text-slate-400">
                                    / {exam.totalMarks}
                                  </span>

                                </div>

                              </td>

                              <td className="px-6 py-4">

                                <span className="font-semibold text-slate-700">
                                  {value !== ""
                                    ? `${percentage}%`
                                    : "-"}
                                </span>

                              </td>

                              <td className="px-6 py-4">

                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                    grade === "A+" ||
                                    grade === "A"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : grade === "F"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {grade}
                                </span>

                              </td>

                              <td className="px-6 py-4">

                                {value === "" ? (
                                  <span className="text-slate-400 text-sm">
                                    Pending
                                  </span>
                                ) : passed ? (
                                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                                    <Check size={16} />
                                    Pass
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                                    <XCircle size={16} />
                                    Fail
                                  </span>
                                )}

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {filteredStudents.length === 0 && (
                  <div className="py-12 text-center text-slate-500">
                    No students found for this exam.
                  </div>
                )}

                {/* Footer */}

                <div className="p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">

                  <p className="text-sm text-slate-500">
                    {totalEntered} of{" "}
                    {totalStudents} marks entered
                  </p>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={19} />

                    {saving
                      ? "Saving..."
                      : "Save Marks"}
                  </button>

                </div>

              </div>

              {/* Success */}

              {savedMessage && (
                <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
                  <Check size={18} />
                  {savedMessage}
                </div>
              )}
            </>
          )}
        </>
      )}

    </div>
  );
}

/* =========================
   Helpers
========================= */

function getClassName(
  classId: string | undefined,
  classes: ClassData[]
) {
  const item = classes.find(
    (classItem) =>
      String(classItem.id) === String(classId)
  );

  return item
    ? `${item.className}-${item.division}`
    : "Unknown";
}

function getSubjectName(
  subjectId: string | undefined,
  subjects: Subject[]
) {
  const item = subjects.find(
    (subject) =>
      String(subject.id) === String(subjectId)
  );

  return item ? item.name : "Unknown";
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="font-semibold text-slate-800 mt-1">
        {value}
      </p>
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
  value: string | number;
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