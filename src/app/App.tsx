import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { MapPage } from "./components/MapPage";
import { SecretLoginPage } from "../pages/SecretLoginPage";
import { DeanDashboard } from "../pages/DeanDashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { DotGrid } from "./components/DotGrid";

function AppContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <DotGrid />
      <Navigation />
      <main className="relative z-10 pt-20">
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
