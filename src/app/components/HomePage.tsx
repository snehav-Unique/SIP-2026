import { useNavigate } from "react-router";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import AnimatedContent from "../../components/AnimatedContent";
import CountUp from "../../components/CountUp";
import SplitText from "../../components/SplitText";
import { SpotlightCard } from "./SpotlightCard";
import { useAnnouncements } from "../../hooks/useAnnouncements";

const portalMetrics = [
  { label: "Notices",       value: 8,  icon: Bell,        bg: "bg-orange-50" },
  { label: "Events",        value: 6,  icon: Users,       bg: "bg-amber-50"  },
  { label: "Venues",        value: 12, icon: MapPin,      bg: "bg-orange-50" },
  { label: "Support Desks", value: 4,  icon: HelpCircle,  bg: "bg-amber-50"  },
];

const quickAccess = [
  { title: "Announcements",    description: "Circulars, timetable notices and dean messages.", icon: FileText,  path: "/announcements" },
  { title: "Campus Map",       description: "Locate blocks, halls, auditorium and parking.",  icon: MapPin,    path: "/map"           },
  { title: "Academic Calendar",description: "Key milestones, induction sessions and holidays.", icon: Calendar, path: "/announcements" },
  { title: "Student Resources",description: "Department contacts, forms and helpdesk links.", icon: BookOpen,  path: "/announcements" },
];

const scheduleItems = [
  { time: "09:30 AM", title: "Document Verification", location: "Admin Block"     },
  { time: "10:30 AM", title: "Orientation Address",   location: "Main Auditorium" },
  { time: "12:00 PM", title: "Department Briefing",   location: "Assigned Blocks" },
  { time: "02:00 PM", title: "Campus Familiarisation",location: "Main Gate"       },
];

const importantDates = [
  { date: "28 May", label: "Orientation Program"   },
  { date: "30 May", label: "ID Card Verification"  },
  { date: "02 Jun", label: "First Semester Begins" },
  { date: "07 Jun", label: "Library Enrollment"    },
];

const resourceCards = [
  { label: "Parent Helpdesk",   value: "+91 80 6818 8181",        icon: Phone         },
  { label: "Student Affairs",   value: "Dean Office, Admin Block", icon: ShieldCheck   },
  { label: "Emergency Contact", value: "Security Desk, Main Gate", icon: AlertTriangle },
];

