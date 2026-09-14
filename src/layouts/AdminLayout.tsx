import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  Wallet,
  Bell,
  LogOut,
  Menu,
  BarChart3,
  Award,
  CalendarDays,
} from "lucide-react";
const handleLogout = () => {
  localStorage.removeItem("school_role");
  localStorage.removeItem("school_current_student_id");
  window.location.href = "/login";
};
const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    path: "/admin/students",
    icon: Users,
  },
  {
    name: "Teachers",
    path: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    name: "Classes",
    path: "/admin/classes",
    icon: School,
  },
  {
    name: "Subjects",
    path: "/admin/subjects",
    icon: BookOpen,
  },
  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    name: "Attendance Reports",
    path: "/admin/attendance-reports",
    icon: BarChart3,
  },
  {
    name: "Assignments",
    path: "/admin/assignments",
    icon: BookOpen,
  },
  {
    name: "Exams",
    path: "/admin/exams",
    icon: FileText,
  },
  {
    name: "Marks Entry",
    path: "/admin/marks",
    icon: Award,
  },
  {
    name: "Student Results",
    path: "/admin/results",
    icon: FileText,
  },
  {
    name: "Fees",
    path: "/admin/fees",
    icon: Wallet,
  },
  {
    name: "Homework",
    path: "/admin/homework",
    icon: BookOpen,
  },
  {
    name: "Timetable",
    path: "/admin/timetable",
    icon: CalendarDays,
  },
  {
    name: "Notices",
    path: "/admin/notices",
    icon: Bell,
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-950 text-white flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1 className="font-bold">School ERP</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }: { isActive: boolean }) => {
                  return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`;
                }}
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden p-2">
            <Menu />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">School Management System</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-slate-100">
              <Bell size={20} />
            </button>

            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
