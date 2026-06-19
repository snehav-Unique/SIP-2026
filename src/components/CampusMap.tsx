import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { CalendarDays, ChevronDown, Clock3, MapPinned, Search, X } from "lucide-react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  Polyline,
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
import {
  computeCampusRoute,
  haversineMeters,
  loadCampusRouteGraph,
} from "../data/campusRoutes";
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

function RouteController({
  selectedLocation,
  userPosition,
  routePath,
}: {
  selectedLocation: CampusLocation | null;
  userPosition: { lat: number; lng: number } | null;
  routePath: [number, number][] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocation || !userPosition) return;

    const points: [number, number][] = routePath?.length
      ? [
          [userPosition.lat, userPosition.lng],
          ...routePath,
          [selectedLocation.lat, selectedLocation.lng],
        ]
      : [
          [userPosition.lat, userPosition.lng],
          [selectedLocation.lat, selectedLocation.lng],
        ];
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds.pad(0.3), {
      animate: true,
      duration: 0.9,
    });
  }, [map, routePath, selectedLocation, userPosition]);

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

type GeoState =
  | { status: "idle" | "requesting" | "active"; position: null }
  | {
      status: "active";
      position: {
        lat: number;
        lng: number;
        accuracy: number;
      };
    }
  | {
      status: "denied" | "unavailable" | "error";
      position: null;
    message: string;
  };

type RouteState =
  | {
      status: "idle" | "loading";
      path: null;
      distanceMeters: null;
      durationSeconds: null;
      message: null;
    }
  | {
      status: "ready";
      path: [number, number][];
      distanceMeters: number;
      durationSeconds: number;
      message: null;
    }
  | {
      status: "error";
      path: null;
      distanceMeters: null;
      durationSeconds: null;
      message: string;
    };

function getGeoErrorMessage(code?: number) {
  if (code === 1) {
    return "Location access was denied. Turn it on in your browser settings to show your blue dot.";
  }
  if (code === 2) {
    return "Your location could not be found right now. Try moving to a clearer signal area.";
  }
  if (code === 3) {
    return "Location request timed out. Try again in a moment.";
  }
  return "Location access is not available in this browser.";
}

function getGeoStatusFromError(code: number): Exclude<GeoState["status"], "idle" | "requesting" | "active"> {
  if (code === 1) return "denied";
  if (code === 2) return "unavailable";
  return "error";
}

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

