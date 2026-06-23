import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  ShieldCheck,
  Download,
} from "lucide-react";
import AnimatedContent from "../../components/AnimatedContent";
import SplitText from "../../components/SplitText";
import { SpotlightCard } from "./SpotlightCard";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { getAnnouncementTimeRange } from "../../utils/announcementTiming";
import schedulePdf from "../../../Sip-Shedule-2025-old.pdf";

const resourceCards = [
  { label: "Parent Helpdesk", value: "+91 80 6818 8181", icon: Phone },
  { label: "Student Affairs", value: "Dean Office, Admin Block", icon: ShieldCheck },
  { label: "Emergency Contact", value: "Security Desk, Main Gate", icon: AlertTriangle },
];

export function HomePage() {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();

  const recentAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements
      .map((announcement) => {
        const range = getAnnouncementTimeRange(announcement);
        const start = range?.start ?? new Date(announcement.date);
        return { announcement, start, end: range?.end ?? start };
      })
      .filter(({ end }) => end >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 4)
      .map(({ announcement }) => announcement);
  }, [announcements]);

  const scheduleResource = useMemo(() => {
    const att = announcements.find(
      (item) =>
        item.hasDocument &&
        Boolean(item.documentUrl || item.fileUrl) &&
        (item.category === "Timetable" || /schedule|timetable/i.test(item.title)),
    );
    return att ?? null;
  }, [announcements]);
  const scheduleHref = scheduleResource?.documentUrl || scheduleResource?.fileUrl || schedulePdf;
  const scheduleName = scheduleResource?.documentName || "Sip-Shedule-2025-old.pdf";
  const isImageAttachment = Boolean(scheduleResource?.documentType?.includes("image"));

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <AnimatedContent distance={20} duration={0.6} threshold={0.05}>
          <SpotlightCard className="overflow-hidden rounded-2xl border border-stone-100 bg-white p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
            <div className="relative space-y-3">
              <SplitText
                text="Student Information Dashboard"
                tag="h1"
                splitType="words"
                textAlign="left"
                delay={38}
                duration={0.6}
                className="block text-3xl font-bold leading-tight text-stone-950 sm:text-4xl lg:text-[2.6rem]"
              />
              </div>
          </SpotlightCard>
        </AnimatedContent>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <AnimatedContent distance={22} duration={0.6} className="lg:col-span-2">
            <SpotlightCard className="rounded-2xl border border-stone-100 bg-white p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold text-stone-950">Recent Announcements</h2>
                  <p className="text-xs text-stone-400">Nearest upcoming notices from RVCE offices.</p>
                </div>
                <button
                  onClick={() => navigate("/announcements")}
                  className="flex items-center gap-1 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-500 transition-colors hover:border-primary hover:text-primary"
                >
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-stone-100">
                {recentAnnouncements.length === 0 ? (
                  <div className="py-6 text-center text-sm text-stone-400">
                    No upcoming announcements right now.
                  </div>
                ) : (
                  recentAnnouncements.map((announcement) => (
                    <button
                      key={announcement.id}
                      onClick={() => navigate("/announcements")}
                      className="grid w-full gap-1 py-3 text-left transition hover:opacity-75 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {announcement.category}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900">{announcement.title}</h3>
                        <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">
                          {announcement.description}
                        </p>
                      </div>
                      {announcement.location && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-stone-400">
                          <MapPin size={11} className="text-primary" />
                          {announcement.location}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </SpotlightCard>
          </AnimatedContent>

          <AnimatedContent distance={22} delay={0.08} duration={0.6}>
            <SpotlightCard className="rounded-2xl border border-stone-100 bg-white p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-stone-950">Full Schedule</h2>
              <p className="mb-3 text-xs text-stone-400">Download the complete SIP schedule for offline use.</p>
              <a
                href={scheduleHref}
                download={scheduleName}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <Download size={15} />
                Download {isImageAttachment ? "Attachment" : "Schedule PDF"}
              </a>
              <a
                href={scheduleHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-600 transition-colors hover:border-primary hover:text-primary"
              >
                <ExternalLink size={15} />
                View {isImageAttachment ? "Attachment" : "PDF"}
              </a>
              <button
                onClick={() => navigate("/schedule")}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-600 transition-colors hover:border-primary hover:text-primary"
              >
                <Calendar size={15} />
                Open schedule page
              </button>
            </SpotlightCard>
          </AnimatedContent>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <AnimatedContent distance={22} className="lg:col-span-2">
            <SpotlightCard className="rounded-2xl border border-stone-100 bg-white p-4 sm:p-5">
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
          </AnimatedContent>

        
        
        </div>
      </div>
    </div>
  );
}
