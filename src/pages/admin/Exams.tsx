import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CalendarDays,
  BookOpen,
  X,
  Save,
} from "lucide-react";

import { getClasses, type ClassData } from "../../services/classService";
import {
  getSubjects,
  type Subject,
} from "../../services/subjectService";
import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  type Exam,
} from "../../services/examService";

export default function Exams() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [form, setForm] = useState({
    name: "",
    classId: "",
    subjectId: "",
    examDate: "",
    totalMarks: "100",
    passingMarks: "35",
    academicYear: "2026-27",
    status: "Scheduled" as "Scheduled" | "Completed",
  });

  /* =========================
     Load Data
  ========================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [classesData, subjectsData, examsData] =
        await Promise.all([
          getClasses(),
          getSubjects(),
          getExams(),
        ]);

      setClasses(classesData);
      setSubjects(subjectsData);
      setExams(examsData);
    } catch (error) {
      console.error("Failed to load exam data:", error);
      alert("Failed to load exam data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     Helpers
  ========================= */

  const getClassName = (classId: string) => {
    const classData = classes.find(
      (item) => String(item.id) === String(classId)
    );

    if (!classData) return "Unknown";

    return `${classData.className}-${classData.division}`;
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(
      (item) => String(item.id) === String(subjectId)
    );

    return subject ? subject.name : "Unknown";
  };

  /* =========================
     Filtering
  ========================= */

  const filteredExams = exams.filter((exam) => {
    const text = search.toLowerCase();

    const matchesSearch =
      exam.name.toLowerCase().includes(text) ||
      getClassName(exam.classId)
        .toLowerCase()
        .includes(text) ||
      getSubjectName(exam.subjectId)
        .toLowerCase()
        .includes(text);

    const matchesStatus =
      statusFilter === "All" ||
      exam.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* =========================
     Add Modal
  ========================= */

  const openAddModal = () => {
    setEditingExam(null);

    setForm({
      name: "",
      classId: classes.length
        ? String(classes[0].id)
        : "",
      subjectId: subjects.length
        ? String(subjects[0].id)
        : "",
      examDate: "",
      totalMarks: "100",
      passingMarks: "35",
      academicYear: "2026-27",
      status: "Scheduled",
    });

    setIsModalOpen(true);
  };

  /* =========================
     Edit Modal
  ========================= */

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);

    setForm({
      name: exam.name,
      classId: String(exam.classId),
      subjectId: String(exam.subjectId),
      examDate: exam.examDate,
      totalMarks: String(exam.totalMarks),
      passingMarks: String(exam.passingMarks),
      academicYear: exam.academicYear,
      status: exam.status,
    });

    setIsModalOpen(true);
  };

  /* =========================
     Save Exam
  ========================= */

  const handleSave = async () => {
    if (
      !form.name.trim() ||
      !form.classId ||
      !form.subjectId ||
      !form.examDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const totalMarks = Number(form.totalMarks);
    const passingMarks = Number(form.passingMarks);

    if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
      alert("Total marks must be greater than 0.");
      return;
    }

    if (
      !Number.isFinite(passingMarks) ||
      passingMarks < 0 ||
      passingMarks > totalMarks
    ) {
      alert(
        "Passing marks must be between 0 and total marks."
      );
      return;
    }

    try {
      setSaving(true);

      const examData = {
        name: form.name.trim(),
        classId: form.classId,
        subjectId: form.subjectId,
        examDate: form.examDate,
        totalMarks,
        passingMarks,
        academicYear: form.academicYear.trim(),
        status: form.status,
      };

      if (editingExam?.id) {
        const updatedExam = await updateExam(
          editingExam.id,
          examData
        );

        setExams((prev) =>
          prev.map((exam) =>
            exam.id === editingExam.id
              ? updatedExam
              : exam
          )
        );
      } else {
        const newExam = await createExam(examData);

        setExams((prev) => [...prev, newExam]);
      }

      setIsModalOpen(false);
      setEditingExam(null);
    } catch (error) {
      console.error("Failed to save exam:", error);
      alert("Failed to save exam.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     Delete Exam
  ========================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmed) return;

    try {
      await deleteExam(id);

      setExams((prev) =>
        prev.filter((exam) => exam.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete exam:", error);
      alert("Failed to delete exam.");
    }
  };

  /* =========================
     Summary
  ========================= */

  const scheduledCount = exams.filter(
    (exam) => exam.status === "Scheduled"
  ).length;

  const completedCount = exams.filter(
    (exam) => exam.status === "Completed"
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Exams
          </h1>

          <p className="text-slate-500 mt-1">
            Create and manage school examinations
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={loading || classes.length === 0 || subjects.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={19} />
          Create Exam
        </button>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Total Exams"
          value={exams.length}
        />

        <SummaryCard
          icon={<CalendarDays size={22} />}
          title="Scheduled"
          value={scheduledCount}
        />

        <SummaryCard
          icon={<BookOpen size={22} />}
          title="Completed"
          value={completedCount}
        />

      </div>

      {/* Search + Filter */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search exam, class or subject..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>

        </div>

      </div>

      {/* Loading */}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">
          <p className="text-slate-500">
            Loading exams...
          </p>
        </div>
      ) : (
        <>
          {/* Exam Table */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Exam
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Class
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Subject
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Marks
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Passing
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

                  {filteredExams.map((exam) => (

                    <tr
                      key={exam.id}
                      className="hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <BookOpen size={19} />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {exam.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {exam.academicYear}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        Class {getClassName(exam.classId)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {getSubjectName(exam.subjectId)}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-700">

                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

                          {exam.examDate}

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {exam.totalMarks}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {exam.passingMarks}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            exam.status === "Scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {exam.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditModal(exam)
                            }
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() =>
                              exam.id &&
                              handleDelete(exam.id)
                            }
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
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

            </div>

            {filteredExams.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No exams found.
              </div>
            )}

          </div>
        </>
      )}

      {/* Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingExam
                    ? "Edit Exam"
                    : "Create Exam"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Set up examination details
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

              {/* Exam Name */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Exam Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Unit Test 1"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

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
                      Class {item.className}-{item.division}
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
                      {subject.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* Exam Date */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Exam Date
                </label>

                <input
                  type="date"
                  value={form.examDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      examDate: e.target.value,
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
                      academicYear: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Marks */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Marks
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.totalMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      totalMarks: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Passing Marks */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Passing Marks
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.passingMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      passingMarks: e.target.value,
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
                          | "Scheduled"
                          | "Completed",
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Completed">
                    Completed
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
                  : editingExam
                    ? "Save Changes"
                    : "Create Exam"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================
   Summary Card
========================= */

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