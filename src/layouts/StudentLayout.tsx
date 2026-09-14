import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  FileText,
  GraduationCap,
  Home,
  IndianRupee,
  LogOut,
  Megaphone,
  User,
  Menu,
  X,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    path: "/student",
    icon: Home,
  },
  {
    name: "My Profile",
    path: "/student/profile",
    icon: User,
  },
  {
    name: "Attendance",
    path: "/student/attendance",
    icon: CheckCircle,
  },
  {
    name: "Results",
    path: "/student/results",
    icon: FileText,
  },
  {
    name: "Homework",
    path: "/student/homework",
    icon: BookOpen,
  },
  {
    name: "Timetable",
    path: "/student/timetable",
    icon: CalendarDays,
  },
  {
    name: "Fees",
    path: "/student/fees",
    icon: IndianRupee,
  },
  {
    name: "Notices",
    path: "/student/notices",
    icon: Megaphone,
  },
];

function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const notices = JSON.parse(
    localStorage.getItem("school_notices") || "[]",
  );

  const notificationCount = notices.filter(
    (n: { audience: string }) =>
      n.audience === "All" || n.audience === "Students",
  ).length;

  const logout = () => {
    localStorage.removeItem("school_role");
    localStorage.removeItem("school_current_student_id");
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-slate-950 text-white flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="h-20 shrink-0 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="font-bold truncate">Student Portal</h1>
            <p className="text-xs text-slate-400 truncate">
              School Management
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/student"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />

                <span className="truncate">{item.name}</span>

                {item.name === "Notices" && notificationCount > 0 && (
                  <span className="ml-auto shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={18} />
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-slate-950 text-white transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo */}
        <div className="h-20 shrink-0 flex items-center justify-between gap-3 px-5 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <GraduationCap size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="font-bold truncate">Student Portal</h1>
              <p className="text-xs text-slate-400 truncate">
                School Management
              </p>
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

        {/* Mobile Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/student"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />

                <span>{item.name}</span>

                {item.name === "Notices" && notificationCount > 0 && (
                  <span className="ml-auto shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="w-full min-w-0 md:ml-64 min-h-screen">
        {/* Header */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0 px-2 md:px-0">
            <h2 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
              Student Portal
            </h2>

            <p className="hidden sm:block text-xs text-slate-500 truncate">
              Manage your school activities
            </p>
          </div>

          {/* Profile */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm sm:text-base">
            S
          </div>
        </header>

        {/* Page Content */}
        <div className="w-full min-w-0 overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;