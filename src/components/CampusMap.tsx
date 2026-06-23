import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { CalendarDays, ChevronDown, Clock3, MapPinned, Search, X } from "lucide-react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import L from "leaflet";
import type { Announcement } from "../data/announcements";
import {
  campusLocations,
  type CampusLocation,
  resolveCampusLocation,
  normalizeLocationName,
} from "../data/campusLocations";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { getAnnouncementTimeRange } from "../utils/announcementTiming";

const defaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
const highlightedIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -38],
  shadowSize: [46, 46],
});

L.Marker.prototype.options.icon = defaultIcon;

const MAP_CENTER: [number, number] = [12.9235, 77.5005];
const MAP_ZOOM = 17;

function MapController({
  selectedLocation,
}: {
  selectedLocation: CampusLocation | null;
}) {
  const map = useMap();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [map]);

  useEffect(() => {
    if (!selectedLocation) return;
    map.closePopup();
    map.flyTo([selectedLocation.lat, selectedLocation.lng], 18.5, {
      animate: true,
      duration: 1.8,
      easeLinearity: 0.25,
    });
  }, [map, selectedLocation]);

  return null;
}

type CampusMapProps = {
  initialSearch?: string;
  focusAnnouncementId?: string | null;
  announcements?: Announcement[];
};

type VenueAnnouncementGroup = {
  location: CampusLocation;
  announcements: Announcement[];
};

function formatEventLabel(announcement: Announcement) {
  const range = getAnnouncementTimeRange(announcement);
  const dateLabel = new Date(announcement.date).toLocaleDateString();
  if (!range || !announcement.time) {
    return announcement.time ? `${dateLabel} · ${announcement.time}` : dateLabel;
  }
  return `${dateLabel} · ${announcement.time}`;
}

// Returns locations matching the query, sorted: exact prefix first, then contains
function getDropdownMatches(query: string): CampusLocation[] {
  if (!query.trim()) return [];
  const q = normalizeLocationName(query);
  return campusLocations
    .filter((loc) => normalizeLocationName(loc.name).includes(q))
    .sort((a, b) => {
      const an = normalizeLocationName(a.name);
      const bn = normalizeLocationName(b.name);
      const aStarts = an.startsWith(q);
      const bStarts = bn.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return an.localeCompare(bn);
    })
    .slice(0, 8);
}

