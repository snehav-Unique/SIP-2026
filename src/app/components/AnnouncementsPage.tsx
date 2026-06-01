import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, MapPin, Download, Clock, User } from "lucide-react";
import { EngineeringBackground } from "./EngineeringBackground";
import { useAnnouncements } from "../../hooks/useAnnouncements";

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { announcements, getLastUpdated } = useAnnouncements();

  const categories = ["All", "Dean", "Department", "Timetable", "Venue"];

  const filteredAnnouncements =
    selectedCategory === "All"
      ? announcements
      : announcements.filter((a) => a.category === selectedCategory);

  const handleMapNavigation = (location: string) => {
    navigate(`/map?destination=${encodeURIComponent(location)}`);
  };

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
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white">
      <EngineeringBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements</h1>
          <div className="w-20 h-1 bg-primary mb-4"></div>
          <p className="text-gray-600">Stay updated with the latest circulars and notices</p>
          {lastUpdatedTime && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated by Dean: <span className="font-semibold">{getRelativeTime(lastUpdatedTime)}</span>
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Announcements Grid */}
        <div className="grid gap-6">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {announcement.category}
                    </span>
                    {announcement.hasDocument && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center gap-1">
                        <Download size={14} />
                        PDF Available
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{announcement.title}</h2>
                  <p className="text-gray-700 mb-4">{announcement.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={18} className="text-primary" />
                      <span className="font-medium">{announcement.location}</span>
                    </div>
                    <button
                      onClick={() => handleMapNavigation(announcement.location!)}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-[#fb923c] transition-colors flex items-center gap-2"
                    >
                      <MapPin size={16} />
                      View on Map
                    </button>
                  </div>
                </div>
              )}

              {announcement.hasDocument && (
                <div className="mt-4">
                  <button className="w-full px-4 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 border-2 border-primary">
                    <Download size={18} />
                    Download Document (PDF)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
