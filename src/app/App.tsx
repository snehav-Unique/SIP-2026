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
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/90 px-4 backdrop-blur-[45px]">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-stone-200/20 bg-white p-6 shadow-2xl sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-1">
            Coming Soon
          </p>
          <h2 className="text-2xl font-bold text-stone-950">
            RVCE Student Induction Portal
          </h2>
          <p className="mt-2 text-sm text-stone-500 leading-6">
            This portal will be live during the Student Induction Programme. 
            Scan the QR below to visit the official RVCE website.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-100 mb-6" />

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Scan to visit RVCE
          </p>
          <div className="rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
            <img
              src="/qr_code_sip.png"
              alt="RVCE QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="text-xs text-stone-400 text-center">
            RV College of Engineering · Mysore Road, Bengaluru - 560059
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
