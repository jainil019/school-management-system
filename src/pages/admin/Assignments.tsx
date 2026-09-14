import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import {
  getClasses,
  type ClassData,
} from "../../services/classService";

import {
  getSubjects,
  type Subject,
} from "../../services/subjectService";

import {
  getTeachers,
  type Teacher,
} from "../../services/teacherService";

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  type Assignment,
} from "../../services/assignmentService";

export default function Assignments() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    weeklyPeriods: "5",
    academicYear: "2026-27",
    status: "Active" as "Active" | "Inactive",
  });

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        classesData,
        subjectsData,
        teachersData,
        assignmentsData,
      ] = await Promise.all([
        getClasses(),
        getSubjects(),
        getTeachers(),
        getAssignments(),
      ]);

      setClasses(classesData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Failed to load assignment data:", error);
      alert("Failed to load assignment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // HELPERS
  // ==========================================

  const getClassName = (classId: string) => {
    const item = classes.find(
      (classItem) => String(classItem.id) === String(classId)
    );

    if (!item) return "Unknown Class";

    return `${item.className}-${item.division}`;
  };

  const getSubjectName = (subjectId: string) => {
    const item = subjects.find(
      (subject) => String(subject.id) === String(subjectId)
    );

    return item ? item.name : "Unknown Subject";
  };

  const getTeacherName = (teacherId: string) => {
    const item = teachers.find(
      (teacher) => String(teacher.id) === String(teacherId)
    );

    return item ? item.name : "Unknown Teacher";
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredAssignments = assignments.filter(
    (assignment) => {
      const text = search.toLowerCase();

      return (
        getClassName(assignment.classId)
          .toLowerCase()
          .includes(text) ||
        getSubjectName(assignment.subjectId)
          .toLowerCase()
          .includes(text) ||
        getTeacherName(assignment.teacherId)
          .toLowerCase()
          .includes(text)
      );
    }
  );

  // ==========================================
  // ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingAssignment(null);

    setForm({
      classId: classes.length
        ? String(classes[0].id)
        : "",

      subjectId: subjects.length
        ? String(subjects[0].id)
        : "",

      teacherId: teachers.length
        ? String(teachers[0].id)
        : "",

      weeklyPeriods: "5",
      academicYear: "2026-27",
      status: "Active",
    });

    setIsModalOpen(true);
  };

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const openEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment);

    setForm({
      classId: String(assignment.classId),
      subjectId: String(assignment.subjectId),
      teacherId: String(assignment.teacherId),
      weeklyPeriods: String(assignment.weeklyPeriods),
      academicYear: assignment.academicYear,
      status: assignment.status,
    });

    setIsModalOpen(true);
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = async () => {
    if (
      !form.classId ||
      !form.subjectId ||
      !form.teacherId
    ) {
      alert("Please select class, subject and teacher.");
      return;
    }

    const weeklyPeriods =
      Number(form.weeklyPeriods);

    if (
      !Number.isFinite(weeklyPeriods) ||
      weeklyPeriods < 1
    ) {
      alert("Weekly periods must be at least 1.");
      return;
    }

    // Check duplicate subject for same class
    const duplicate = assignments.some(
      (assignment) =>
        String(assignment.classId) === String(form.classId) &&
        String(assignment.subjectId) === String(form.subjectId) &&
        assignment.id !== editingAssignment?.id
    );

    if (duplicate) {
      alert(
        "This subject is already assigned to this class."
      );
      return;
    }

    const assignmentData: Assignment = {
      classId: form.classId,
      subjectId: form.subjectId,
      teacherId: form.teacherId,
      weeklyPeriods,
      academicYear: form.academicYear,
      status: form.status,
    };

    try {
      setSaving(true);

      if (editingAssignment?.id) {
        const updatedAssignment =
          await updateAssignment(
            editingAssignment.id,
            assignmentData
          );

        setAssignments((prev) =>
          prev.map((assignment) =>
            assignment.id === editingAssignment.id
              ? updatedAssignment
              : assignment
          )
        );
      } else {
        const newAssignment =
          await createAssignment(
            assignmentData
          );

        setAssignments((prev) => [
          ...prev,
          newAssignment,
        ]);
      }

      setIsModalOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error(
        "Failed to save assignment:",
        error
      );

      alert(
        "Failed to save assignment. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      await deleteAssignment(id);

      setAssignments((prev) =>
        prev.filter(
          (assignment) => assignment.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete assignment:",
        error
      );

      alert(
        "Failed to delete assignment. Please try again."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Class Assignments
          </h1>

          <p className="text-slate-500 mt-1">
            Assign teachers and subjects to classes
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={
            classes.length === 0 ||
            subjects.length === 0 ||
            teachers.length === 0
          }
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={19} />
          New Assignment
        </button>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <SummaryCard
          icon={<Users size={22} />}
          title="Assignments"
          value={assignments.length}
        />

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Subjects"
          value={subjects.length}
        />

        <SummaryCard
          icon={<GraduationCap size={22} />}
          title="Teachers"
          value={teachers.length}
        />

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="relative max-w-lg">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search class, subject or teacher..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Assignment Table */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Class
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Subject
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Teacher
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Weekly Periods
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

              {filteredAssignments.map(
                (assignment) => (

                  <tr
                    key={assignment.id}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Class */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {getClassName(
                            assignment.classId
                          ).split("-")[0]}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            Class{" "}
                            {getClassName(
                              assignment.classId
                            )}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Subject */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <BookOpen
                          size={17}
                          className="text-blue-600"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          {getSubjectName(
                            assignment.subjectId
                          )}
                        </span>

                      </div>

                    </td>

                    {/* Teacher */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <GraduationCap
                          size={18}
                          className="text-indigo-600"
                        />

                        <span className="text-sm text-slate-700">
                          {getTeacherName(
                            assignment.teacherId
                          )}
                        </span>

                      </div>

                    </td>

                    {/* Weekly Periods */}

                    <td className="px-6 py-4">

                      <span className="text-sm font-semibold text-slate-700">
                        {assignment.weeklyPeriods}
                      </span>

                    </td>

                    {/* Academic Year */}

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {assignment.academicYear}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          assignment.status ===
                          "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {assignment.status}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditModal(
                              assignment
                            )
                          }
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            assignment.id &&
                            handleDelete(
                              assignment.id
                            )
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {filteredAssignments.length === 0 && (
          <div className="py-12 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <BookOpen
                size={25}
                className="text-slate-400"
              />
            </div>

            <p className="font-medium text-slate-700">
              No assignments found
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Create your first class assignment.
            </p>

          </div>
        )}

      </div>

      {/* Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingAssignment
                    ? "Edit Assignment"
                    : "New Assignment"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Connect a class, subject and teacher
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

            <div className="p-6 space-y-5">

              {/* Class */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class
                </label>

                <select
                  value={form.classId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      classId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Class
                  </option>

                  {classes.map((item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      Class {item.className}-
                      {item.division}
                    </option>

                  ))}

                </select>

              </div>

              {/* Subject */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>

                <select
                  value={form.subjectId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subjectId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Subject
                  </option>

                  {subjects.map((subject) => (

                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.name} ({subject.code})
                    </option>

                  ))}

                </select>

              </div>

              {/* Teacher */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teacher
                </label>

                <select
                  value={form.teacherId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      teacherId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Teacher
                  </option>

                  {teachers.map((teacher) => (

                    <option
                      key={teacher.id}
                      value={teacher.id}
                    >
                      {teacher.name} —{" "}
                      {teacher.subject}
                    </option>

                  ))}

                </select>

              </div>

              {/* Bottom fields */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Weekly Periods */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weekly Periods
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.weeklyPeriods}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        weeklyPeriods:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Academic Year */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Academic Year
                  </label>

                  <input
                    type="text"
                    value={form.academicYear}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        academicYear:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

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
                        status:
                          e.target.value as
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

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : editingAssignment
                  ? "Save Changes"
                  : "Create Assignment"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

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