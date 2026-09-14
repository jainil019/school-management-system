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
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 min-w-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-500 truncate">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 sm:mt-2">
                    {stat.value}
                  </h2>
                </div>

                <div className="bg-blue-50 text-blue-600 p-2.5 sm:p-3 rounded-xl shrink-0">
                  <Icon size={21} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Attendance */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Attendance Overview
          </h2>

          <div className="h-52 sm:h-64 flex items-center justify-center text-sm text-slate-400">
            Chart coming next...
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Recent Students
          </h2>

          <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
            {[
              "Rahul Patel",
              "Amit Shah",
              "Neha Patel",
              "Jay Mehta",
            ].map((student, index) => (
              <div
                key={student}
                className="flex items-center justify-between gap-3"
              >
                {/* Student */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm sm:text-base text-slate-600">
                    {student.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base text-slate-800 truncate">
                      {student}
                    </p>

                    <p className="text-[11px] sm:text-xs text-slate-400">
                      Class {index + 7}-A
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span className="shrink-0 text-[11px] sm:text-xs bg-green-50 text-green-600 px-2.5 sm:px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}