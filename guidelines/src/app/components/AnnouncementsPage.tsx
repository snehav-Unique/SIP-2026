import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, MapPin, Download, Clock, User } from "lucide-react";
import { EngineeringBackground } from "./EngineeringBackground";

interface Announcement {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  author: string;
  category: "Dean" | "Department" | "Timetable" | "Venue";
  hasDocument?: boolean;
}

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const announcements: Announcement[] = [
    {
      id: 1,
      title: "First Year Orientation Program",
      date: "2025-05-28",
      time: "10:00 AM - 12:00 PM",
      location: "Main Auditorium",
      description: "Welcome session for all first-year students. Attendance is mandatory.",
      author: "Dean of Students",
      category: "Dean",
      hasDocument: true,
    },
    {
      id: 2,
      title: "Lab Session - Physics Practical",
      date: "2025-05-27",
      time: "11:00 AM - 11:30 AM",
      location: "IS Block",
      description:
        "YOUR SESSION IS AT: IS Block from 11:00 to 11:30 AM. Click below for venue details and navigation.",
      author: "Physics Department",
      category: "Timetable",
    },
    {
      id: 3,
      title: "Semester Timetable - First Year 2025",
      date: "2025-05-26",
      description: "Complete timetable for the first semester has been released. Download PDF for offline access.",
      author: "Academic Office",
      category: "Timetable",
      hasDocument: true,
    },
    {
      id: 4,
      title: "Mathematics Tutorial - Group A",
      date: "2025-05-27",
      time: "02:00 PM - 03:00 PM",
      location: "CS Block - Room 301",
      description: "Tutorial session for Group A students. Please bring your notebooks and calculators.",
      author: "Mathematics Department",
      category: "Department",
    },
    {
      id: 5,
      title: "Library Orientation Session",
      date: "2025-05-29",
      time: "03:00 PM - 04:00 PM",
      location: "Central Library",
      description: "Introduction to library resources and digital databases. All first-year students invited.",
      author: "Library Administration",
      category: "Venue",
    },
    {
      id: 6,
      title: "Workshop on Academic Ethics",
      date: "2025-05-30",
      time: "10:00 AM - 12:00 PM",
      location: "ECE Seminar Hall",
      description: "Important workshop covering plagiarism, citation practices, and academic integrity.",
      author: "Dean of Academics",
      category: "Dean",
      hasDocument: true,
    },
    {
      id: 7,
      title: "Computer Lab Access Schedule",
      date: "2025-05-26",
      location: "IT Block - Lab 1, 2, 3",
      description: "Updated schedule for computer lab access hours. Download the venue map and schedule.",
      author: "IT Department",
      category: "Venue",
      hasDocument: true,
    },
    {
      id: 8,
      title: "Chemistry Practical Batch Schedule",
      date: "2025-05-27",
      time: "09:00 AM - 05:00 PM",
      location: "Chemistry Block",
      description: "Batch-wise schedule for chemistry practicals. Check your batch timings in the PDF.",
      author: "Chemistry Department",
      category: "Timetable",
      hasDocument: true,
    },
  ];

  const categories = ["All", "Dean", "Department", "Timetable", "Venue"];

  const filteredAnnouncements =
    selectedCategory === "All"
      ? announcements
      : announcements.filter((a) => a.category === selectedCategory);

  const handleMapNavigation = (location: string) => {
    navigate(`/map?destination=${encodeURIComponent(location)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <EngineeringBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements</h1>
          <div className="w-20 h-1 bg-primary mb-4"></div>
          <p className="text-gray-600">Stay updated with the latest circulars and notices</p>
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
