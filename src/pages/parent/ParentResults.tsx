import { useEffect, useState } from "react";
import {
  Loader2,
  Award,
} from "lucide-react";

import { getParentResults } from "../../services/parentPortalService";

interface Result {
  id?: string;
  marks: number;
  totalMarks?: number;
  grade?: string;
  result?: string;
  exam?: {
    name?: string;
    date?: string;
  };
}

export default function ParentResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const id = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!id) return;

      const data = await getParentResults(id);
      setResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const average =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, item) => sum + Number(item.marks || 0),
            0
          ) / results.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Results
        </h1>

        <p className="text-slate-500 mt-1">
          View your child's examination results.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award size={28} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Average Marks
            </p>

            <p className="text-3xl font-bold">
              {average}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-bold">Examination Results</h2>
        </div>

        {results.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            No results found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-4">
                    Exam
                  </th>

                  <th className="text-left px-5 py-4">
                    Marks
                  </th>

                  <th className="text-left px-5 py-4">
                    Grade
                  </th>

                  <th className="text-left px-5 py-4">
                    Result
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {results.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-5 py-4">
                      {item.exam?.name || "Examination"}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {item.marks}
                      {item.totalMarks
                        ? ` / ${item.totalMarks}`
                        : ""}
                    </td>

                    <td className="px-5 py-4">
                      {item.grade || "-"}
                    </td>

                    <td className="px-5 py-4">
                      {item.result || "-"}
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

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      Loading results...
    </div>
  );
}