export default function CampusMap({
  initialSearch = "",
  focusAnnouncementId = null,
  announcements = [],
}: CampusMapProps) {
  const [search, setSearch] = useState(initialSearch);
  // The location the map is currently panned to (set only on explicit selection)
  const [pinnedLocation, setPinnedLocation] = useState<CampusLocation | null>(null);
  const [activeLocationName, setActiveLocationName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [browseAll, setBrowseAll] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setMarkerRef = (name: string) => (marker: LeafletMarker | null) => {
    markerRefs.current[name] = marker;
  };

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const venueGroups = useMemo(() => {
    const byLocation = new Map<string, VenueAnnouncementGroup>();
    announcements.forEach((announcement) => {
      const location = resolveCampusLocation(announcement.location);
      if (!location) return;
      const existing = byLocation.get(location.name);
      if (existing) {
        existing.announcements.push(announcement);
        return;
      }
      byLocation.set(location.name, { location, announcements: [announcement] });
    });
    return Array.from(byLocation.values());
  }, [announcements]);

  const activeLocations = venueGroups.length > 0
    ? venueGroups.map((group) => group.location)
    : campusLocations;

  // Dropdown suggestions: active notice locations when available, otherwise all locations.
  const suggestions = useMemo(() => {
    if (browseAll) return activeLocations;
    return getDropdownMatches(search).filter((location) =>
      activeLocations.some((activeLocation) => activeLocation.name === location.name),
    );
  }, [activeLocations, search, browseAll]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setBrowseAll(false);
    setDropdownOpen(true);
    setHighlightedIndex(-1);
    setPinnedLocation(null);
  };

  const handleSelectSuggestion = (location: CampusLocation) => {
    setSearch(location.name);
    setPinnedLocation(location);
    setActiveLocationName(location.name);
    setDropdownOpen(false);
    setBrowseAll(false);
    setHighlightedIndex(-1);
    setTimeout(() => {
      markerRefs.current[location.name]?.openPopup();
    }, 1900);
  };

  const handleClear = () => {
    setSearch("");
    setPinnedLocation(null);
    setActiveLocationName(null);
    setDropdownOpen(false);
    setBrowseAll(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const focusAnnouncement = useMemo(
    () =>
      announcements.find(
        (announcement) => String(announcement.id) === focusAnnouncementId,
      ) ?? null,
    [announcements, focusAnnouncementId],
  );

  // Selected location: pinned (from dropdown) > focusAnnouncement location
  const selectedLocation =
    pinnedLocation ?? resolveCampusLocation(focusAnnouncement?.location);

  useEffect(() => {
    setActiveLocationName(selectedLocation?.name ?? null);
  }, [selectedLocation]);

  const visibleGroups = useMemo(() => {
    if (venueGroups.length > 0) {
      return [...venueGroups];
    }

    return campusLocations.map((location) => ({ location, announcements: [] }));
  }, [venueGroups]);

  return (
    <div className="space-y-4">
      {/* Search box with dropdown */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <label
          htmlFor="campus-map-search"
          className="mb-2 block text-sm font-semibold text-stone-800"
        >
          Search campus locations
        </label>
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            id="campus-map-search"
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (search.trim()) setDropdownOpen(true);
            }}
            placeholder="Type a location name…"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={dropdownOpen && suggestions.length > 0}
            aria-controls="campus-location-listbox"
            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-16 text-sm text-stone-900 outline-none transition focus:border-primary"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {search && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="text-stone-400 hover:text-stone-600 transition p-0.5"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const next = !browseAll || !dropdownOpen;
                setBrowseAll(next);
                setDropdownOpen(next);
                setHighlightedIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="Browse all locations"
              className="text-stone-400 hover:text-stone-600 transition p-0.5"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${browseAll && dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Dropdown */}
          {dropdownOpen && suggestions.length > 0 && (
            <div
              id="campus-location-listbox"
              role="listbox"
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full z-[9999] mt-1 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg"
            >
              {browseAll && (
                <p className="border-b border-stone-100 px-4 py-2 text-xs text-stone-400">
                  All campus locations
                </p>
              )}
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((location, index) => {
                  const inVenueGroup = venueGroups.some(
                    (g) => g.location.name === location.name,
                  );
                  return (
                    <button
                      key={location.name}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(location);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                        highlightedIndex === index
                          ? "bg-primary/8 text-primary"
                          : "text-stone-800 hover:bg-stone-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPinned
                          size={14}
                          className={
                            highlightedIndex === index
                              ? "text-primary"
                              : "text-stone-400"
                          }
                          aria-hidden
                        />
                        {location.name}
                      </span>
                      {inVenueGroup && (
                        <span className="ml-3 shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          active event
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Status line below input */}
        {search && !pinnedLocation && suggestions.length === 0 ? (
          <p className="mt-2 text-xs text-stone-500">No matching location found.</p>
        ) : pinnedLocation ? (
          <p className="mt-2 text-xs text-stone-500">
            Showing{" "}
            <span className="font-semibold">{pinnedLocation.name}</span>
          </p>
        ) : venueGroups.length > 0 ? (
          <p className="mt-2 text-xs text-stone-500">
            Displaying current and upcoming event venues.
          </p>
        ) : null}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="h-[60vh] min-h-[420px] w-full sm:h-[65vh]">
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            scrollWheelZoom
            zoomControl
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
            <MapController selectedLocation={selectedLocation} />
            {visibleGroups.map((group) => {
              const isActive = activeLocationName === group.location.name;
              const isFocusedVenue =
                resolveCampusLocation(focusAnnouncement?.location)?.name ===
                group.location.name;

              return (
                <Marker
                  key={group.location.name}
                  position={[group.location.lat, group.location.lng]}
                  ref={setMarkerRef(group.location.name)}
                  icon={isActive || isFocusedVenue ? highlightedIcon : defaultIcon}
                  eventHandlers={{
                    click: () => {
                      const loc = group.location;
                      setActiveLocationName(loc.name);
                      setSearch(loc.name);
                      setPinnedLocation(loc);
                      setDropdownOpen(false);
                      setTimeout(() => {
                        markerRefs.current[loc.name]?.openPopup();
                      }, 0);
                    },
                  }}
                >
                  <Popup>
                    <div className="min-w-[220px] space-y-2">
                      <div>
                        <p className="font-semibold text-stone-900">
                          {group.location.name}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          Spot demarcated
                        </p>
                        <p className="text-xs text-stone-500">
                          {group.announcements.length > 0
                            ? `${group.announcements.length} active venue event${group.announcements.length > 1 ? "s" : ""}`
                            : "Campus location"}
                        </p>
                      </div>
                      {group.announcements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className="rounded-lg border border-stone-200 bg-stone-50 p-2"
                        >
                          <p className="text-sm font-medium text-stone-900">
                            {announcement.title}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            {formatEventLabel(announcement)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Venue event cards — only when there are active announcements with locations */}
      {venueGroups.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-stone-900">
            <MapPinned size={18} className="text-primary" />
            <h2 className="text-sm font-semibold">
              Current and upcoming venue sessions
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {venueGroups.map((group) => (
              <button
                key={group.location.name}
                type="button"
                onClick={() => handleSelectSuggestion(group.location)}
                className={`rounded-xl border p-4 text-left transition ${
                  activeLocationName === group.location.name
                    ? "border-primary bg-primary/5"
                    : "border-stone-200 hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-stone-900">
                    {group.location.name}
                  </p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {group.announcements.length} event
                    {group.announcements.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {group.announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-lg bg-stone-50 p-3"
                    >
                      <p className="text-sm font-medium text-stone-900">
                        {announcement.title}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {new Date(announcement.date).toLocaleDateString()}
                        </span>
                        {announcement.time && (
                          <span className="flex items-center gap-1">
                            <Clock3 size={12} />
                            {announcement.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
