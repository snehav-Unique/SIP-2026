export type CampusLocation = {
  name: string;
  lat: number;
  lng: number;
};

export const campusLocations: CampusLocation[] = [
  { name: "Main Gate", lat: 12.92461491, lng: 77.49906443 },
  { name: "Civil Dept", lat: 12.92434254, lng: 77.49946234 },
  { name: "CS Ground", lat: 12.92478366, lng: 77.500082 },
  { name: "CS Dept", lat: 12.92432181, lng: 77.5002764 },
  { name: "Health care", lat: 12.92456754, lng: 77.50076545 },
  { name: "Krishna Hostel", lat: 12.92414421, lng: 77.50061319 },
  { name: "Cauvery hostel", lat: 12.92390398, lng: 77.50100875 },
  { name: "DTH", lat: 12.92339554, lng: 77.49806342 },
  { name: "Gate Parking", lat: 12.92483788, lng: 77.49942787 },
  { name: "BT Quandrangle", lat: 12.92266214, lng: 77.49865535 },
  { name: "Mingos (BT Road)", lat: 12.922315, lng: 77.49945295 },
  { name: "EEE Dept", lat: 12.92428643, lng: 77.50013758 },
  { name: "ECE Dept", lat: 12.92380821, lng: 77.4998891 },
  { name: "ETE Dept", lat: 12.92356807, lng: 77.50018812 },
  { name: "Chem/Phy Dept", lat: 12.92334641, lng: 77.50003018 },
  { name: "Maths Dept", lat: 12.92386568, lng: 77.50124312 },
  { name: "ISE Dept", lat: 12.92327662, lng: 77.50104307 },
  { name: "Library (RVU Entry)", lat: 12.92250284, lng: 77.50010389 },
  { name: "Library (RVCE Entry)", lat: 12.92250079, lng: 77.50039238 },
  { name: "Big MM", lat: 12.9227163, lng: 77.50068719 },
  { name: "Small MM", lat: 12.92347161, lng: 77.49990384 },
  { name: "CCH", lat: 12.92256237, lng: 77.49931 },
  { name: "Nursery", lat: 12.92276351, lng: 77.49956059 },
  { name: "Mingos (Library side)", lat: 12.92250284, lng: 77.49995859 },
  { name: "RVCE Memorial", lat: 12.92259521, lng: 77.4982571 },
  { name: "Gymnatarium", lat: 12.92216829, lng: 77.49924472 },
  { name: "Chamundi Hostel", lat: 12.92227502, lng: 77.50213598 },
  { name: "MV Hostel", lat: 12.92285792, lng: 77.50218021 },
  { name: "International Hostel", lat: 12.92268962, lng: 77.50216547 },
  { name: "DJ Hostel (Girls)", lat: 12.92287639, lng: 77.50318257 },
  { name: "RVCE Back Gate", lat: 12.92375074, lng: 77.5036311 },
  { name: "Architecture Building", lat: 12.92322531, lng: 77.50270876 },
  { name: "RVU Block", lat: 12.92341209, lng: 77.50133999 },
  { name: "IEM Dept", lat: 12.92317464, lng: 77.49875059 },
  { name: "Mech PG Dept", lat: 12.92351535, lng: 77.49834838 },
  { name: "Innovation Centre", lat: 12.92311717, lng: 77.49853159 },
  { name: "Admin Block", lat: 12.92377396, lng: 77.49858423 },
];

export function normalizeLocationName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function resolveCampusLocation(locationText?: string | null) {
  if (!locationText) return null;

  const normalizedSearch = normalizeLocationName(locationText);
  if (!normalizedSearch) return null;

  return (
    campusLocations.find(
      (location) => normalizeLocationName(location.name) === normalizedSearch,
    ) ??
    campusLocations.find((location) =>
      normalizedSearch.includes(normalizeLocationName(location.name)),
    ) ??
    campusLocations.find((location) =>
      normalizeLocationName(location.name).includes(normalizedSearch),
    ) ??
    null
  );
}
