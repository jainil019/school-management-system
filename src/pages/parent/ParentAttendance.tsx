import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
} from "lucide-react";

import { getParentAttendance } from "../../services/parentPortalService";

interface Attendance {
  id?: string;
  date: string;
  status: string;
}

export default function ParentAttendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const id = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!id) return;

      const data = await getParentAttendance(id);
      setRecords(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const present = records.filter(
    (item) => item.status === "Present"
  ).length;

  const absent = records.filter(
    (item) => item.status === "Absent"
  ).length;

  const late = records.filter(
    (item) => item.status === "Late"
  ).length;

  const percentage =
    records.length > 0
      ? Math.round((present / records.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Attendance
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor your child's attendance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={<CalendarCheck />}
          title="Percentage"
          value={`${percentage}%`}
        />

        <Stat
          icon={<CheckCircle2 />}
          title="Present"
          value={present}
        />

        <Stat
          icon={<XCircle />}
          title="Absent"
          value={absent}
        />

        <Stat
          icon={<Clock3 />}
          title="Late"
          value={late}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold">
            Attendance History
          </h2>
        </div>

        {records.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            No attendance records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-4">
                    Date
                  </th>

                  <th className="text-left px-5 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {records.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-5 py-4">
                      {item.date}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-slate-100">
                        {item.status}
                      </span>
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
  value: string | number;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="text-blue-600">{icon}</div>
      <p className="text-sm text-slate-500 mt-3">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      Loading attendance...
    </div>
  );
}