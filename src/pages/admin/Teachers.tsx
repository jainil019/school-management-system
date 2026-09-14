import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher as deleteTeacherApi,
  type Teacher,
} from "../../services/teacherService";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] =
    useState<Teacher | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: "",
    assignedClass: "",
    joiningDate: "",
  });

  // Load teachers from MongoDB
  const loadTeachers = async () => {
    try {
      setLoading(true);

      const data = await getTeachers();

      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
      alert("Failed to load teachers from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      subjectFilter === "All" ||
      teacher.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  const openAddModal = () => {
    setEditingTeacher(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      qualification: "",
      experience: "",
      assignedClass: "",
      joiningDate: "",
    });

    setShowModal(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);

    setForm({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      qualification: teacher.qualification,
      experience: String(teacher.experience),
      assignedClass: teacher.assignedClass,
      joiningDate: teacher.joiningDate,
    });

    setShowModal(true);
  };

  // Add / Update Teacher
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.subject ||
      !form.assignedClass
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const teacherData: Teacher = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        qualification: form.qualification,
        experience: Number(form.experience),
        assignedClass: form.assignedClass,
        joiningDate: form.joiningDate,
        status: "Active",
      };

      if (editingTeacher?.id) {
        const updatedTeacher = await updateTeacher(
          editingTeacher.id,
          teacherData
        );

        setTeachers((prev) =>
          prev.map((teacher) =>
            teacher.id === editingTeacher.id
              ? updatedTeacher
              : teacher
          )
        );

        alert("Teacher updated successfully!");
      } else {
        const newTeacher = await createTeacher(teacherData);

        setTeachers((prev) => [
          ...prev,
          newTeacher,
        ]);

        alert("Teacher added successfully!");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Failed to save teacher:", error);
      alert("Failed to save teacher.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Teacher
  const deleteTeacher = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {
      await deleteTeacherApi(id);

      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== id)
      );

      alert("Teacher deleted successfully!");
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      alert("Failed to delete teacher.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Teachers
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all teachers in the school
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          <Plus size={20} />
          Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Computer">Computer</option>
          </select>
        </div>
      </div>

      {/* Teacher Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Teacher
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Subject
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Class
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Experience
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-slate-400"
                  >
                    Loading teachers...
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                          {teacher.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-slate-800">
                            {teacher.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {teacher.subject}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-sm">
                        {teacher.assignedClass}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {teacher.experience} years
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          teacher.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/teachers/${teacher.id}`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                        >
                          <Eye size={18} />
                        </Link>

                        <button
                          onClick={() =>
                            openEditModal(teacher)
                          }
                          className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            teacher.id &&
                            deleteTeacher(teacher.id)
                          }
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
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

          {!loading && filteredTeachers.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              No teachers found.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingTeacher
                    ? "Edit Teacher"
                    : "Add Teacher"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingTeacher
                    ? "Update teacher information"
                    : "Add a new teacher"}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <FormInput
                label="Teacher Name *"
                value={form.name}
                onChange={(value) =>
                  setForm({
                    ...form,
                    name: value,
                  })
                }
              />

              <FormInput
                label="Email *"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm({
                    ...form,
                    email: value,
                  })
                }
              />

              <FormInput
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  setForm({
                    ...form,
                    phone: value,
                  })
                }
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>

                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">
                    Select Subject
                  </option>

                  <option value="Mathematics">
                    Mathematics
                  </option>

                  <option value="Science">
                    Science
                  </option>

                  <option value="English">
                    English
                  </option>

                  <option value="Gujarati">
                    Gujarati
                  </option>

                  <option value="Computer">
                    Computer
                  </option>
                </select>
              </div>

              <FormInput
                label="Qualification"
                value={form.qualification}
                onChange={(value) =>
                  setForm({
                    ...form,
                    qualification: value,
                  })
                }
              />

              <FormInput
                label="Experience (Years)"
                type="number"
                value={form.experience}
                onChange={(value) =>
                  setForm({
                    ...form,
                    experience: value,
                  })
                }
              />

              <FormInput
                label="Assigned Class *"
                value={form.assignedClass}
                onChange={(value) =>
                  setForm({
                    ...form,
                    assignedClass: value,
                  })
                }
                placeholder="Example: 10-A"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Joining Date
                </label>

                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      joiningDate: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  <GraduationCap size={18} />

                  {saving
                    ? "Saving..."
                    : editingTeacher
                      ? "Update Teacher"
                      : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
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
        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
}