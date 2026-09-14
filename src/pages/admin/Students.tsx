import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
} from "lucide-react";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent as deleteStudentApi,
  type Student,
} from "../../services/studentService";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] =
    useState<Student | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    className: "",
    division: "",
    rollNo: "",
    gender: "Male",
  });

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await getStudents();

      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
      alert("Failed to load students from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue);

    const matchesClass =
      classFilter === "All" ||
      student.className === classFilter;

    return matchesSearch && matchesClass;
  });

  const openAddModal = () => {
    setEditingStudent(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      className: "",
      division: "",
      rollNo: "",
      gender: "Male",
    });

    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);

    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      className: student.className,
      division: student.division,
      rollNo: student.rollNo.toString(),
      gender: student.gender,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.className) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const studentData: Student = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        className: form.className,
        division: form.division,
        rollNo: Number(form.rollNo),
        gender: form.gender,
        status: "Active",
      };

      if (editingStudent?.id) {
        const updatedStudent = await updateStudent(
          editingStudent.id,
          studentData
        );

        setStudents((prev) =>
          prev.map((student) =>
            student.id === editingStudent.id
              ? updatedStudent
              : student
          )
        );

        alert("Student updated successfully!");
      } else {
        const newStudent = await createStudent(studentData);

        setStudents((prev) => [...prev, newStudent]);

        alert("Student added successfully!");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Failed to save student:", error);
      alert("Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await deleteStudentApi(id);

      setStudents((prev) =>
        prev.filter((student) => student.id !== id)
      );

      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Students
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Manage all students in the school
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Class */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">All Classes</option>
            <option value="10">Class 10</option>
            <option value="9">Class 9</option>
            <option value="8">Class 8</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">
                  Student
                </th>

                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">
                  Class
                </th>

                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">
                  Roll No
                </th>

                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">
                  Phone
                </th>

                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="text-right px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">
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
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    {/* Student */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                          {student.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base text-slate-800 truncate max-w-[220px]">
                            {student.name}
                          </p>

                          <p className="text-xs text-slate-400 truncate max-w-[220px]">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">
                      {student.className}-{student.division}
                    </td>

                    {/* Roll */}
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">
                      {student.rollNo}
                    </td>

                    {/* Phone */}
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">
                      {student.phone}
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-end gap-1.5 sm:gap-2">
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>

                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            student.id &&
                            deleteStudent(student.id)
                          }
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-slate-400"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile scroll hint */}
        {!loading && filteredStudents.length > 0 && (
          <div className="sm:hidden px-4 py-2 text-[11px] text-slate-400 border-t bg-slate-50">
            Swipe left/right to see all student details →
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl shadow-xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b bg-white">
              <h2 className="text-lg sm:text-xl font-bold">
                {editingStudent
                  ? "Edit Student"
                  : "Add Student"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              <input
                placeholder="Student Name *"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={form.className}
                onChange={(e) =>
                  setForm({
                    ...form,
                    className: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="">Select Class *</option>
                <option value="10">Class 10</option>
                <option value="9">Class 9</option>
                <option value="8">Class 8</option>
              </select>

              <input
                placeholder="Division"
                value={form.division}
                onChange={(e) =>
                  setForm({
                    ...form,
                    division: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="number"
                placeholder="Roll Number"
                value={form.rollNo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rollNo: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {/* Buttons */}
              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t sm:border-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
                >
                  {saving
                    ? "Saving..."
                    : editingStudent
                      ? "Update Student"
                      : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl sm:text-2xl font-bold">
                  {viewingStudent.name.charAt(0)}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mt-4 break-words">
                  {viewingStudent.name}
                </h2>
              </div>

              <button
                onClick={() => setViewingStudent(null)}
                className="p-2 hover:bg-slate-100 rounded-lg shrink-0"
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm break-words">
              <p>
                <strong>Email:</strong>{" "}
                {viewingStudent.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {viewingStudent.phone}
              </p>

              <p>
                <strong>Class:</strong>{" "}
                {viewingStudent.className}-
                {viewingStudent.division}
              </p>

              <p>
                <strong>Roll No:</strong>{" "}
                {viewingStudent.rollNo}
              </p>

              <p>
                <strong>Gender:</strong>{" "}
                {viewingStudent.gender}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {viewingStudent.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}