function isValidLatLng(point: [number, number] | null | undefined): point is [number, number] {
  return (
    Array.isArray(point) &&
    point.length === 2 &&
    Number.isFinite(point[0]) &&
    Number.isFinite(point[1])
  );
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
  const watchIdRef = useRef<number | null>(null);
  const routeGraphRef = useRef(loadCampusRouteGraph());
  const [geoState, setGeoState] = useState<GeoState>({
    status: "requesting",
    position: null,
  });
  const [routeState, setRouteState] = useState<RouteState>({
    status: "idle",
    path: null,
    distanceMeters: null,
    durationSeconds: null,
    message: null,
  });

  const beginGeoWatch = () => {
    if (!("geolocation" in navigator)) {
      setGeoState({
        status: "unavailable",
        position: null,
        message: "This browser does not support location tracking.",
      });
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setGeoState((current) =>
      current.status === "active"
        ? current
        : { status: "requesting", position: null },
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setGeoState({
          status: "active",
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        });
      },
      (error) => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setGeoState({
          status: getGeoStatusFromError(error.code),
          position: null,
          message: getGeoErrorMessage(error.code),
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );
  };

  const setMarkerRef = (name: string) => (marker: LeafletMarker | null) => {
    markerRefs.current[name] = marker;
  };

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const syncGraph = () => {
      routeGraphRef.current = loadCampusRouteGraph();
    };

    syncGraph();
    window.addEventListener("storage", syncGraph);
    return () => window.removeEventListener("storage", syncGraph);
  }, []);

  useEffect(() => {
    beginGeoWatch();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Dropdown suggestions based on current search text
  // Dropdown suggestions: all locations when browsing, filtered matches when typing
  const suggestions = useMemo(() => {
    if (browseAll) return campusLocations;
    return getDropdownMatches(search);
  }, [search, browseAll]);

  const resetRouteState = () => {
    setRouteState({
      status: "idle",
      path: null,
      distanceMeters: null,
      durationSeconds: null,
      message: null,
    });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setBrowseAll(false);
    setDropdownOpen(true);
    setHighlightedIndex(-1);
    setPinnedLocation(null);
    resetRouteState();
  };

  const handleSelectSuggestion = (location: CampusLocation) => {
    setSearch(location.name);
    setPinnedLocation(location);
    setActiveLocationName(location.name);
    setDropdownOpen(false);
    setBrowseAll(false);
    setHighlightedIndex(-1);
    resetRouteState();
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
    resetRouteState();
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
  const geoPosition = geoState.status === "active" ? geoState.position : null;

  useEffect(() => {
    if (!geoPosition || !selectedLocation) {
      setRouteState({
        status: "idle",
        path: null,
        distanceMeters: null,
        durationSeconds: null,
        message: null,
      });
      return;
    }

    try {
      const route = computeCampusRoute(
        routeGraphRef.current,
        geoPosition,
        selectedLocation,
      );

      if (!route) {
        setRouteState({
          status: "error",
          path: null,
          distanceMeters: null,
          durationSeconds: null,
          message:
            "No campus road graph is available yet. Open the route editor to plot internal roads first.",
        });
        return;
      }

      setRouteState({
        status: "ready",
        path: route.path.filter(isValidLatLng),
        distanceMeters: route.distanceMeters,
        durationSeconds: route.durationSeconds,
        message: null,
      });
    } catch {
      setRouteState({
        status: "error",
        path: null,
        distanceMeters: null,
        durationSeconds: null,
        message:
          "Route calculation failed. Please check the plotted route graph for invalid points.",
      });
    }
  }, [geoPosition, selectedLocation]);

  useEffect(() => {
    setActiveLocationName(selectedLocation?.name ?? null);
  }, [selectedLocation]);

  const visibleGroups = useMemo(() => {
    if (venueGroups.length === 0) {
      return campusLocations.map((location) => ({ location, announcements: [] }));
    }
    const groups = [...venueGroups];
    if (
      pinnedLocation &&
      !groups.some((g) => g.location.name === pinnedLocation.name)
    ) {
      groups.push({ location: pinnedLocation, announcements: [] });
    }
    return groups;
  }, [pinnedLocation, venueGroups]);

  return (
    <div className="space-y-4">
      {geoState.status !== "active" ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-stone-900">
                Live location
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {geoState.status === "requesting"
                  ? "Requesting your location so the blue dot can appear on the map."
                  : "Your blue dot is hidden until location access is allowed."}
              </p>
              {"message" in geoState && (
                <p className="mt-2 text-xs text-amber-700">{geoState.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={beginGeoWatch}
              className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Enable location
            </button>
          </div>
        </div>
      ) : null}

      {geoPosition && selectedLocation ? (
        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 shadow-sm">
          <p className="text-sm font-semibold text-stone-900">
            Route preview active
          </p>
          {routeState.status === "ready" ? (
            <p className="mt-1 text-xs text-stone-600">
              Showing the shortest road route snapped to the nearest road points for{" "}
              <span className="font-semibold text-stone-900">
                {selectedLocation.name}
              </span>
              {routeState.distanceMeters != null && routeState.durationSeconds != null
                ? ` · ${Math.round(routeState.distanceMeters)} m · ${Math.ceil(
                    routeState.durationSeconds / 60,
                  )} min`
                : ""}
            </p>
          ) : routeState.status === "error" ? (
            <p className="mt-1 text-xs text-amber-700">{routeState.message}</p>
          ) : null}
        </div>
      ) : selectedLocation ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-stone-900">
            Destination selected
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Turn on location access to see the route from your current position to{" "}
            <span className="font-semibold text-stone-800">{selectedLocation.name}</span>.
          </p>
        </div>
      ) : null}

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
        <div style={{ height: "500px", width: "100%" }}>
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
            <RouteController
              selectedLocation={selectedLocation}
              userPosition={geoPosition ? { lat: geoPosition.lat, lng: geoPosition.lng } : null}
              routePath={routeState.status === "ready" ? routeState.path : null}
            />
            {geoState.status === "active" && geoState.position && (
              <>
                <Circle
                  center={[geoState.position.lat, geoState.position.lng]}
                  radius={Math.max(geoState.position.accuracy / 2, 6)}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#2563eb",
                    fillOpacity: 0.08,
                    weight: 1,
                  }}
                />
                <CircleMarker
                  center={[geoState.position.lat, geoState.position.lng]}
                  radius={7}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                  }}
                />
              </>
            )}
            {routeState.status === "ready" && selectedLocation && (
              <>
                {geoPosition &&
                  routeState.path.length > 0 &&
                  haversineMeters(
                    geoPosition,
                    {
                      lat: routeState.path[0][0],
                      lng: routeState.path[0][1],
                    },
                  ) > 0.5 && (
                    <Polyline
                      positions={[
                        [geoPosition.lat, geoPosition.lng],
                        routeState.path[0],
                      ]}
                      pathOptions={{
                        color: "#94a3b8",
                        weight: 3,
                        opacity: 0.7,
                        lineCap: "round",
                        lineJoin: "round",
                        dashArray: "6 8",
                      }}
                    />
                  )}
                <Polyline
                  positions={routeState.path}
                  pathOptions={{
                    color: "#2563eb",
                    weight: 5,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
                {routeState.path.length > 0 &&
                  haversineMeters(
                    {
                      lat: routeState.path[routeState.path.length - 1][0],
                      lng: routeState.path[routeState.path.length - 1][1],
                    },
                    selectedLocation,
                  ) > 0.5 && (
                    <Polyline
                      positions={[
                        routeState.path[routeState.path.length - 1],
                        [selectedLocation.lat, selectedLocation.lng],
                      ]}
                      pathOptions={{
                        color: "#94a3b8",
                        weight: 3,
                        opacity: 0.7,
                        lineCap: "round",
                        lineJoin: "round",
                        dashArray: "6 8",
                      }}
                    />
                  )}
              </>
            )}
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
                    },
                  }}
                >
                  <Popup>
                    <div className="min-w-[220px] space-y-2">
                      <div>
                        <p className="font-semibold text-stone-900">
                          {group.location.name}
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
