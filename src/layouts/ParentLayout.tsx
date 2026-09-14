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
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("school_role");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-slate-950 text-white">
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-xl font-bold">School Portal</h1>
          <p className="text-sm text-slate-400">Parent Panel</p>
        </div>

        <nav className="space-y-1 p-4">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="flex-1">
        <header className="border-b bg-white px-8 py-5">
          <h2 className="text-xl font-semibold">Parent Portal</h2>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}