import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
  X,
  BarChart3,
  Award,
  CalendarDays,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("school_role");
    localStorage.removeItem("school_current_student_id");
    localStorage.removeItem("school_current_teacher_id");
    localStorage.removeItem("school_parent_student_id");

    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-slate-950 text-white flex-col">
        <div className="h-20 shrink-0 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shrink-0">
            <GraduationCap size={24} />
          </div>

          <div className="min-w-0">
            <h1 className="font-bold truncate">School ERP</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-slate-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="h-20 shrink-0 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center min-w-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shrink-0">
              <GraduationCap size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="font-bold truncate">School ERP</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-slate-800 transition shrink-0"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        {/* Header */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Title */}
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              School Management System
            </p>
          </div>

          {/* Mobile Title */}
          <div className="lg:hidden flex-1 px-2">
            <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">
              School ERP
            </p>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-slate-100 transition"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base">
              A
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="w-full min-w-0 p-3 sm:p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}