export function HomePage() {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();
// Updated - filters by exact datetime
const now = new Date();
const recentAnnouncements = announcements
  .filter((a) => {
    const eventDate = new Date(a.date);
    // If time exists (e.g. "10:30 AM"), parse and combine with date
    if (a.time) {
      const timeMatch = a.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const mins = parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        eventDate.setHours(hours, mins, 0, 0);
      }
    } else {
      // No time — keep it visible all day
      eventDate.setHours(23, 59, 59, 999);
    }
    return eventDate >= now;
  })
  .slice(0, 3);
  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* ── Hero ── */}
        <AnimatedContent distance={20} duration={0.6} threshold={0.05}>
          <SpotlightCard className="rounded-2xl bg-white border border-stone-100 p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SplitText
                  text="Student Information Dashboard"
                  tag="h1"
                  splitType="words"
                  textAlign="left"
                  delay={38}
                  duration={0.6}
                  className="block text-3xl font-bold leading-tight text-stone-950 sm:text-4xl lg:text-[2.6rem]"
                />
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-stone-400 sm:text-[15px]">
                  Everything a first-year student needs — notices, orientation schedule,
                  campus map, and support contacts — all in one place.
                </p>
              </div>

              <div className="hidden lg:block rounded-xl bg-stone-50 border border-stone-100 p-4 min-w-[210px]">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Today</p>
                    <p className="font-display text-sm font-bold text-stone-900">Orientation Desk</p>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="text-primary" size={14} />
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-stone-400 text-xs">Next session</span>
                    <span className="font-bold text-stone-900 text-xs">10:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-stone-400 text-xs">Venue</span>
                    <span className="font-bold text-stone-900 text-xs">Main Auditorium</span>
                  </div>
                  <button
                    onClick={() => navigate("/map?destination=Main%20Auditorium")}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <MapPin size={12} />
                    Open Venue Map
                  </button>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        {/* ── Metric pills ── */}
        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {portalMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <AnimatedContent key={metric.label} distance={20} delay={i * 0.07} duration={0.5}>
                <SpotlightCard className={`rounded-2xl ${metric.bg} p-3.5`}>
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-primary">
                    <Icon size={15} />
                  </div>
                  <p className="text-2xl font-bold text-stone-900">
                    <CountUp to={metric.value} duration={1.4} />
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-stone-400">{metric.label}</p>
                </SpotlightCard>
              </AnimatedContent>
            );
          })}
        </section>

        {/* ── Row 1: Announcements + Schedule (3-col grid) ── */}
        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <AnimatedContent distance={22} duration={0.6} className="lg:col-span-2">
            <SpotlightCard className="rounded-2xl bg-white border border-stone-100 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold text-stone-950">Recent Announcements</h2>
                  <p className="text-xs text-stone-400">Latest circulars from RVCE offices.</p>
                </div>
                <button
                  onClick={() => navigate("/announcements")}
                  className="flex items-center gap-1 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-500 transition-colors hover:border-primary hover:text-primary"
                >
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-stone-100">
                {recentAnnouncements.map((announcement) => (
                  <button
                    key={announcement.id}
                    onClick={() => navigate("/announcements")}
                    className="grid w-full gap-1 py-3 text-left hover:opacity-70 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{announcement.category}</span>
                        <span className="text-[10px] text-stone-400">{new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">{announcement.title}</h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">{announcement.description}</p>
                    </div>
                    {announcement.location && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-stone-400">
                        <MapPin size={11} className="text-primary" />
                        {announcement.location}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={22} delay={0.08} duration={0.6}>
            <SpotlightCard className="rounded-2xl bg-white border border-stone-100 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-stone-950">Orientation Schedule</h2>
              <p className="mb-3 text-xs text-stone-400">Sessions for reporting day.</p>
              <div className="space-y-3">
                {scheduleItems.map((item) => (
                  <div key={item.time} className="flex items-start gap-3">
                    <div className="shrink-0 rounded-xl bg-primary/10 px-2 py-1.5 text-center">
                      <span className="block text-[10px] font-bold leading-tight text-primary">
                        {item.time.split(" ")[0]}
                      </span>
                      <span className="block text-[9px] font-semibold text-primary/70">
                        {item.time.split(" ")[1]}
                      </span>
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-bold text-stone-900">{item.title}</p>
                      <p className="text-xs text-stone-400">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </AnimatedContent>
        </div>

        {/* ── Row 2: Quick Access + Dates + Contacts (3-col grid) ── */}
        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <AnimatedContent distance={22} duration={0.6} className="lg:col-span-2">
            <SpotlightCard className="rounded-2xl bg-white border border-stone-100 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-stone-950 mb-3">Quick Access</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {quickAccess.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.path)}
                      className="group rounded-xl border border-stone-100 bg-stone-50 p-3.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon size={14} />
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-stone-400">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={22} delay={0.08} duration={0.6}>
            <div className="space-y-4">
              <SpotlightCard className="rounded-2xl bg-white border border-stone-100 p-4 sm:p-5">
                <h2 className="font-display text-base font-bold text-stone-950 mb-3">Important Dates</h2>
                <div className="grid gap-2 grid-cols-2">
                  {importantDates.map((item) => (
                    <div key={item.label} className="rounded-xl bg-orange-50 px-3 py-2.5">
                      <p className="text-xs font-bold text-primary">{item.date}</p>
                      <p className="mt-0.5 text-xs font-semibold text-stone-800">{item.label}</p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl bg-white border border-stone-100 p-4 sm:p-5">
                <h2 className="font-display text-base font-bold text-stone-950 mb-3">Support Contacts</h2>
                <div className="space-y-3">
                  {resourceCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon size={13} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{item.label}</p>
                          <p className="text-xs text-stone-400">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SpotlightCard>
            </div>
          </AnimatedContent>
        </div>

      </div>
    </div>
  );
}
