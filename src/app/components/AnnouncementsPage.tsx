import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, MapPin, Download, Clock, User } from "lucide-react";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import AnimatedContent from "../../components/AnimatedContent";
import SplitText from "../../components/SplitText";
import { SpotlightCard } from "./SpotlightCard";

const categoryAccent: Record<string, { bar: string; badge: string }> = {
  Dean:       { bar: "bg-orange-400",  badge: "bg-orange-100 text-orange-700"  },
  Department: { bar: "bg-blue-400",    badge: "bg-blue-100 text-blue-700"      },
  Timetable:  { bar: "bg-violet-400",  badge: "bg-violet-100 text-violet-700"  },
  Venue:      { bar: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700"},
};

const defaultAccent = { bar: "bg-stone-300", badge: "bg-stone-100 text-stone-600" };

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { announcements, getLastUpdated } = useAnnouncements();

  const categories = ["All", "Dean", "Department", "Timetable", "Venue"];

  const filteredAnnouncements =
    selectedCategory === "All"
      ? announcements
      : announcements.filter((a) => a.category === selectedCategory);

  const lastUpdatedTime = getLastUpdated();
  const getRelativeTime = (isoString: string | null) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">

        {/* Header */}
        <AnimatedContent distance={18} duration={0.55}>
          <div>
            <SplitText
              text="Announcements"
              tag="h1"
              splitType="words"
              textAlign="left"
              delay={35}
              duration={0.6}
              className="block text-3xl font-bold text-stone-950 sm:text-4xl"
            />
            <p className="mt-1.5 text-sm text-stone-400">
              Latest circulars and notices from RVCE offices
              {lastUpdatedTime && (
                <span className="ml-2 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-500">
                  Updated {getRelativeTime(lastUpdatedTime)}
                </span>
              )}
            </p>
          </div>
        </AnimatedContent>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "border border-stone-200 bg-white text-stone-500 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcement list */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredAnnouncements.map((a, i) => {
            const accent = categoryAccent[a.category] ?? defaultAccent;
            return (
              <AnimatedContent key={a.id} distance={16} delay={i * 0.04} duration={0.5}>
                <SpotlightCard className="rounded-2xl bg-white shadow-sm border border-stone-100/80 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                  {/* Category colour bar */}
                  <div className={`h-[3px] w-full ${accent.bar}`} />

                  <div className="p-5">
                    {/* Top row: category badge + date */}
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${accent.badge}`}>
                          {a.category}
                        </span>
                        {a.hasDocument && (
                          <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">
                            <Download size={10} />
                            PDF
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-stone-400">
                        <Calendar size={11} className="text-stone-300" />
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h2 className="font-display text-xl font-bold leading-snug text-stone-900 sm:text-[1.35rem]">
                      {a.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-2">{a.description}</p>

                    {/* Meta: author + time */}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <User size={12} className="text-stone-300" />
                        {a.author}
                      </span>
                      {a.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-stone-300" />
                          {a.time}
                        </span>
                      )}
                    </div>

                    {/* Footer: location + PDF */}
                    {(a.location || a.hasDocument) && (
                      <div className="mt-4 space-y-2 border-t border-stone-100 pt-4">
                        {a.location && (
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-2.5">
                            <div className="flex items-center gap-2 text-sm text-stone-700">
                              <MapPin size={14} className="text-primary shrink-0" />
                              <span className="font-semibold">{a.location}</span>
                            </div>
                            <button
                              onClick={() => navigate(`/map?destination=${encodeURIComponent(a.location!)}`)}
                              className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-85"
                            >
                              View on Map
                            </button>
                          </div>
                        )}
                        {a.hasDocument && (
                          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                            <Download size={14} />
                            Download Document (PDF)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              </AnimatedContent>
            );
          })}
        </div>

      </div>
    </div>
  );
}
