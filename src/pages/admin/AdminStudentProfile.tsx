import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Wallet,
  Save,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  className: string;
  division: string;
  rollNo: number;
  gender: string;
  status: "Active" | "Inactive";
}

export default function AdminStudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    className: "",
    division: "",
    rollNo: "",
    gender: "",
  });

  // Load student
  useEffect(() => {
    const savedStudents = localStorage.getItem("school_students");

    if (!savedStudents) return;

    try {
      const students: Student[] = JSON.parse(savedStudents);

      const foundStudent = students.find(
        (item) => item.id === Number(id),
      );

      setStudent(foundStudent || null);

      if (foundStudent) {
        setForm({
          name: foundStudent.name,
          email: foundStudent.email,
          phone: foundStudent.phone,
          className: foundStudent.className,
          division: foundStudent.division,
          rollNo: String(foundStudent.rollNo),
          gender: foundStudent.gender,
        });
      }
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  }, [id]);

  // Update student
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) return;

    if (!form.name || !form.email || !form.className) {
      alert("Please fill all required fields.");
      return;
    }

    const savedStudents = localStorage.getItem("school_students");

    if (!savedStudents) return;

    try {
      const students: Student[] = JSON.parse(savedStudents);

      const updatedStudents = students.map((item) =>
        item.id === student.id
          ? {
              ...item,
              name: form.name,
              email: form.email,
              phone: form.phone,
              className: form.className,
              division: form.division,
              rollNo: Number(form.rollNo),
              gender: form.gender,
            }
          : item,
      );

      localStorage.setItem(
        "school_students",
        JSON.stringify(updatedStudents),
      );

      const updatedStudent = updatedStudents.find(
        (item) => item.id === student.id,
      );

      if (updatedStudent) {
        setStudent(updatedStudent);

        setForm({
          name: updatedStudent.name,
          email: updatedStudent.email,
          phone: updatedStudent.phone,
          className: updatedStudent.className,
          division: updatedStudent.division,
          rollNo: String(updatedStudent.rollNo),
          gender: updatedStudent.gender,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update student:", error);
      alert("Something went wrong while updating the student.");
    }
  };

  // Student not found
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-800">
          Student Not Found
        </h2>

        <button
          onClick={() => navigate("/admin/students")}
          className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/students")}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Students
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold">
              {student.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  {student.name}
                </h1>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === "Active"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <p className="text-slate-500 mt-1">
                Student ID: STU-{String(student.id).slice(-4)}
              </p>

              <div className="flex items-center gap-2 mt-2 text-slate-500">
                <GraduationCap size={17} />

                Class {student.className}-{student.division}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Edit size={18} />
            Edit Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        {/* Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CalendarCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Attendance
              </p>

              <h2 className="text-2xl font-bold">
                92%
              </h2>
            </div>
          </div>
        </div>

        {/* Marks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <GraduationCap size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Average Marks
              </p>

              <h2 className="text-2xl font-bold">
                85%
              </h2>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Wallet size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending Fees
              </p>

              <h2 className="text-2xl font-bold">
                ₹10,000
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            <InfoItem
              icon={<Mail size={18} />}
              label="Email"
              value={student.email}
            />

            <InfoItem
              icon={<Phone size={18} />}
              label="Phone"
              value={student.phone}
            />

            <InfoItem
              icon={<GraduationCap size={18} />}
              label="Gender"
              value={student.gender}
            />

            <InfoItem
              icon={<GraduationCap size={18} />}
              label="Roll Number"
              value={String(student.rollNo)}
            />

            <InfoItem
              icon={<MapPin size={18} />}
              label="Address"
              value="Rajkot, Gujarat"
            />

            <InfoItem
              icon={<GraduationCap size={18} />}
              label="Class"
              value={`${student.className}-${student.division}`}
            />
          </div>
        </div>

        {/* Academic Performance */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Academic Performance
          </h2>

          <div className="mt-6 space-y-5">
            <Subject
              name="Mathematics"
              marks={85}
            />

            <Subject
              name="Science"
              marks={91}
            />

            <Subject
              name="English"
              marks={78}
            />

            <Subject
              name="Social Science"
              marks={88}
            />
          </div>
        </div>
      </div>

      {/* Attendance + Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-xl font-bold">
            Attendance
          </h2>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">
                Overall Attendance
              </span>

              <span className="font-semibold">
                92%
              </span>
            </div>

            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "92%" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-600">
                  Present
                </p>

                <p className="text-2xl font-bold text-green-700">
                  175
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-red-600">
                  Absent
                </p>

                <p className="text-2xl font-bold text-red-700">
                  15
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-xl font-bold">
            Fee Summary
          </h2>

          <div className="mt-6 space-y-4">
            <FeeRow
              label="Total Fees"
              value="₹50,000"
            />

            <FeeRow
              label="Paid"
              value="₹40,000"
            />

            <FeeRow
              label="Pending"
              value="₹10,000"
            />

            <div className="h-px bg-slate-100" />

            <div className="flex justify-between font-bold">
              <span>
                Payment Status
              </span>

              <span className="text-orange-500">
                Partially Paid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* EDIT STUDENT MODAL */}
      {/* ================================================= */}

      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Student
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update student information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleUpdate}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class *
                </label>

                <select
                  value={form.className}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      className: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">
                    Select Class
                  </option>

                  <option value="10">
                    Class 10
                  </option>

                  <option value="9">
                    Class 9
                  </option>

                  <option value="8">
                    Class 8
                  </option>

                  <option value="7">
                    Class 7
                  </option>

                  <option value="6">
                    Class 6
                  </option>
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Division
                </label>

                <input
                  type="text"
                  value={form.division}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      division: e.target.value,
                    })
                  }
                  placeholder="A"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roll Number
                </label>

                <input
                  type="number"
                  value={form.rollNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rollNo: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>

                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      gender: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* INFO ITEM */
/* ================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        {icon}

        <span className="text-xs uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* SUBJECT */
/* ================================================= */

function Subject({
  name,
  marks,
}: {
  name: string;
  marks: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">
          {name}
        </span>

        <span className="font-semibold">
          {marks}%
        </span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${marks}%` }}
        />
      </div>
    </div>
  );
}

/* ================================================= */
/* FEE ROW */
/* ================================================= */

function FeeRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}