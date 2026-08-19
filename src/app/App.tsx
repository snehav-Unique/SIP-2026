import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ExternalLink } from "lucide-react";
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

const SIP_WEBSITE = "https://sip-dashboard-2026.codingclubrvce.com/";

function StartupNotice() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/90 px-4 backdrop-blur-[45px]">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-stone-200/20 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Official Notice
          </p>
          <h2 className="text-3xl font-bold text-stone-950">
            The SIP Portal Is Now Open
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
            Dear Parents and Guardians, the Student Induction Programme portal is
            now live. You may proceed to the official SIP website to view and
            access the portal.
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
            We request you to use the verified portal link below for all further
            access and updates related to the programme.
          </p>
        </div>

        <div className="mb-6 h-px bg-stone-100" />

        <div className="flex flex-col items-center gap-3">
          <a
            href={SIP_WEBSITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            <ExternalLink size={15} />
            Open SIP Portal
          </a>
          <p className="text-center text-xs leading-5 text-stone-400">
            Please note: the portal is now available for access at the official SIP
            website.
          </p>
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
