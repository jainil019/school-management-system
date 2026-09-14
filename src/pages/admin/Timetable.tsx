import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";

import {
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  type Timetable,
} from "../../services/timetableService";

function TimetablePage() {
  const [items, setItems] = useState<Timetable[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Timetable | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    className: "",
    subject: "",
    teacher: "",
    day: "Monday",
    startTime: "",
    endTime: "",
  });

  // --------------------------------
  // LOAD DATA
  // --------------------------------

  const loadTimetable = async () => {
    try {
      setLoading(true);

      const data = await getTimetable();

      setItems(data);
    } catch (error) {
      console.error(
        "Failed to load timetable:",
        error
      );

      alert("Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  // --------------------------------
  // FORM
  // --------------------------------

  const resetForm = () => {
    setForm({
      className: "",
      subject: "",
      teacher: "",
      day: "Monday",
      startTime: "",
      endTime: "",
    });
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item: Timetable) => {
    setEditing(item);

    setForm({
      className: item.className,
      subject: item.subject,
      teacher: item.teacher,
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
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
      !form.className.trim() ||
      !form.subject.trim() ||
      !form.teacher.trim() ||
      !form.startTime ||
      !form.endTime
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (form.startTime >= form.endTime) {
      alert("End time must be after start time.");
      return;
    }

    const timetableData: Timetable = {
      className: form.className.trim(),
      subject: form.subject.trim(),
      teacher: form.teacher.trim(),
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    try {
      setSaving(true);

      if (editing?.id) {
        const updatedItem =
          await updateTimetable(
            editing.id,
            timetableData
          );

        setItems((current) =>
          current.map((item) =>
            item.id === editing.id
              ? updatedItem
              : item
          )
        );
      } else {
        const newItem =
          await createTimetable(
            timetableData
          );

        setItems((current) => [
          ...current,
          newItem,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Failed to save timetable:",
        error
      );

      alert("Failed to save timetable.");
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
      "Delete this timetable entry?"
    );

    if (!confirmed) return;

    try {
      await deleteTimetable(id);

      setItems((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete timetable:",
        error
      );

      alert("Failed to delete timetable.");
    }
  };

  // --------------------------------
  // SEARCH
  // --------------------------------

  const filteredItems = items.filter(
    (item) =>
      `${item.className} ${item.subject} ${item.teacher} ${item.day}`
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
            Timetable
          </h1>

          <p className="text-slate-500 mt-1">
            Manage class schedules
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Timetable
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
            placeholder="Search class, subject, teacher..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Timetable Records
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredItems.length} entries found
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading timetable...
            </div>
          ) : (
            <>
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-600">
                      Class
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Subject
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Teacher
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Day
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Time
                    </th>

                    <th className="text-center p-4 font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        {item.className}
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.subject}
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.teacher}
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.day}
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.startTime} -{" "}
                        {item.endTime}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              openEdit(item)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredItems.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  <p className="font-medium">
                    No timetable entries found.
                  </p>

                  <p className="text-sm mt-1">
                    Add a timetable entry or
                    change your search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing
                    ? "Edit Timetable"
                    : "Add Timetable"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Enter class schedule details
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Class *
                  </label>

                  <input
                    placeholder="Class e.g. 10-A"
                    value={form.className}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        className:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>

                  <input
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        subject:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Teacher */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teacher *
                  </label>

                  <input
                    placeholder="Teacher"
                    value={form.teacher}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        teacher:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Day */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Day *
                  </label>

                  <select
                    value={form.day}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        day: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                  </select>
                </div>

                {/* Start */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Time *
                  </label>

                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startTime:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Time *
                  </label>

                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endTime:
                          e.target.value,
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
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetablePage;