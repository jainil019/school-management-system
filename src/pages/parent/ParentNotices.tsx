import { useEffect, useState } from "react";
import {
  Megaphone,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { getParentNotices } from "../../services/parentPortalService";

interface Notice {
  id?: string;
  title: string;
  description?: string;
  audience: string;
  date?: string;
  status?: string;
}

export default function ParentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const data = await getParentNotices();
      setNotices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center gap-3">
        <Loader2 className="animate-spin" />
        Loading notices...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Notices
        </h1>

        <p className="text-slate-500 mt-1">
          Important school announcements.
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <Megaphone
            size={42}
            className="mx-auto text-slate-300 mb-3"
          />

          <p className="text-slate-500">
            No notices available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, index) => (
            <div
              key={notice.id || index}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Megaphone size={21} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <h2 className="font-bold text-slate-900">
                      {notice.title}
                    </h2>

                    {notice.date && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CalendarDays size={14} />
                        {notice.date}
                      </span>
                    )}
                  </div>

                  {notice.description && (
                    <p className="text-sm text-slate-500 mt-3 leading-6">
                      {notice.description}
                    </p>
                  )}

                  <span className="inline-block mt-4 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
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