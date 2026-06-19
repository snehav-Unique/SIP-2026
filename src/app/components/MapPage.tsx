import { useSearchParams } from "react-router";
import CampusMap from "../../components/CampusMap";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { isAnnouncementCurrentOrUpcoming } from "../../utils/announcementTiming";

export function MapPage() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  const focusAnnouncementId = searchParams.get("event");
  const { announcements } = useAnnouncements();
  const activeVenueAnnouncements = announcements.filter(
    (announcement) =>
      Boolean(announcement.location) &&
      isAnnouncementCurrentOrUpcoming(announcement),
  );

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-950 sm:text-3xl">
            Campus Map
          </h1>
          <p className="mt-0.5 text-sm text-stone-400">
            RV College of Engineering, Mysore Road, Bengaluru 560059
          </p>
        </div>
        <CampusMap
          initialSearch={destination ?? ""}
          focusAnnouncementId={focusAnnouncementId}
          announcements={activeVenueAnnouncements}
        />
      </div>
    </div>
  );
}
