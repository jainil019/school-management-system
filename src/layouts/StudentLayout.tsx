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
  const navigate = useNavigate();

  const notices = JSON.parse(localStorage.getItem("school_notices") || "[]");

  const notificationCount = notices.filter(
    (n: { audience: string }) =>
      n.audience === "All" || n.audience === "Students",
  ).length;

  const logout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <GraduationCap size={22} />
          </div>

          <div>
            <h1 className="font-bold">Student Portal</h1>
            <p className="text-xs text-slate-400">School Management</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
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
                <Icon size={18} />

                <span>{item.name}</span>

                {item.name === "Notices" && notificationCount > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="w-full md:ml-64 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Student Portal</h2>

            <p className="text-xs text-slate-500">
              Manage your school activities
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            S
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
