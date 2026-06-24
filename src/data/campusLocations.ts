export type LocationCategory = "Academic" | "Hostel" | "Food" | "Facilities" | "Sports" | "Landmarks" | "Gates";

export type CampusLocation = {
  name: string;
  lat: number;
  lng: number;
  category: LocationCategory;
};

export const campusLocations: CampusLocation[] = [
  { name: "Main Gate", lat: 12.92461491, lng: 77.49906443, category: "Gates" },
  { name: "Civil Dept", lat: 12.92434254, lng: 77.49946234, category: "Academic" },
  { name: "CS Ground", lat: 12.92478366, lng: 77.500082, category: "Sports" },
  { name: "CS Dept", lat: 12.92432181, lng: 77.5002764, category: "Academic" },
  { name: "Health care", lat: 12.92456754, lng: 77.50076545, category: "Facilities" },
  { name: "Krishna Hostel", lat: 12.92414421, lng: 77.50061319, category: "Hostel" },
  { name: "Cauvery hostel", lat: 12.92390398, lng: 77.50100875, category: "Hostel" },
  { name: "DTH", lat: 12.92339554, lng: 77.49806342, category: "Facilities" },
  { name: "Gate Parking", lat: 12.92483788, lng: 77.49942787, category: "Gates" },
  { name: "BT Quandrangle", lat: 12.92266214, lng: 77.49865535, category: "Landmarks" },
  { name: "Mingos (BT Road)", lat: 12.922315, lng: 77.49945295, category: "Food" },
  { name: "EEE Dept", lat: 12.92428643, lng: 77.50013758, category: "Academic" },
  { name: "ECE Dept", lat: 12.92380821, lng: 77.4998891, category: "Academic" },
  { name: "ETE Dept", lat: 12.92356807, lng: 77.50018812, category: "Academic" },
  { name: "Chem/Phy Dept", lat: 12.92334641, lng: 77.50003018, category: "Academic" },
  { name: "Maths Dept", lat: 12.92386568, lng: 77.50124312, category: "Academic" },
  { name: "ISE Dept", lat: 12.92327662, lng: 77.50104307, category: "Academic" },
  { name: "Library (RVU Entry)", lat: 12.92250284, lng: 77.50010389, category: "Facilities" },
  { name: "Library (RVCE Entry)", lat: 12.92250079, lng: 77.50039238, category: "Facilities" },
  { name: "Big MM", lat: 12.9227163, lng: 77.50068719, category: "Food" },
  { name: "Small MM", lat: 12.92347161, lng: 77.49990384, category: "Food" },
  { name: "CCH", lat: 12.92256237, lng: 77.49931, category: "Facilities" },
  { name: "Nursery", lat: 12.92276351, lng: 77.49956059, category: "Facilities" },
  { name: "Mingos (Library side)", lat: 12.92250284, lng: 77.49995859, category: "Food" },
  { name: "RVCE Memorial", lat: 12.92259521, lng: 77.4982571, category: "Landmarks" },
  { name: "Gymnatarium", lat: 12.92216829, lng: 77.49924472, category: "Sports" },
  { name: "Chamundi Hostel", lat: 12.92227502, lng: 77.50213598, category: "Hostel" },
  { name: "MV Hostel", lat: 12.92285792, lng: 77.50218021, category: "Hostel" },
  { name: "International Hostel", lat: 12.92268962, lng: 77.50216547, category: "Hostel" },
  { name: "DJ Hostel (Girls)", lat: 12.92287639, lng: 77.50318257, category: "Hostel" },
  { name: "RVCE Back Gate", lat: 12.92375074, lng: 77.5036311, category: "Gates" },
  { name: "Architecture Building", lat: 12.92322531, lng: 77.50270876, category: "Academic" },
  { name: "RVU Block", lat: 12.92341209, lng: 77.50133999, category: "Academic" },
  { name: "IEM Dept", lat: 12.92317464, lng: 77.49875059, category: "Academic" },
  { name: "Mech PG Dept", lat: 12.92351535, lng: 77.49834838, category: "Academic" },
  { name: "Innovation Centre", lat: 12.92311717, lng: 77.49853159, category: "Academic" },
  { name: "Admin Block", lat: 12.92377396, lng: 77.49858423, category: "Academic" },
];

export function normalizeLocationName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function resolveCampusLocation(locationText?: string | null) {
  if (!locationText) return null;

  const normalizedSearch = normalizeLocationName(locationText);
  if (!normalizedSearch) return null;

  const aliasMatches: Record<string, string[]> = {
    "Civil Dept": [
      "civil terrace",
      "civil seminar",
      "civil seminar hall",
      "civil terrace hall",
      "civil block",
      "civil department",
      "civil dept",
    ],
    "Chem/Phy Dept": [
      "chemistry seminar",
      "physics seminar",
      "chem seminar",
      "phy seminar",
      "chem phy",
      "chem physics",
    ],
    "CS Dept": [
      "cs block",
      "cs seminar",
      "computer science",
      "cse dept",
    ],
  };

  const aliasedLocation = campusLocations.find((location) => {
    const aliases = aliasMatches[location.name];
    if (!aliases) return false;
    return aliases.some((alias) => normalizedSearch.includes(normalizeLocationName(alias)));
  });

  if (aliasedLocation) return aliasedLocation;

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
