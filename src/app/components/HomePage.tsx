import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Calendar, FileText, MapPin, Clock, ChevronDown } from "lucide-react";
import { EngineeringBackground } from "./EngineeringBackground";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate floating bubbles in a pleasing grid pattern
    const newBubbles: Bubble[] = [];
    const cols = 6;
    const rows = 4;
    let id = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Skip some positions for variation
        if (Math.random() > 0.65) continue;

        const baseX = (col / (cols - 1)) * 100;
        const baseY = (row / (rows - 1)) * 100;

        // Add slight variation to avoid perfect grid
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;

        newBubbles.push({
          id: id++,
          x: Math.max(5, Math.min(95, baseX + offsetX)),
          y: Math.max(5, Math.min(95, baseY + offsetY)),
          size: 80 + Math.random() * 140,
          duration: 15 + Math.random() * 15,
          delay: (row + col) * 0.5,
        });
      }
    }

    setBubbles(newBubbles);
  }, []);

  const quickStats = [
    { label: "Today's Classes", value: "4", icon: Calendar },
    { label: "Announcements", value: "8", icon: FileText },
    { label: "Active Venues", value: "12", icon: MapPin },
    { label: "Next Class", value: "11:00 AM", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Full Screen Hero Section */}
      <section className="h-screen relative overflow-hidden bg-white flex items-center justify-center">
        {/* Floating Bubbles Background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                background: `radial-gradient(circle at 30% 30%, rgba(255, 237, 213, 0.95), rgba(251, 146, 60, 0.7), rgba(249, 115, 22, 0.3))`,
                filter: 'blur(25px)',
                animation: `floatBubble ${bubble.duration}s ease-in-out infinite`,
                animationDelay: `${bubble.delay}s`,
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
              }}
            />
          ))}
        </div>

        {/* Soft Orange Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 z-0"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-block px-6 py-2 bg-primary/10 border-2 border-primary rounded-full mb-6">
              <span className="text-primary font-semibold">Welcome to RV College of Engineering</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            FIRST YEAR
            <br />
            <span className="text-primary">STUDENTS</span>
          </h1>

          <div className="text-8xl md:text-9xl font-bold text-primary mb-8 relative">
            2026
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
          </div>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
            Welcome, first-year students and parents. Access the latest circulars, venue details,
            timetables, and essential information for the 2026 batch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/announcements")}
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-[#fb923c] transition-colors shadow-lg"
            >
              View Announcements
            </button>
            <button
              onClick={() => navigate("/map")}
              className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Explore Campus Map
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="text-primary" size={32} />
            <p className="text-sm text-gray-600 mt-2">Scroll to explore</p>
          </div>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes floatBubble {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.85;
            }
            25% {
              transform: translate(25px, -35px) scale(1.1);
              opacity: 1;
            }
            50% {
              transform: translate(-25px, 35px) scale(0.9);
              opacity: 0.9;
            }
            75% {
              transform: translate(35px, 15px) scale(1.05);
              opacity: 0.95;
            }
          }
        `}</style>
      </section>

      {/* Content Below Fold */}
      <section className="bg-white py-20 px-6 relative">
        {/* Engineering Background for Content Section */}
        <EngineeringBackground />
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Quick Stats */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Quick Overview</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Access Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div
              onClick={() => navigate("/announcements")}
              className="bg-white rounded-2xl p-10 border-2 border-gray-200 hover:border-primary hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    Latest Updates
                  </h2>
                  <p className="text-gray-600 text-lg">
                    View circulars, timetables, and important notices from the dean and departments
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <FileText className="text-primary group-hover:text-white transition-colors" size={32} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                <span>Explore Announcements</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>

            <div
              onClick={() => navigate("/map")}
              className="bg-primary rounded-2xl p-10 hover:shadow-2xl transition-all cursor-pointer group text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

              <div className="relative flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-3">Campus Navigation</h2>
                  <p className="text-white/90 text-lg">
                    Find your way around the college campus with interactive maps and directions
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <MapPin size={32} />
                </div>
              </div>
              <div className="relative flex items-center gap-2 font-semibold text-lg">
                <span>Open Interactive Map</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
