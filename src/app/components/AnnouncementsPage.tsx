import { useMemo } from "react";
import { useNavigate } from "react-router";
import { CalendarDays, Clock3, ExternalLink, MapPin } from "lucide-react";
import AnimatedContent from "../../components/AnimatedContent";
import SplitText from "../../components/SplitText";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { isAnnouncementCurrentOrUpcoming } from "../../utils/announcementTiming";

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const { announcements, loading, error } = useAnnouncements();

  const visibleAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements
      .filter((announcement) => isAnnouncementCurrentOrUpcoming(announcement, now))
      .sort((a, b) => {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (a.time ?? "").localeCompare(b.time ?? "");
      });
  }, [announcements]);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(28,25,23,0.08)] backdrop-blur sm:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <CalendarDays size={13} />
              Announcements
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Latest notices and updates
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">
              Browse current and upcoming RVCE notices, office updates, and event alerts in one place.
            </p>
          </div>  
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-stone-100 bg-white p-8 text-center text-sm text-stone-500">
              Loading announcements...
            </div>
          ) : visibleAnnouncements.length === 0 ? (
            <div className="rounded-2xl border border-stone-100 bg-white p-8 text-center text-sm text-stone-500">
              No current or upcoming announcements right now.
            </div>
          ) : (
            visibleAnnouncements.map((announcement) => (
              <AnimatedContent
                key={announcement.id}
                distance={20}
                duration={0.6}
                threshold={0.05}
              >
                <article className="rounded-[1.75rem] border border-stone-200/70 bg-white/95 p-5 shadow-[0_12px_40px_rgba(28,25,23,0.06)] sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                          {announcement.category}
                        </span>
                      </div>
                      <div>
                        <SplitText
                          text={announcement.title}
                          tag="h2"
                          splitType="words"
                          textAlign="left"
                          delay={38}
                          duration={0.6}
                          className="block text-xl font-bold text-stone-950"
                        />
                        <AnimatedContent distance={10} duration={0.5} threshold={0.05}>
                          <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-500">
                            {announcement.description}
                          </p>
                        </AnimatedContent>
                      </div>
                    </div>

                    {announcement.hasDocument && (
                      <a
                        href={announcement.documentUrl || announcement.fileUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-primary hover:text-primary"
                      >
                        <ExternalLink size={15} />
                        Open file
                      </a>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1.5">
                      <CalendarDays size={14} className="text-primary" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    {announcement.time && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1.5">
                        <Clock3 size={14} className="text-primary" />
                        {announcement.time}
                      </span>
                    )}
                    {announcement.location && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1.5">
                        <MapPin size={14} className="text-primary" />
                        {announcement.location}
                        <button
                          type="button"
                          onClick={() => {
                            const params = new URLSearchParams();
                            params.set("destination", announcement.location!);
                            navigate(`/map?${params.toString()}`);
                          }}
                          className="ml-1 text-primary text-xs font-semibold underline underline-offset-2 hover:text-orange-600 transition-colors"
                        >
                          Open in Map
                        </button>
                      </span>
                    )}
                  </div>
                </article>
              </AnimatedContent>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
