import { Home, Bell, Map } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/announcements", label: "Announcements", icon: Bell },
    { path: "/map", label: "Map", icon: Map },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">RV</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">RV College of Engineering</h1>
              <p className="text-xs text-gray-600">Student Dashboard</p>
            </div>
          </div>

          <div className="flex gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-accent border border-border"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
