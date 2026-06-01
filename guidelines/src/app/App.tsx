import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { AnnouncementsPage } from "./components/AnnouncementsPage";
import { MapPage } from "./components/MapPage";
import { DeanPage } from "../pages/DeanPage";

function AppContent() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/dean" element={<DeanPage />} />
        </Routes>
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