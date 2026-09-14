import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  BookOpen,
  X,
  Save,
} from "lucide-react";

import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  type ClassData,
} from "../../services/classService";

export default function Classes() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] =
    useState<ClassData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    className: "",
    division: "",
    classTeacher: "",
    roomNo: "",
    students: "",
    academicYear: "2026-27",
    status: "Active" as "Active" | "Inactive",
  });

  // Load classes from MongoDB
  const loadClasses = async () => {
    try {
      setLoading(true);

      const data = await getClasses();

      setClasses(data);
    } catch (error) {
      console.error("Failed to load classes:", error);
      alert("Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.className.toLowerCase().includes(searchText) ||
      item.division.toLowerCase().includes(searchText) ||
      item.classTeacher.toLowerCase().includes(searchText) ||
      item.roomNo.toLowerCase().includes(searchText)
    );
  });

  const openAddModal = () => {
    setEditingClass(null);

    setForm({
      className: "",
      division: "",
      classTeacher: "",
      roomNo: "",
      students: "",
      academicYear: "2026-27",
      status: "Active",
    });

    setIsModalOpen(true);
  };

  const openEditModal = (classData: ClassData) => {
    setEditingClass(classData);

    setForm({
      className: classData.className,
      division: classData.division,
      classTeacher: classData.classTeacher,
      roomNo: classData.roomNo,
      students: String(classData.students),
      academicYear: classData.academicYear,
      status: classData.status,
    });

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (
      !form.className ||
      !form.division ||
      !form.classTeacher ||
      !form.roomNo
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const classData: ClassData = {
      className: form.className,
      division: form.division,
      classTeacher: form.classTeacher,
      roomNo: form.roomNo,
      students: Number(form.students) || 0,
      academicYear: form.academicYear,
      status: form.status,
    };

    try {
      setSaving(true);

      if (editingClass?.id) {
        // Update existing class
        const updatedClass = await updateClass(
          editingClass.id,
          classData
        );

        setClasses((prev) =>
          prev.map((item) =>
            item.id === editingClass.id
              ? updatedClass
              : item
          )
        );
      } else {
        // Create new class
        const newClass = await createClass(classData);

        setClasses((prev) => [...prev, newClass]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save class:", error);
      alert("Failed to save class.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) return;

    try {
      await deleteClass(id);

      setClasses((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete class:", error);
      alert("Failed to delete class.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Classes
          </h1>

          <p className="text-slate-500 mt-1">
            Manage school classes and divisions
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Plus size={19} />
          Add Class
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Total Classes"
          value={classes.length}
        />

        <SummaryCard
          icon={<Users size={22} />}
          title="Total Students"
          value={classes.reduce(
            (total, item) => total + item.students,
            0
          )}
        />

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Active Classes"
          value={
            classes.filter(
              (item) => item.status === "Active"
            ).length
          }
        />

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="relative max-w-md">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search class, teacher or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Class
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Class Teacher
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Room
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Students
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Academic Year
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
                    Loading classes...
                  </td>
                </tr>
              ) : (
                filteredClasses.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {item.className}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            Class {item.className}
                          </p>

                          <p className="text-sm text-slate-500">
                            Division {item.division}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.classTeacher}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      Room {item.roomNo}
                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Users size={16} />
                        {item.students}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.academicYear}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item.id)
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

        {!loading && filteredClasses.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No classes found.
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingClass
                    ? "Edit Class"
                    : "Add Class"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingClass
                    ? "Update class information"
                    : "Create a new class"}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormInput
                label="Class"
                placeholder="e.g. 10"
                value={form.className}
                onChange={(value) =>
                  setForm({
                    ...form,
                    className: value,
                  })
                }
              />

              <FormInput
                label="Division"
                placeholder="e.g. A"
                value={form.division}
                onChange={(value) =>
                  setForm({
                    ...form,
                    division: value,
                  })
                }
              />

              <FormInput
                label="Class Teacher"
                placeholder="e.g. Rajesh Patel"
                value={form.classTeacher}
                onChange={(value) =>
                  setForm({
                    ...form,
                    classTeacher: value,
                  })
                }
              />

              <FormInput
                label="Room Number"
                placeholder="e.g. 101"
                value={form.roomNo}
                onChange={(value) =>
                  setForm({
                    ...form,
                    roomNo: value,
                  })
                }
              />

              <FormInput
                label="Number of Students"
                type="number"
                placeholder="e.g. 30"
                value={form.students}
                onChange={(value) =>
                  setForm({
                    ...form,
                    students: value,
                  })
                }
              />

              <FormInput
                label="Academic Year"
                placeholder="e.g. 2026-27"
                value={form.academicYear}
                onChange={(value) =>
                  setForm({
                    ...form,
                    academicYear: value,
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
                onClick={() => setIsModalOpen(false)}
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
                  : editingClass
                  ? "Save Changes"
                  : "Add Class"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ---------------- Components ---------------- */

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
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}