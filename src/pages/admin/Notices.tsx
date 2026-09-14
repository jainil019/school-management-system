import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Megaphone,
} from "lucide-react";

import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  type Notice,
} from "../../services/noticeService";

function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    audience: "All",
    date: "",
  });

  // --------------------------------
  // LOAD NOTICES
  // --------------------------------

  const loadNotices = async () => {
    try {
      setLoading(true);

      const data = await getNotices();

      setNotices(data);
    } catch (error) {
      console.error(
        "Failed to load notices:",
        error
      );

      alert("Failed to load notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // --------------------------------
  // FORM
  // --------------------------------

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      audience: "All",
      date: "",
    });
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  const openEdit = (notice: Notice) => {
    setEditing(notice);

    setForm({
      title: notice.title,
      description: notice.description,
      audience: notice.audience,
      date: notice.date,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditing(null);
    resetForm();
  };

  // --------------------------------
  // CREATE / UPDATE
  // --------------------------------

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const noticeData: Notice = {
      title: form.title.trim(),
      description: form.description.trim(),
      audience: form.audience,
      date: form.date,
    };

    try {
      setSaving(true);

      if (editing?.id) {
        const updatedNotice =
          await updateNotice(
            editing.id,
            noticeData
          );

        setNotices((current) =>
          current.map((item) =>
            item.id === editing.id
              ? updatedNotice
              : item
          )
        );
      } else {
        const newNotice =
          await createNotice(noticeData);

        setNotices((current) => [
          ...current,
          newNotice,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Failed to save notice:",
        error
      );

      alert("Failed to save notice.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // DELETE
  // --------------------------------

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Delete this notice?"
    );

    if (!confirmed) return;

    try {
      await deleteNotice(id);

      setNotices((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete notice:",
        error
      );

      alert("Failed to delete notice.");
    }
  };

  // --------------------------------
  // SEARCH
  // --------------------------------

  const filteredNotices = notices.filter(
    (notice) =>
      `${notice.title} ${notice.description} ${notice.audience}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notices
          </h1>

          <p className="text-slate-500 mt-1">
            Manage school announcements
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Notice
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search notices..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 py-14 text-center text-slate-500">
            Loading notices...
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Megaphone
                      size={20}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {notice.title}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      {notice.date}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap">
                  {notice.audience}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-6">
                {notice.description}
              </p>

              <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() =>
                    openEdit(notice)
                  }
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(notice.id)
                  }
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {!loading &&
        filteredNotices.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 py-14 text-center">
            <Megaphone
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <h3 className="font-semibold text-slate-700">
              No notices found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Create your first school announcement.
            </p>
          </div>
        )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing
                    ? "Edit Notice"
                    : "Add Notice"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Create a school announcement
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notice Title *
                </label>

                <input
                  placeholder="Notice title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>

                <textarea
                  placeholder="Notice description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Audience + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Audience
                  </label>

                  <select
                    value={form.audience}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        audience:
                          e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">
                      All
                    </option>

                    <option value="Students">
                      Students
                    </option>

                    <option value="Teachers">
                      Teachers
                    </option>

                    <option value="Parents">
                      Parents
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date *
                  </label>

                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : editing
                    ? "Update"
                    : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notices;