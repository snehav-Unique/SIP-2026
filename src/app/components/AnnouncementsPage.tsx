import { useNavigate } from "react-router";
import { Calendar, MapPin, Download, Clock, User, FileDown } from "lucide-react";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { Announcement } from "../../data/announcements";
import { getAnnouncementTimeRange } from "../../utils/announcementTiming";

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();

  const now = new Date();

  const upcoming = announcements
    .filter((a) => {
      const range = getAnnouncementTimeRange(a);
      return range ? range.end >= now : false;
    })
    .sort((a, b) => {
      const aStart = getAnnouncementTimeRange(a)?.start?.getTime() ?? 0;
      const bStart = getAnnouncementTimeRange(b)?.start?.getTime() ?? 0;
      return aStart - bStart;
    });

  const past = announcements
    .filter((a) => {
      const range = getAnnouncementTimeRange(a);
      return range ? range.end < now : false;
    })
    .sort((a, b) => {
      const aStart = getAnnouncementTimeRange(a)?.start?.getTime() ?? 0;
      const bStart = getAnnouncementTimeRange(b)?.start?.getTime() ?? 0;
      return bStart - aStart;
    });

  const handleMapNavigation = (announcement: Announcement) => {
    const params = new URLSearchParams();
    if (announcement.location) {
      params.set("destination", announcement.location);
    }
    params.set("event", String(announcement.id));
    navigate(`/map?${params.toString()}`);
  };

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {announcement.category}
            </span>
            {announcement.hasDocument && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                <FileDown size={13} />
                {announcement.documentType?.includes("image") ? "Image attachment" : "PDF available"}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-stone-950 sm:text-2xl">{announcement.title}</h2>
          <p className="mt-2 text-sm leading-7 text-stone-500">{announcement.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <User size={16} className="text-primary" />
              <span>{announcement.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span>{new Date(announcement.date).toLocaleDateString()}</span>
            </div>
            {announcement.time && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>{announcement.time}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {announcement.location && (
        <div className="mt-5 rounded-2xl bg-stone-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-stone-600">
              <MapPin size={18} className="text-primary" />
              <span className="font-medium">{announcement.location}</span>
            </div>
            <button
              onClick={() => handleMapNavigation(announcement)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MapPin size={16} />
              View on Map
            </button>
          </div>
        </div>
      )}

      {announcement.hasDocument && announcement.fileUrl && (
        <div className="mt-4">
          <a
            href={announcement.fileUrl}
            target="_blank"
            rel="noreferrer"
            download={announcement.documentName || "announcement-attachment"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-white px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <Download size={18} />
            Download {announcement.documentType?.includes("image") ? "Image" : "PDF"}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-950 sm:text-3xl">Announcements</h1>
          <p className="mt-1 text-sm text-stone-500">Stay updated with the latest circulars, notices and downloadable files.</p>
        </div>

        <div className="grid gap-4">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center text-stone-500">
              No upcoming announcements.
            </div>
          ) : (
            upcoming.map((a) => <AnnouncementCard key={a.id} announcement={a} />)
          )}
        </div>

        {past.length > 0 && (
          <div className="pt-4">
            <div className="mb-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                Past Announcements
              </span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>
            <div className="grid gap-4 opacity-80">
              {past.map((a) => <AnnouncementCard key={a.id} announcement={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
