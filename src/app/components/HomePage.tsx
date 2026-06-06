import { useNavigate } from "react-router";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import AnimatedContent from "../../components/AnimatedContent";
import CountUp from "../../components/CountUp";
import SplitText from "../../components/SplitText";
import { useAnnouncements } from "../../hooks/useAnnouncements";

const portalMetrics = [
  { label: "Notices", value: 8, suffix: "", icon: Bell },
  { label: "Orientation Events", value: 6, suffix: "", icon: Users },
  { label: "Campus Venues", value: 12, suffix: "", icon: MapPin },
  { label: "Support Desks", value: 4, suffix: "", icon: HelpCircle },
];

const quickAccess = [
  {
    title: "Announcements",
    description: "Circulars, timetable notices, department updates, and dean messages.",
    icon: FileText,
    path: "/announcements",
  },
  {
    title: "Campus Map",
    description: "Locate blocks, seminar halls, auditorium, parking, and common areas.",
    icon: MapPin,
    path: "/map",
  },
  {
    title: "Academic Calendar",
    description: "Key semester milestones, induction sessions, holidays, and assessments.",
    icon: Calendar,
    path: "/announcements",
  },
  {
    title: "Student Resources",
    description: "Department contacts, forms, first-year guidance, and helpdesk links.",
    icon: BookOpen,
    path: "/announcements",
  },
];

const scheduleItems = [
  { time: "09:30 AM", title: "Document Verification", location: "Admin Block" },
  { time: "10:30 AM", title: "Orientation Address", location: "Main Auditorium" },
  { time: "12:00 PM", title: "Department Briefing", location: "Assigned Blocks" },
  { time: "02:00 PM", title: "Campus Familiarisation", location: "Main Gate" },
];

const importantDates = [
  { date: "28 May", label: "Orientation Program" },
  { date: "30 May", label: "ID Card Verification" },
  { date: "02 Jun", label: "First Semester Begins" },
  { date: "07 Jun", label: "Library Enrollment" },
];

const resourceCards = [
  { label: "Parent Helpdesk", value: "+91 80 6818 8181", icon: Phone },
  { label: "Student Affairs", value: "Dean Office, Admin Block", icon: ShieldCheck },
  { label: "Emergency Contact", value: "Security Desk, Main Gate", icon: AlertTriangle },
];

export function HomePage() {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <AnimatedContent distance={18} duration={0.55} threshold={0.05}>
          <section className="rounded-lg border border-primary/20 bg-white/95 p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  <GraduationCap size={16} />
                  RV College of Engineering
                  <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 normal-case tracking-normal">
                    First Year Portal 2025
                  </span>
                </div>
                <SplitText
                  text="Student Information Dashboard"
                  tag="h1"
                  splitType="words"
                  textAlign="left"
                  delay={40}
                  duration={0.7}
                  className="block text-2xl font-bold leading-tight text-slate-950 sm:text-3xl lg:text-4xl"
                />
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  A single place for first-year students and parents to review notices, schedules,
                  campus locations, important dates, and support contacts.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today</p>
                    <p className="text-lg font-bold text-slate-950">Orientation Desk</p>
                  </div>
                  <Clock className="text-primary" size={26} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Next session</span>
                    <span className="font-semibold text-slate-950">10:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">Venue</span>
                    <span className="font-semibold text-slate-950">Main Auditorium</span>
                  </div>
                  <button
                    onClick={() => navigate("/map?destination=Main%20Auditorium")}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    <MapPin size={16} />
                    Open Venue Map
                  </button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedContent>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {portalMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <AnimatedContent key={metric.label} distance={22} delay={index * 0.06} duration={0.55}>
                <div className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={19} />
                  </div>
                  <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
                    <CountUp to={metric.value} duration={1.4} />
                    {metric.suffix}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{metric.label}</p>
                </div>
              </AnimatedContent>
            );
          })}
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
          <AnimatedContent distance={24} duration={0.6}>
            <section className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Recent Announcements</h2>
                  <p className="text-sm text-slate-500">Latest circulars and notices from RVCE offices.</p>
                </div>
                <button
                  onClick={() => navigate("/announcements")}
                  className="flex items-center gap-1 rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {recentAnnouncements.map((announcement) => (
                  <button
                    key={announcement.id}
                    onClick={() => navigate("/announcements")}
                    className="grid w-full gap-2 py-3 text-left sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {announcement.category}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold text-slate-950">{announcement.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{announcement.description}</p>
                    </div>
                    {announcement.location && (
                      <span className="flex items-center gap-1 text-sm font-medium text-slate-500">
                        <MapPin size={15} className="text-primary" />
                        {announcement.location}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent distance={24} delay={0.08} duration={0.6}>
            <section className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-bold text-slate-950">Orientation Schedule</h2>
              <p className="mb-4 text-sm text-slate-500">Primary sessions for reporting day.</p>
              <div className="space-y-3">
                {scheduleItems.map((item) => (
                  <div key={`${item.time}-${item.title}`} className="grid grid-cols-[84px_1fr] gap-3">
                    <div className="rounded-lg border border-primary/20 bg-primary/10 px-2 py-2 text-center text-sm font-bold text-primary">
                      {item.time}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedContent>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <AnimatedContent distance={24} duration={0.6}>
            <div className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-bold text-slate-950">Quick Access</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickAccess.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.path)}
                      className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary hover:shadow-md"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <h3 className="font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={24} delay={0.08} duration={0.6}>
            <div className="grid gap-5">
              <section className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
                <h2 className="text-lg font-bold text-slate-950">Important Dates</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {importantDates.map((item) => (
                    <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-bold text-primary">{item.date}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
                <h2 className="text-lg font-bold text-slate-950">Support Contacts</h2>
                <div className="mt-4 space-y-3">
                  {resourceCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-950">{item.label}</p>
                          <p className="text-sm text-slate-600">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </AnimatedContent>
        </section>
      </div>
    </div>
  );
}
