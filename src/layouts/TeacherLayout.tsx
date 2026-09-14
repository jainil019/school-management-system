import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  ClipboardList,
  CalendarCheck,
  BookOpen,
  CalendarDays,
  Megaphone,
  LogOut,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    path: "/teacher",
    icon: LayoutDashboard,
  },
  {
    name: "My Profile",
    path: "/teacher/profile",
    icon: User,
  },
  {
    name: "My Classes",
    path: "/teacher/classes",
    icon: Users,
  },
  {
    name: "Assignments",
    path: "/teacher/assignments",
    icon: ClipboardList,
  },
  {
    name: "Attendance",
    path: "/teacher/attendance",
    icon: CalendarCheck,
  },
  {
    name: "Homework",
    path: "/teacher/homework",
    icon: BookOpen,
  },
  {
    name: "Timetable",
    path: "/teacher/timetable",
    icon: CalendarDays,
  },
  {
    name: "Notices",
    path: "/teacher/notices",
    icon: Megaphone,
  },
];

function TeacherLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("school_role");
    localStorage.removeItem("school_current_teacher_id");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">
            School Management
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Teacher Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/teacher"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={19} />

            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <div>
            <h2 className="font-bold text-slate-900">
              Teacher Portal
            </h2>

            <p className="text-xs text-slate-500">
              School Management System
            </p>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;