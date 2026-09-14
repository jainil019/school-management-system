import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Save,
  Users,
  X,
  BookOpen,
  Award,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: number;
  assignedClass: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}

export default function AdminTeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: "",
    assignedClass: "",
    joiningDate: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Load teacher
  useEffect(() => {
    const savedTeachers = localStorage.getItem("school_teachers");

    if (!savedTeachers) {
      return;
    }

    const teachers: Teacher[] = JSON.parse(savedTeachers);

    const foundTeacher = teachers.find(
      (item) => item.id === Number(id)
    );

    if (foundTeacher) {
      setTeacher(foundTeacher);

      setForm({
        name: foundTeacher.name,
        email: foundTeacher.email,
        phone: foundTeacher.phone,
        subject: foundTeacher.subject,
        qualification: foundTeacher.qualification,
        experience: String(foundTeacher.experience),
        assignedClass: foundTeacher.assignedClass,
        joiningDate: foundTeacher.joiningDate,
        status: foundTeacher.status,
      });
    }
  }, [id]);

  // Update teacher
  const handleUpdate = () => {
    if (!teacher) return;

    const updatedTeacher: Teacher = {
      ...teacher,
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      qualification: form.qualification,
      experience: Number(form.experience),
      assignedClass: form.assignedClass,
      joiningDate: form.joiningDate,
      status: form.status,
    };

    const savedTeachers = localStorage.getItem("school_teachers");

    if (savedTeachers) {
      const teachers: Teacher[] = JSON.parse(savedTeachers);

      const updatedTeachers = teachers.map((item) =>
        item.id === teacher.id ? updatedTeacher : item
      );

      localStorage.setItem(
        "school_teachers",
        JSON.stringify(updatedTeachers)
      );
    }

    setTeacher(updatedTeacher);
    setIsEditing(false);
  };

  if (!teacher) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <GraduationCap className="text-slate-400" size={32} />
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          Teacher Not Found
        </h2>

        <p className="text-slate-500 mt-2">
          The teacher you are looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/admin/teachers")}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/teachers")}
        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft size={19} />
        Back to Teachers
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

            <div className="flex items-end gap-5 -mt-12">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center">
                  <GraduationCap
                    size={42}
                    className="text-blue-600"
                  />
                </div>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {teacher.name}
                  </h1>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      teacher.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>

                <p className="text-slate-500 mt-1">
                  {teacher.subject} Teacher
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Edit size={18} />
              Edit Teacher
            </button>

          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          icon={<BookOpen size={22} />}
          title="Subject"
          value={teacher.subject}
        />

        <StatCard
          icon={<Users size={22} />}
          title="Assigned Class"
          value={teacher.assignedClass}
        />

        <StatCard
          icon={<Award size={22} />}
          title="Experience"
          value={`${teacher.experience} Years`}
        />

        <StatCard
          icon={<CalendarDays size={22} />}
          title="Joining Date"
          value={teacher.joiningDate}
        />

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Teacher Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InfoItem
              icon={<Mail size={18} />}
              label="Email Address"
              value={teacher.email}
            />

            <InfoItem
              icon={<Phone size={18} />}
              label="Phone Number"
              value={teacher.phone}
            />

            <InfoItem
              icon={<GraduationCap size={18} />}
              label="Qualification"
              value={teacher.qualification}
            />

            <InfoItem
              icon={<BookOpen size={18} />}
              label="Subject"
              value={teacher.subject}
            />

            <InfoItem
              icon={<Users size={18} />}
              label="Assigned Class"
              value={teacher.assignedClass}
            />

            <InfoItem
              icon={<CalendarDays size={18} />}
              label="Joining Date"
              value={teacher.joiningDate}
            />

            <InfoItem
              icon={<Award size={18} />}
              label="Experience"
              value={`${teacher.experience} years`}
            />

            <InfoItem
              icon={<MapPin size={18} />}
              label="Teacher ID"
              value={`TCH-${String(teacher.id).padStart(4, "0")}`}
            />

          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-lg font-bold text-slate-900">
            Attendance
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Current academic year
          </p>

          <div className="flex justify-center py-7">
            <div className="relative w-36 h-36">

              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset="25"
                  className="text-blue-600"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">
                  92%
                </span>

                <span className="text-xs text-slate-500">
                  Attendance
                </span>
              </div>

            </div>
          </div>

          <div className="space-y-3">

            <ProgressRow
              label="Present"
              value="92%"
            />

            <ProgressRow
              label="Leave"
              value="5%"
            />

            <ProgressRow
              label="Absent"
              value="3%"
            />

          </div>
        </div>
      </div>

      {/* Teaching Performance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h2 className="text-lg font-bold text-slate-900">
          Teaching Performance
        </h2>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Academic performance overview
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <PerformanceCard
            title="Student Performance"
            value="88%"
            description="Average student result"
          />

          <PerformanceCard
            title="Attendance"
            value="92%"
            description="Teacher attendance"
          />

          <PerformanceCard
            title="Classes Completed"
            value="96%"
            description="Scheduled classes"
          />

        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Teacher
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update teacher information
                </p>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormInput
                label="Full Name"
                value={form.name}
                onChange={(value) =>
                  setForm({ ...form, name: value })
                }
              />

              <FormInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm({ ...form, email: value })
                }
              />

              <FormInput
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  setForm({ ...form, phone: value })
                }
              />

              <FormInput
                label="Subject"
                value={form.subject}
                onChange={(value) =>
                  setForm({ ...form, subject: value })
                }
              />

              <FormInput
                label="Qualification"
                value={form.qualification}
                onChange={(value) =>
                  setForm({ ...form, qualification: value })
                }
              />

              <FormInput
                label="Experience (Years)"
                type="number"
                value={form.experience}
                onChange={(value) =>
                  setForm({ ...form, experience: value })
                }
              />

              <FormInput
                label="Assigned Class"
                value={form.assignedClass}
                onChange={(value) =>
                  setForm({ ...form, assignedClass: value })
                }
              />

              <FormInput
                label="Joining Date"
                type="date"
                value={form.joiningDate}
                onChange={(value) =>
                  setForm({ ...form, joiningDate: value })
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">

              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Save size={18} />
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <p className="text-sm text-slate-500 mt-4">
        {title}
      </p>

      <p className="text-lg font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  );
}

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
    <div className="flex items-start gap-3">

      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-800 mt-1">
          {value}
        </p>
      </div>

    </div>
  );
}

function ProgressRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const width = value;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">
          {label}
        </span>

        <span className="font-semibold text-slate-800">
          {value}
        </span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function PerformanceCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <div className="flex items-end gap-2 mt-2">
        <span className="text-3xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}