import { Home, Bell, Map, CalendarDays } from "lucide-react";
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
    { path: "/schedule", label: "Schedule", icon: CalendarDays },
    { path: "/announcements", label: "Notices", icon: Bell },
    { path: "/map", label: "Map", icon: Map },
  ];

  const handleLogoClick = () => {
    navigate("/");
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
    <nav className="relative z-50 w-full">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-stone-200/50 bg-white/50 px-3 py-2 shadow-md shadow-stone-900/5 backdrop-blur-2xl sm:px-4 sm:py-2.5">

        {/* Logo + wordmark */}
        <button
          onClick={handleLogoClick}
          className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-2.5"
        >
          <div className="shrink-0 rounded-lg overflow-hidden border border-stone-200/70 bg-white/80 p-0.5">
            <img
              src={rvceLogo}
              alt="RVCE"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
              style={{ filter: 'brightness(0) contrast(1.1)' }}
            />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-display truncate text-[13px] font-bold leading-tight text-stone-900 sm:text-sm">
              RV College of Engineering
            </p>
            <p className="truncate text-[10px] font-medium text-stone-400 sm:text-[11px]">
              First Year Portal · 2026
            </p>
          </div>
        </button>

        {/* Pill nav group */}
        <div className="flex items-center gap-0.5 rounded-full border border-stone-200/60 bg-stone-100/50 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-4 sm:py-2 ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-stone-500 hover:bg-white/80 hover:text-stone-800"
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}
