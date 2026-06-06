import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { MapPage } from "./components/MapPage";
import { SecretLoginPage } from "../pages/SecretLoginPage";
import { DeanDashboard } from "../pages/DeanDashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { DotGrid } from "./components/DotGrid";
import ClickSpark from "./components/ClickSpark";

function AppContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAF9]">
      <DotGrid />
      <Navigation />
      <ClickSpark
        sparkColor="#f97316"
        sparkSize={10}
        sparkRadius={18}
        sparkCount={8}
        duration={450}
      >
        <main className="relative z-10 min-h-screen pt-24 sm:pt-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
