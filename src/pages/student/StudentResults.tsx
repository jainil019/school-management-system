import { useEffect, useMemo, useState } from "react";
import { Trophy, Award, CheckCircle, XCircle } from "lucide-react";

import { getStudentResultData } from "../../services/studentPortalService";

interface Exam {
  id: string;
  name: string;
  classId: string;
  subjectId: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  academicYear: string;
  status: string;
}

interface Result {
  id?: string;
  examId: string;
  studentId: string;
  marks: number;
  totalMarks: number;
  grade: string;
  result: string;
  exam?: Exam | null;
}

export default function StudentResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const studentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!studentId) return;

        const data = await getStudentResultData(studentId);
        setResults(data);
      } catch (error) {
        console.error("Failed to load results:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, []);

  const average = useMemo(() => {
    if (!results.length) return 0;

    const total = results.reduce(
      (sum, item) => {
        const totalMarks =
          item.totalMarks ||
          item.exam?.totalMarks ||
          0;

        return totalMarks
          ? sum + (item.marks / totalMarks) * 100
          : sum;
      },
      0
    );

    return Math.round(total / results.length);
  }, [results]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Results
        </h1>

        <p className="text-slate-500 mt-1">
          View your examination results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Stat
          icon={<Trophy size={22} />}
          title="Examinations"
          value={String(results.length)}
        />

        <Stat
          icon={<Award size={22} />}
          title="Average"
          value={`${average}%`}
        />

        <Stat
          icon={<CheckCircle size={22} />}
          title="Passed"
          value={String(
            results.filter(
              (item) =>
                item.result === "Pass" ||
                item.result === "Passed"
            ).length
          )}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Result History
          </h2>
        </div>

        {results.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-slate-600">
                    Examination
                  </th>

                  <th className="text-left p-4 text-sm font-semibold text-slate-600">
                    Date
                  </th>

                  <th className="text-left p-4 text-sm font-semibold text-slate-600">
                    Marks
                  </th>

                  <th className="text-left p-4 text-sm font-semibold text-slate-600">
                    Grade
                  </th>

                  <th className="text-left p-4 text-sm font-semibold text-slate-600">
                    Result
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((item) => (
                  <tr
                    key={item.id || item.examId}
                    className="border-t border-slate-100"
                  >
                    <td className="p-4 font-semibold text-slate-900">
                      {item.exam?.name || "Examination"}
                    </td>

                    <td className="p-4 text-slate-500">
                      {item.exam?.examDate || "-"}
                    </td>

                    <td className="p-4 font-semibold text-blue-600">
                      {item.marks}/
                      {item.totalMarks ||
                        item.exam?.totalMarks ||
                        0}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {item.grade || "-"}
                      </span>
                    </td>

                    <td className="p-4">
                      {item.result === "Pass" ||
                      item.result === "Passed" ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                          <CheckCircle size={16} />
                          Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                          <XCircle size={16} />
                          {item.result || "Failed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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

function Loading() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 mt-4">
        Loading results...
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div className="p-10 text-center text-slate-400">
      No examination results found.
    </div>
  );
}