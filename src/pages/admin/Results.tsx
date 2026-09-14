import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CheckCircle,
  GraduationCap,
  Printer,
  Search,
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
  getResults,
  type Result,
} from "../../services/resultService";

export default function Results() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  /* =========================
     Load Backend Data
  ========================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          studentsData,
          classesData,
          subjectsData,
          resultsData,
        ] = await Promise.all([
          getStudents(),
          getClasses(),
          getSubjects(),
          getResults(),
        ]);

        setStudents(studentsData);
        setClasses(classesData);
        setSubjects(subjectsData);
        setResults(resultsData);
      } catch (error) {
        console.error(
          "Failed to load results:",
          error
        );

        alert("Failed to load student results.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================
     Helpers
  ========================= */

  const getClassName = (
    classId: string | undefined
  ) => {
    const classData = classes.find(
      (item) =>
        String(item.id) === String(classId)
    );

    return classData?.className || "-";
  };

  const getSubjectName = (
    subjectId: string | undefined
  ) => {
    const subject = subjects.find(
      (item) =>
        String(item.id) === String(subjectId)
    );

    return subject?.name || "-";
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Above Average";
    if (percentage >= 50) return "Average";
    if (percentage >= 40) return "Pass";

    return "Needs Improvement";
  };

  /* =========================
     Filter Students
  ========================= */

  const filteredStudents = useMemo(() => {
    const searchText = search.toLowerCase();

    return students.filter((student) => {
      return (
        student.name
          .toLowerCase()
          .includes(searchText) ||
        student.email
          .toLowerCase()
          .includes(searchText) ||
        String(student.rollNo).includes(searchText)
      );
    });
  }, [students, search]);

  /* =========================
     Selected Student
  ========================= */

  const student = students.find(
    (item) =>
      String(item.id) ===
      String(selectedStudentId)
  );

  /* =========================
     Available Exam Names
  ========================= */

  const examNames = useMemo(() => {
    const names = results
      .map((result) => result.exam?.name)
      .filter(
        (name): name is string =>
          Boolean(name)
      );

    return Array.from(new Set(names)).sort();
  }, [results]);

  /* =========================
     Student Results
  ========================= */

  const studentResults = useMemo(() => {
    if (!student) {
      return [];
    }

    return results.filter((result) => {
      const belongsToStudent =
        String(result.studentId) ===
        String(student.id);

      const belongsToExam =
        !selectedExamName ||
        result.exam?.name === selectedExamName;

      return (
        belongsToStudent &&
        belongsToExam
      );
    });
  }, [
    results,
    student,
    selectedExamName,
  ]);

  /* =========================
     Result Rows
  ========================= */

  const resultRows = useMemo(() => {
    return studentResults.map((result) => {
      const totalMarks =
        result.exam?.totalMarks ||
        result.totalMarks ||
        0;

      const passingMarks =
        result.exam?.passingMarks || 0;

      const percentage =
        totalMarks > 0
          ? (result.marks / totalMarks) * 100
          : 0;

      const passed =
        result.result === "Pass" ||
        result.marks >= passingMarks;

      return {
        result,
        subjectName: getSubjectName(
          result.exam?.subjectId
        ),
        marks: result.marks,
        totalMarks,
        percentage,
        grade:
          result.grade ||
          getGrade(percentage),
        passed,
      };
    });
  }, [studentResults, subjects]);

  /* =========================
     Summary
  ========================= */

  const totalMarks = resultRows.reduce(
    (sum, row) => sum + row.marks,
    0
  );

  const totalPossibleMarks =
    resultRows.reduce(
      (sum, row) =>
        sum + row.totalMarks,
      0
    );

  const overallPercentage =
    totalPossibleMarks > 0
      ? (totalMarks /
          totalPossibleMarks) *
        100
      : 0;

  const overallGrade =
    totalPossibleMarks > 0
      ? getGrade(overallPercentage)
      : "-";

  const allMarksEntered =
    resultRows.length > 0;

  const overallPassed =
    allMarksEntered &&
    resultRows.every(
      (row) => row.passed
    );

  /* =========================
     Print
  ========================= */

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Student Results
          </h1>

          <p className="text-slate-500 mt-1">
            View student performance and generate report cards
          </p>
        </div>

        {student && resultRows.length > 0 && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Printer size={18} />
            Print Report Card
          </button>
        )}

      </div>

      {/* Loading */}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">
          <p className="text-slate-500">
            Loading student results...
          </p>
        </div>
      ) : (
        <>
          {/* Selection Card */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Search */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Student
                </label>

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by name, email or roll no"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>
              </div>

              {/* Student */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student
                </label>

                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(
                      e.target.value
                    );

                    setSelectedExamName("");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select student
                  </option>

                  {filteredStudents.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name} - Roll No{" "}
                        {item.rollNo}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Examination */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Examination
                </label>

                <select
                  value={selectedExamName}
                  onChange={(e) =>
                    setSelectedExamName(
                      e.target.value
                    )
                  }
                  disabled={!student}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                >

                  <option value="">
                    All Examinations
                  </option>

                  {examNames.map(
                    (name) => (
                      <option
                        key={name}
                        value={name}
                      >
                        {name}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          </div>

          {/* Empty State */}

          {!student && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">

                <GraduationCap
                  size={32}
                  className="text-blue-600"
                />

              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                Select a Student
              </h2>

              <p className="text-slate-500 mt-2">
                Select a student above to view their examination results.
              </p>

            </div>
          )}

          {/* No Results */}

          {student &&
            resultRows.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

                <XCircle
                  size={40}
                  className="mx-auto text-slate-400 mb-4"
                />

                <h2 className="text-xl font-semibold text-slate-900">
                  No Result Found
                </h2>

                <p className="text-slate-500 mt-2">
                  No marks have been entered for this student yet.
                </p>

              </div>
            )}

          {/* Report Card */}

          {student &&
            resultRows.length > 0 && (
              <div
                id="report-card"
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >

                {/* Report Header */}

                <div className="p-6 md:p-8 border-b border-slate-200">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    <div className="flex items-center gap-4">

                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">

                        <GraduationCap
                          size={34}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <h2 className="text-2xl font-bold text-slate-900">
                          Student Report Card
                        </h2>

                        <p className="text-slate-500 mt-1">
                          {selectedExamName ||
                            "All Examinations"}
                        </p>

                      </div>

                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        overallPassed
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >

                      {overallPassed ? (
                        <CheckCircle size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}

                      {overallPassed
                        ? "PASS"
                        : "FAIL"}

                    </div>

                  </div>

                </div>

                {/* Student Details */}

                <div className="p-6 md:p-8 border-b border-slate-200">

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <Info
                      label="Student Name"
                      value={student.name}
                    />

                    <Info
                      label="Roll Number"
                      value={String(
                        student.rollNo
                      )}
                    />

                    <Info
                      label="Class"
                      value={`${getClassName(
                        classes.find(
                          (item) =>
                            item.className ===
                              student.className &&
                            item.division ===
                              student.division
                        )?.id
                      )}${
                        student.division
                          ? ` - ${student.division}`
                          : ""
                      }`}
                    />

                    <Info
                      label="Academic Year"
                      value={
                        resultRows[0]?.result
                          .exam?.academicYear ||
                        "-"
                      }
                    />

                  </div>

                </div>

                {/* Subject Performance */}

                <div className="p-6 md:p-8">

                  <div className="flex items-center gap-3 mb-5">

                    <Award
                      size={22}
                      className="text-blue-600"
                    />

                    <h3 className="text-lg font-bold text-slate-900">
                      Subject-wise Performance
                    </h3>

                  </div>

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[750px]">

                      <thead>

                        <tr className="bg-slate-50 border-y border-slate-200">

                          <th className="text-left px-4 py-4 text-sm font-semibold text-slate-600">
                            Subject
                          </th>

                          <th className="text-left px-4 py-4 text-sm font-semibold text-slate-600">
                            Exam Date
                          </th>

                          <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">
                            Marks
                          </th>

                          <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">
                            Percentage
                          </th>

                          <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">
                            Grade
                          </th>

                          <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">
                            Result
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {resultRows.map(
                          (row) => (
                            <tr
                              key={
                                row.result.id
                              }
                              className="border-b border-slate-100"
                            >

                              <td className="px-4 py-4">

                                <p className="font-semibold text-slate-900">
                                  {
                                    row.subjectName
                                  }
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  Passing Marks:{" "}
                                  {
                                    row.result
                                      .exam
                                      ?.passingMarks
                                  }
                                </p>

                              </td>

                              <td className="px-4 py-4 text-slate-600">
                                {row.result.exam
                                  ?.examDate ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4 text-center font-semibold">
                                {row.marks}/
                                {
                                  row.totalMarks
                                }
                              </td>

                              <td className="px-4 py-4 text-center">
                                {row.percentage.toFixed(
                                  1
                                )}
                                %
                              </td>

                              <td className="px-4 py-4 text-center">

                                <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                  {row.grade}
                                </span>

                              </td>

                              <td className="px-4 py-4 text-center">

                                {row.passed ? (
                                  <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                                    <CheckCircle
                                      size={16}
                                    />
                                    Pass
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                                    <XCircle
                                      size={16}
                                    />
                                    Fail
                                  </span>
                                )}

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* Summary */}

                <div className="px-6 md:px-8 pb-8">

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <Summary
                      label="Total Marks"
                      value={`${totalMarks}/${totalPossibleMarks}`}
                    />

                    <Summary
                      label="Percentage"
                      value={`${overallPercentage.toFixed(
                        1
                      )}%`}
                    />

                    <Summary
                      label="Overall Grade"
                      value={overallGrade}
                      subText={getGradeText(
                        overallPercentage
                      )}
                    />

                    <div
                      className={`rounded-2xl p-5 ${
                        overallPassed
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >

                      <p className="text-sm text-slate-500">
                        Final Result
                      </p>

                      <p
                        className={`text-2xl font-bold mt-1 ${
                          overallPassed
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {overallPassed
                          ? "PASS"
                          : "FAIL"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Footer */}

                <div className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-200">

                  <p className="text-sm text-slate-500 text-center">
                    This report card is generated from examination marks recorded in the school management system.
                  </p>

                </div>

              </div>
            )}

          {/* Print CSS */}

          <style>
            {`
              @media print {
                body {
                  background: white !important;
                }

                body * {
                  visibility: hidden;
                }

                #report-card,
                #report-card * {
                  visibility: visible;
                }

                #report-card {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  border: none !important;
                  box-shadow: none !important;
                }
              }
            `}
          </style>
        </>
      )}

    </div>
  );
}

/* =========================
   Components
========================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-semibold text-slate-900 mt-1">
        {value}
      </p>
    </div>
  );
}

function Summary({
  label,
  value,
  subText,
}: {
  label: string;
  value: string;
  subText?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

      {subText && (
        <p className="text-xs text-slate-500 mt-1">
          {subText}
        </p>
      )}

    </div>
  );
}