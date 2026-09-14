import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  X,
  Save,
} from "lucide-react";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type Subject,
} from "../../services/subjectService";

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] =
    useState<Subject | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "Theory" as "Theory" | "Practical",
    teacher: "",
    classes: "",
    weeklyClasses: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Load subjects from MongoDB
  const loadSubjects = async () => {
    try {
      setLoading(true);

      const data = await getSubjects();

      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      alert("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const text = search.toLowerCase();

    const matchesSearch =
      subject.name.toLowerCase().includes(text) ||
      subject.code.toLowerCase().includes(text) ||
      subject.teacher.toLowerCase().includes(text) ||
      subject.classes.toLowerCase().includes(text);

    const matchesType =
      typeFilter === "All" || subject.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const openAddModal = () => {
    setEditingSubject(null);

    setForm({
      name: "",
      code: "",
      type: "Theory",
      teacher: "",
      classes: "",
      weeklyClasses: "",
      status: "Active",
    });

    setIsModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);

    setForm({
      name: subject.name,
      code: subject.code,
      type: subject.type,
      teacher: subject.teacher,
      classes: subject.classes,
      weeklyClasses: String(subject.weeklyClasses),
      status: subject.status,
    });

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (
      !form.name ||
      !form.code ||
      !form.teacher ||
      !form.classes
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const subjectData: Subject = {
      name: form.name,
      code: form.code,
      type: form.type,
      teacher: form.teacher,
      classes: form.classes,
      weeklyClasses: Number(form.weeklyClasses) || 0,
      status: form.status,
    };

    try {
      setSaving(true);

      if (editingSubject?.id) {
        const updatedSubject = await updateSubject(
          editingSubject.id,
          subjectData
        );

        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === editingSubject.id
              ? updatedSubject
              : subject
          )
        );
      } else {
        const newSubject = await createSubject(
          subjectData
        );

        setSubjects((prev) => [
          ...prev,
          newSubject,
        ]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save subject:", error);
      alert("Failed to save subject.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    try {
      await deleteSubject(id);

      setSubjects((prev) =>
        prev.filter((subject) => subject.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Subjects
          </h1>

          <p className="text-slate-500 mt-1">
            Manage school subjects and teaching assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Plus size={19} />
          Add Subject
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Total Subjects"
          value={subjects.length}
        />

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Theory Subjects"
          value={
            subjects.filter(
              (subject) => subject.type === "Theory"
            ).length
          }
        />

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Practical Subjects"
          value={
            subjects.filter(
              (subject) => subject.type === "Practical"
            ).length
          }
        />

      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search subject, code, teacher or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
          </select>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Subject
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Type
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Teacher
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Classes
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Weekly Classes
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-500"
                  >
                    Loading subjects...
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject) => (

                  <tr
                    key={subject.id}
                    className="hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <BookOpen size={19} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {subject.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {subject.code}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          subject.type === "Theory"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {subject.type}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {subject.teacher}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {subject.classes}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {subject.weeklyClasses}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          subject.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {subject.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditModal(subject)
                          }
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(subject.id)
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

        {!loading && filteredSubjects.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No subjects found.
          </div>
        )}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingSubject
                    ? "Edit Subject"
                    : "Add Subject"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage subject information
                </p>
              </div>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormInput
                label="Subject Name"
                placeholder="e.g. Mathematics"
                value={form.name}
                onChange={(value) =>
                  setForm({
                    ...form,
                    name: value,
                  })
                }
              />

              <FormInput
                label="Subject Code"
                placeholder="e.g. MATH"
                value={form.code}
                onChange={(value) =>
                  setForm({
                    ...form,
                    code: value,
                  })
                }
              />

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as
                        | "Theory"
                        | "Practical",
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Theory">
                    Theory
                  </option>

                  <option value="Practical">
                    Practical
                  </option>
                </select>
              </div>

              <FormInput
                label="Teacher"
                placeholder="e.g. Rajesh Patel"
                value={form.teacher}
                onChange={(value) =>
                  setForm({
                    ...form,
                    teacher: value,
                  })
                }
              />

              <FormInput
                label="Classes"
                placeholder="e.g. 10-A, 10-B"
                value={form.classes}
                onChange={(value) =>
                  setForm({
                    ...form,
                    classes: value,
                  })
                }
              />

              <FormInput
                label="Weekly Classes"
                type="number"
                placeholder="e.g. 5"
                value={form.weeklyClasses}
                onChange={(value) =>
                  setForm({
                    ...form,
                    weeklyClasses: value,
                  })
                }
              />

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as
                        | "Active"
                        | "Inactive",
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : editingSubject
                  ? "Save Changes"
                  : "Add Subject"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* Summary Card */

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

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

/* Form Input */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}