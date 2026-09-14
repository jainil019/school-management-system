import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";

import {
  getHomework,
  createHomework,
  updateHomework,
  deleteHomework,
  type Homework,
} from "../../services/homeworkService";

function HomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Homework | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    className: "",
    subject: "",
    dueDate: "",
  });

  // --------------------------------
  // LOAD HOMEWORK
  // --------------------------------

  const loadHomework = async () => {
    try {
      setLoading(true);

      const data = await getHomework();

      setHomework(data);
    } catch (error) {
      console.error("Failed to load homework:", error);
      alert("Failed to load homework.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, []);

  // --------------------------------
  // FORM
  // --------------------------------

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      className: "",
      subject: "",
      dueDate: "",
    });
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item: Homework) => {
    setEditing(item);

    setForm({
      title: item.title,
      description: item.description,
      className: item.className,
      subject: item.subject,
      dueDate: item.dueDate,
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
      !form.className.trim() ||
      !form.subject.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const homeworkData: Homework = {
      title: form.title.trim(),
      description: form.description.trim(),
      className: form.className.trim(),
      subject: form.subject.trim(),
      dueDate: form.dueDate,
    };

    try {
      setSaving(true);

      if (editing?.id) {
        const updatedHomework =
          await updateHomework(
            editing.id,
            homeworkData
          );

        setHomework((current) =>
          current.map((item) =>
            item.id === editing.id
              ? updatedHomework
              : item
          )
        );
      } else {
        const newHomework =
          await createHomework(homeworkData);

        setHomework((current) => [
          ...current,
          newHomework,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Failed to save homework:",
        error
      );

      alert("Failed to save homework.");
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
      "Are you sure you want to delete this homework?"
    );

    if (!confirmed) return;

    try {
      await deleteHomework(id);

      setHomework((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(
        "Failed to delete homework:",
        error
      );

      alert("Failed to delete homework.");
    }
  };

  // --------------------------------
  // SEARCH
  // --------------------------------

  const filteredHomework = homework.filter(
    (item) =>
      `${item.title} ${item.className} ${item.subject} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Homework
          </h1>

          <p className="text-slate-500 mt-1">
            Manage student homework
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Homework
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
            placeholder="Search homework..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Homework Records
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredHomework.length} records found
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading homework...
            </div>
          ) : (
            <>
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-600">
                      Title
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Class
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Subject
                    </th>

                    <th className="text-left p-4 font-semibold text-slate-600">
                      Due Date
                    </th>

                    <th className="text-center p-4 font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHomework.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-1 max-w-md truncate">
                          {item.description ||
                            "No description"}
                        </p>
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.className}
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.subject}
                      </td>

                      <td className="p-4 text-slate-700">
                        {item.dueDate || "-"}
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

              {filteredHomework.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p className="font-medium">
                    No homework found.
                  </p>

                  <p className="text-sm mt-1">
                    Add homework or change your
                    search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing
                    ? "Edit Homework"
                    : "Add Homework"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Enter homework details
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
                  Homework Title *
                </label>

                <input
                  placeholder="Enter homework title"
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
                  Description
                </label>

                <textarea
                  placeholder="Enter homework description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Class + Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>

                  <input
                    placeholder="Subject e.g. Mathematics"
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
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueDate:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
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

export default HomeworkPage;