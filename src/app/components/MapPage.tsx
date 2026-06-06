import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { MapPin, Navigation2, X, Building2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's broken default icon paths under Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RVCE_CENTER: [number, number] = [12.9237, 77.4986];

interface BuildingDef {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

const buildings: BuildingDef[] = [
  { id: "main-gate",   name: "Main Gate",             lat: 12.9212, lng: 77.4974, description: "Campus Entry, Mysore Road"         },
  { id: "admin",       name: "Administration Block",   lat: 12.9222, lng: 77.4980, description: "Admissions & Dean Offices"         },
  { id: "cs-block",    name: "CS Block",               lat: 12.9230, lng: 77.4990, description: "Computer Science Department"       },
  { id: "is-block",    name: "IS Block",               lat: 12.9228, lng: 77.4994, description: "Information Science Department"    },
  { id: "ece-block",   name: "ECE Seminar Hall",       lat: 12.9226, lng: 77.4982, description: "Electronics & Communication"       },
  { id: "library",     name: "Central Library",        lat: 12.9235, lng: 77.4985, description: "Main Campus Library"               },
  { id: "auditorium",  name: "Main Auditorium",        lat: 12.9240, lng: 77.4988, description: "Orientation & Events Venue"        },
  { id: "canteen",     name: "Canteen",                lat: 12.9220, lng: 77.4976, description: "Student Food Court"                },
  { id: "chemistry",   name: "Chemistry Block",        lat: 12.9218, lng: 77.4983, description: "Sciences Department"               },
  { id: "it-block",    name: "IT Block",               lat: 12.9233, lng: 77.4987, description: "Information Technology Dept."      },
  { id: "playground",  name: "Playground",             lat: 12.9245, lng: 77.4982, description: "Sports & Recreation Area"          },
  { id: "parking",     name: "Parking Area",           lat: 12.9215, lng: 77.4978, description: "Student & Staff Parking"           },
];

function getInitials(name: string) {
  const words = name.split(" ");
  if (words.length === 1) return name.slice(0, 2).toUpperCase();
  return words
    .filter((w) => !["of", "the", "&", "and"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function makeMarkerIcon(name: string, highlight = false) {
  const bg = highlight ? "#C84D00" : "#F96500";
  const size = highlight ? 36 : 30;
  const initials = getInitials(name);
  return L.divIcon({
    className: "",
    html: `<div style="background:${bg};color:white;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${size <= 30 ? 10 : 11}px;font-weight:800;letter-spacing:0.03em;font-family:'Plus Jakarta Sans',sans-serif;border:2px solid white;box-shadow:0 2px 8px rgba(249,101,0,${highlight ? 0.5 : 0.3});transition:all .15s;">${initials}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

export function MapPage() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(true);

  const destinationBuilding = buildings.find((b) =>
    destination?.toLowerCase().includes(b.name.toLowerCase().split(" ")[0])
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: RVCE_CENTER,
      zoom: 17,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);

    // Campus name label
    L.marker(RVCE_CENTER, {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:rgba(249,101,0,0.92);color:white;border-radius:8px;padding:3px 10px;font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(249,101,0,0.3);pointer-events:none;">RV College of Engineering</div>`,
        iconAnchor: [90, -6],
      }),
      interactive: false,
    }).addTo(map);

    buildings.forEach((b) => {
      const marker = L.marker([b.lat, b.lng], { icon: makeMarkerIcon(b.name) })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:140px"><b style="font-size:13px;color:#0F0D0A">${b.name}</b><br/><span style="color:#78716C;font-size:11px">${b.description}</span></div>`,
          { closeButton: false, offset: [0, -4] }
        );

      marker.on("click", () => {
        setSelectedId(b.id);
        marker.openPopup();
      });

      markersRef.current.set(b.id, marker);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !destinationBuilding) return;
    setSelectedId(destinationBuilding.id);
    mapRef.current.flyTo([destinationBuilding.lat, destinationBuilding.lng], 19, { duration: 1.6 });
    markersRef.current.get(destinationBuilding.id)?.openPopup();
  }, [destinationBuilding]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const b = buildings.find((x) => x.id === id)!;
      marker.setIcon(makeMarkerIcon(b.name, id === selectedId));
    });
  }, [selectedId]);

  const flyTo = (b: BuildingDef) => {
    setSelectedId(b.id);
    mapRef.current?.flyTo([b.lat, b.lng], 19, { duration: 1 });
    markersRef.current.get(b.id)?.openPopup();
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">

        <div>
          <h1 className="font-display text-2xl font-bold text-stone-950 sm:text-3xl">Campus Map</h1>
          <p className="mt-0.5 text-sm text-stone-400">
            RV College of Engineering · Mysore Road, Bengaluru 560059
          </p>
        </div>

        {destinationBuilding && showNav && (
          <div className="flex items-start justify-between gap-3 rounded-xl bg-primary p-3.5 text-white">
            <div className="flex items-start gap-3">
              <Navigation2 size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Navigating to {destinationBuilding.name}</p>
                <p className="text-xs text-white/70">{destinationBuilding.description}</p>
              </div>
            </div>
            <button onClick={() => setShowNav(false)} className="shrink-0 rounded-lg p-1 hover:bg-white/20">
              <X size={15} />
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-stone-200" style={{ height: "56vh", minHeight: 360 }}>
          <div ref={mapContainerRef} className="h-full w-full" />
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white p-3.5 sm:p-4">
          <h2 className="mb-2.5 flex items-center gap-1.5 font-display text-sm font-bold text-stone-950">
            <Building2 size={15} className="text-primary" />
            Campus Buildings
          </h2>
          <div className="grid gap-1.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {buildings.map((b) => (
              <button
                key={b.id}
                onClick={() => flyTo(b)}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all ${
                  selectedId === b.id
                    ? "border-primary/40 bg-primary/8 text-primary"
                    : "border-stone-100 bg-stone-50 hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                  style={{ background: selectedId === b.id ? "#C84D00" : "#F96500" }}
                >
                  {getInitials(b.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-stone-900">{b.name}</p>
                  <p className="truncate text-[10px] text-stone-400 leading-tight">{b.description}</p>
                </div>
                {selectedId === b.id && <MapPin size={11} className="shrink-0 text-primary" />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
