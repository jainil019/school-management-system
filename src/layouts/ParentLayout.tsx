import { useState } from "react";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  Award,
  Wallet,
  BookOpen,
  CalendarDays,
  Megaphone,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/parent", icon: LayoutDashboard },
  { name: "Student Profile", path: "/parent/profile", icon: User },
  { name: "Attendance", path: "/parent/attendance", icon: CalendarCheck },
  { name: "Results", path: "/parent/results", icon: Award },
  { name: "Fees", path: "/parent/fees", icon: Wallet },
  { name: "Homework", path: "/parent/homework", icon: BookOpen },
  { name: "Timetable", path: "/parent/timetable", icon: CalendarDays },
  { name: "Notices", path: "/parent/notices", icon: Megaphone },
];

export default function ParentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("school_role");
    localStorage.removeItem("school_parent_student_id");
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-slate-950 text-white flex-col">
        <div className="h-20 shrink-0 border-b border-slate-800 px-6 flex items-center">
          <div>
            <h1 className="text-xl font-bold">School Portal</h1>
            <p className="text-sm text-slate-400">Parent Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 p-4">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/parent"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
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
        className={`fixed left-0 top-0 bottom-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-slate-950 text-white transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div>
            <h1 className="text-xl font-bold">School Portal</h1>
            <p className="text-sm text-slate-400">Parent Panel</p>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="rounded-lg p-2 hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 p-4">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/parent"}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile Logout */}
        <div className="shrink-0 border-t border-slate-800 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 sm:h-20 items-center justify-between border-b bg-white px-3 sm:px-4 lg:px-8">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 active:bg-slate-200 transition lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Title */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold">Parent Portal</h2>
          </div>

          {/* Mobile Title */}
          <div className="flex-1 px-2 lg:hidden">
            <h2 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              Parent Portal
            </h2>
          </div>

          {/* Profile */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 sm:h-10 sm:w-10">
            P
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