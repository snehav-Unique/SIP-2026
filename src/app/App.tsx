import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { X, ExternalLink } from "lucide-react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { MapPage } from "./components/MapPage";
import { SchedulePage } from "../pages/SchedulePage";
import { SecretLoginPage } from "../pages/SecretLoginPage";
import { DeanDashboard } from "../pages/DeanDashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { DotGrid } from "./components/DotGrid";
import ClickSpark from "./components/ClickSpark";

const RVCE_WEBSITE = "https://rvce.edu.in/";

function StartupNotice() {
  const [open, setOpen] = useState(true);

  const dismiss = () => {
    setOpen(false);
  };

  const goToWebsite = () => {
    window.open(RVCE_WEBSITE, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-stone-200/20 bg-white p-5 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
          aria-label="Close notice"
        >
          <X size={18} />
        </button>

        <div className="pr-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Temporary website
          </p>
          <h2 className="mt-2 text-2xl font-bold text-stone-950">
            Welcome to the RVCE portal
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            This is just a temporary website, visit{" "}
            <a
              href={RVCE_WEBSITE}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-orange-600"
            >
              the official RVCE website
            </a>{" "}
            for the official website.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={goToWebsite}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Go to website
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#FAFAF9]">
      <DotGrid />
      <StartupNotice />
      <div className="relative z-50 shrink-0 px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
        <Navigation />
      </div>
      <div id="main-scroll-container" className="relative z-10 flex-1 overflow-y-auto">
        <ClickSpark
          sparkColor="#f97316"
          sparkSize={10}
          sparkRadius={18}
          sparkCount={8}
          duration={450}
        >
          <main className="min-h-full pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/sipannouncements/secretlogin" element={<SecretLoginPage />} />
              <Route
                path="/sipannouncements/admin"
                element={
                  <ProtectedRoute>
                    <DeanDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </ClickSpark>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
