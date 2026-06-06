import { Home, Bell, Map } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useRef, useState } from "react";
import rvceLogo from "../../../RVCE_Logo.png";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/announcements", label: "Announcements", icon: Bell },
    { path: "/map", label: "Map", icon: Map },
  ];

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (clickCountRef.current === 5) {
      setIsUnlocked(true);
      navigate("/sipannouncements/secretlogin");
      clickCountRef.current = 0;
      return;
    }
    timeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      setIsUnlocked(false);
    }, 3000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur shadow-sm z-50 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-3 py-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between">

          {/* Left: Logo + Title */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div onClick={handleLogoClick} className="cursor-pointer">
              <img
                src={rvceLogo}
                alt="RVCE Logo"
                className="h-10 w-10 rounded-full [filter:brightness(0)_contrast(1.2)] sm:h-12 sm:w-12"
              />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-gray-900 sm:text-lg">RV College of Engineering</h1>
              <p className="truncate text-[11px] text-gray-600 sm:text-xs">Student Dashboard</p>
            </div>
          </div>

          {/* Right: Nav links */}
          <div className="flex shrink-0 gap-1.5 sm:gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all sm:px-4 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-accent border border-border"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden font-medium sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}
