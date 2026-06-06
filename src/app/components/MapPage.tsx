import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { MapPin, Navigation2, Info, X } from "lucide-react";

interface Building {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function MapPage() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  const [showRoute, setShowRoute] = useState(false);

  const buildings: Building[] = [
    { id: "main-gate", name: "Main Gate", x: 50, y: 50, width: 80, height: 40 },
    { id: "admin", name: "Administration Block", x: 200, y: 50, width: 120, height: 80 },
    { id: "cs-block", name: "CS Block", x: 400, y: 60, width: 100, height: 100 },
    { id: "is-block", name: "IS Block", x: 550, y: 60, width: 100, height: 100 },
    { id: "ece-block", name: "ECE Seminar Hall", x: 200, y: 200, width: 110, height: 90 },
    { id: "library", name: "Central Library", x: 400, y: 220, width: 130, height: 100 },
    { id: "auditorium", name: "Main Auditorium", x: 580, y: 230, width: 140, height: 110 },
    { id: "canteen", name: "Canteen", x: 50, y: 200, width: 90, height: 60 },
    { id: "chemistry", name: "Chemistry Block", x: 50, y: 320, width: 100, height: 80 },
    { id: "it-block", name: "IT Block", x: 220, y: 350, width: 100, height: 90 },
    { id: "playground", name: "Playground", x: 400, y: 380, width: 200, height: 100 },
    { id: "parking", name: "Parking Area", x: 650, y: 400, width: 120, height: 80 },
  ];

  // Current location (for demo purposes, set to Main Gate)
  const currentLocation = { x: 90, y: 70, name: "Your Location" };

  // Find destination building
  const destinationBuilding = buildings.find((b) =>
    destination?.toLowerCase().includes(b.name.toLowerCase().split(" ")[0])
  );

  useEffect(() => {
    if (destinationBuilding) {
      setShowRoute(true);
    }
  }, [destinationBuilding]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Campus Map</h1>
          <div className="w-20 h-1 bg-primary mb-4"></div>
          <p className="text-gray-600">Navigate through RV College of Engineering campus</p>
        </div>

        {destinationBuilding && (
          <div className="mb-6 bg-primary text-white rounded-xl p-4 flex items-start justify-between border-2 border-primary">
            <div className="flex items-start gap-3">
              <Navigation2 size={24} className="mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">Navigation Active</h3>
                <p className="text-white/90">
                  Route from <span className="font-semibold">{currentLocation.name}</span> to{" "}
                  <span className="font-semibold">{destinationBuilding.name}</span>
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Estimated walking time: 5-8 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRoute(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Map Legend */}
        <div className="mb-6 bg-white rounded-xl p-4 border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Info size={18} className="text-primary" />
            Map Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span className="text-sm text-gray-700">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg"></div>
              <span className="text-sm text-gray-700">Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-primary"></div>
              <span className="text-sm text-gray-700">Suggested Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary rounded"></div>
              <span className="text-sm text-gray-700">Buildings</span>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-white rounded-xl p-8 border-2 border-gray-200">
          <svg
            viewBox="0 0 800 550"
            className="w-full h-auto border-2 border-gray-200 rounded-lg"
            style={{ backgroundColor: "#f9fafb" }}
          >
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="550" fill="url(#grid)" />

            {/* Route line */}
            {showRoute && destinationBuilding && (
              <g>
                <line
                  x1={currentLocation.x}
                  y1={currentLocation.y}
                  x2={destinationBuilding.x + destinationBuilding.width / 2}
                  y2={destinationBuilding.y + destinationBuilding.height / 2}
                  stroke="#F97316"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                  strokeLinecap="round"
                />
                {/* Route markers */}
                <circle cx={currentLocation.x} cy={currentLocation.y} r="3" fill="#F97316" />
                <circle
                  cx={destinationBuilding.x + destinationBuilding.width / 2}
                  cy={destinationBuilding.y + destinationBuilding.height / 2}
                  r="3"
                  fill="#F97316"
                />
              </g>
            )}

            {/* Buildings */}
            {buildings.map((building) => {
              const isDestination = destinationBuilding?.id === building.id;
              return (
                <g key={building.id}>
                  <rect
                    x={building.x}
                    y={building.y}
                    width={building.width}
                    height={building.height}
                    fill={isDestination ? "#F97316" : "#FFEDD5"}
                    stroke={isDestination ? "#F97316" : "#F97316"}
                    strokeWidth={isDestination ? "4" : "2"}
                    rx="4"
                    opacity={isDestination ? "1" : "0.8"}
                    className="transition-all"
                  />
                  <text
                    x={building.x + building.width / 2}
                    y={building.y + building.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isDestination ? "white" : "#F97316"}
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {building.name}
                  </text>
                  {isDestination && (
                    <g>
                      <circle
                        cx={building.x + building.width / 2}
                        cy={building.y - 15}
                        r="8"
                        fill="#F97316"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={building.x + building.width / 2}
                        y={building.y - 15}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                      >
                        📍
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Current Location Marker */}
            <g>
              <circle cx={currentLocation.x} cy={currentLocation.y} r="12" fill="#F97316" opacity="0.3">
                <animate attributeName="r" from="12" to="20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={currentLocation.x} cy={currentLocation.y} r="8" fill="#F97316" stroke="white" strokeWidth="2" />
              <text
                x={currentLocation.x}
                y={currentLocation.y + 25}
                textAnchor="middle"
                fill="#1f2937"
                fontSize="12"
                fontWeight="bold"
              >
                You are here
              </text>
            </g>
          </svg>
        </div>

        {/* Building List */}
        <div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-200">
          <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Campus Buildings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary transition-all cursor-pointer"
              >
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-gray-700 font-medium">{building.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
