import {
  Users,
  GraduationCap,
  School,
  CalendarCheck,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,250",
      icon: Users,
    },
    {
      title: "Total Teachers",
      value: "75",
      icon: GraduationCap,
    },
    {
      title: "Total Classes",
      value: "32",
      icon: School,
    },
    {
      title: "Attendance",
      value: "94%",
      icon: CalendarCheck,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="text-3xl font-bold text-slate-900 mt-2">
                    {stat.value}
                  </h2>
                </div>

                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance Overview
          </h2>

          <div className="h-64 flex items-center justify-center text-slate-400">
            Chart coming next...
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Students
          </h2>

          <div className="mt-5 space-y-4">
            {["Rahul Patel", "Amit Shah", "Neha Patel", "Jay Mehta"].map(
              (student, index) => (
                <div
                  key={student}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                      {student.charAt(0)}
                    </div>

                    <div>
                      <p className="font-medium text-slate-800">
                        {student}
                      </p>

                      <p className="text-xs text-slate-400">
                        Class {index + 7}-A
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}