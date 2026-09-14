import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Eye, X } from "lucide-react";
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
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    className: "",
    division: "",
    rollNo: "",
    gender: "Male",
  });

  // Load students from MongoDB
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

  // Search + Filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      classFilter === "All" || student.className === classFilter;

    return matchesSearch && matchesClass;
  });

  // Open Add Modal
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

  // Open Edit Modal
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

  // Save Student
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
        // Update MongoDB
        const updatedStudent = await updateStudent(
          editingStudent.id,
          studentData
        );

        setStudents((prev) =>
          prev.map((student) =>
            student.id === editingStudent.id ? updatedStudent : student
          )
        );

        alert("Student updated successfully!");
      } else {
        // Create in MongoDB
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

  // Delete Student
  const deleteStudent = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await deleteStudentApi(id);

      setStudents((prev) => prev.filter((student) => student.id !== id));

      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>

          <p className="text-slate-500 mt-1">
            Manage all students in the school
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Class */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Classes</option>
            <option value="10">Class 10</option>
            <option value="9">Class 9</option>
            <option value="8">Class 8</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Student
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Class
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Roll No
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Phone
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
                    Loading students...
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                          {student.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-slate-800">
                            {student.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.className}-{student.division}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.rollNo}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.phone}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                        >
                          <Eye size={18} />
                        </Link>

                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            student.id && deleteStudent(student.id)
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

          {!loading && filteredStudents.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              No students found.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingStudent ? "Edit Student" : "Add Student"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
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
                className="border rounded-xl px-4 py-3"
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
                className="border rounded-xl px-4 py-3"
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
                className="border rounded-xl px-4 py-3"
              />

              <select
                value={form.className}
                onChange={(e) =>
                  setForm({
                    ...form,
                    className: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3"
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
                className="border rounded-xl px-4 py-3"
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
                className="border rounded-xl px-4 py-3"
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50"
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

      {/* View Student */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  {viewingStudent.name.charAt(0)}
                </div>

                <h2 className="text-2xl font-bold mt-4">
                  {viewingStudent.name}
                </h2>
              </div>

              <button
                onClick={() => setViewingStudent(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <p>
                <strong>Email:</strong> {viewingStudent.email}
              </p>

              <p>
                <strong>Phone:</strong> {viewingStudent.phone}
              </p>

              <p>
                <strong>Class:</strong> {viewingStudent.className}-
                {viewingStudent.division}
              </p>

              <p>
                <strong>Roll No:</strong> {viewingStudent.rollNo}
              </p>

              <p>
                <strong>Gender:</strong> {viewingStudent.gender}
              </p>

              <p>
                <strong>Status:</strong> {viewingStudent.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}