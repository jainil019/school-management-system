import { useEffect, useState } from "react";
import {
  Megaphone,
  CalendarDays,
} from "lucide-react";

import { getStudentNotices } from "../../services/studentPortalService";

interface Notice {
  id: string;
  title: string;
  description: string;
  audience: string;
  date: string;
}

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getStudentNotices();
        setNotices(data);
      } catch (error) {
        console.error("Failed to load notices:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Notices
        </h1>

        <p className="text-slate-500 mt-1">
          Important announcements from the school.
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
          No notices available.
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Megaphone size={22} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {notice.title}
                    </h2>

                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays size={14} />
                      {notice.date}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-3 leading-6">
                    {notice.description}
                  </p>

                  <span className="inline-block mt-4 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    {notice.audience}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 mt-4">
        Loading notices...
      </p>
    </div>
  );
}