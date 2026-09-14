import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1 className="font-bold text-xl">ABC School</h1>
              <p className="text-xs text-slate-500">Excellence in Education</p>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>

            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 font-medium text-blue-200">
              WELCOME TO ABC SCHOOL
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Building Bright Futures Through Quality Education
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-blue-100">
              We provide a supportive learning environment where students
              develop knowledge, confidence, creativity and strong values.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#about"
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700"
              >
                Explore School
                <ArrowRight size={18} />
              </a>

              <Link
                to="/login"
                className="rounded-lg border border-white px-6 py-3 font-semibold hover:bg-white/10"
              >
                Student / Teacher Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          <Stat icon={<Users />} number="1200+" label="Students" />
          <Stat icon={<GraduationCap />} number="75+" label="Teachers" />
          <Stat icon={<BookOpen />} number="40+" label="Subjects" />
          <Stat icon={<Award />} number="25+" label="Years Excellence" />
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-semibold text-blue-600">ABOUT OUR SCHOOL</p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Education That Inspires Success
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              ABC School is committed to providing quality education with
              modern teaching methods, experienced teachers and a safe,
              welcoming environment for every student.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-semibold text-blue-600">WHY CHOOSE US</p>
            <h2 className="mt-2 text-3xl font-bold">
              Everything Students Need
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon={<BookOpen />}
              title="Quality Education"
              text="Experienced teachers and structured learning programs."
            />

            <Feature
              icon={<Users />}
              title="Student Support"
              text="Personal attention and a positive environment for students."
            />

            <Feature
              icon={<Award />}
              title="Modern Learning"
              text="Technology-enabled classrooms and practical learning."
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Contact Our School</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Contact icon={<MapPin />} title="Address">
              Your School Address, Gujarat, India
            </Contact>

            <Contact icon={<Phone />} title="Phone">
              +91 98765 43210
            </Contact>

            <Contact icon={<Mail />} title="Email">
              info@abcschool.com
            </Contact>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-8 text-center text-slate-400">
        <p>© 2026 ABC School. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Stat({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 w-fit text-blue-600">{icon}</div>
      <h3 className="text-2xl font-bold">{number}</h3>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-7 shadow-sm">
      <div className="mb-4 w-fit rounded-xl bg-blue-100 p-3 text-blue-600">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-2 leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Contact({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="mb-3 text-blue-600">{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-slate-600">{children}</p>
    </div>
  );
}