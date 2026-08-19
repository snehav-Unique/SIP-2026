import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { X, ExternalLink, Download } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
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

const RVCE_WEBSITE = "https://linktr.ee/RVCE?utm_source=qr_code";
const SIP_SCHEDULE_PDF = "/SIP_SCHEDULE_20260818_113721_0000.pdf";
const FIRST_SEMESTER_ACADEMIC_CALENDAR_2026_BATCH_PDF =
  "/First%20Semester%20Academic%20calendar%202026%20Batch.pdf";
const CIRCULAR_1_PDF = "/CIRCULAR%201.pdf";
const SPORTS_CIRCULAR_PDF = "/Sports%20Circular.pdf";

function StartupNotice({
  onOpenCirculars,
}: {
  onOpenCirculars: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/90 px-4 backdrop-blur-[45px]">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-stone-200/20 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Coming Soon
          </p>
          <h2 className="text-2xl font-bold text-stone-950">
            RVCE Student Induction Portal
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            This portal will be live during the <b>Student Induction Programme.</b>
            <br />
            Important Update for the Batch of 2026
            <br />
            Classes are scheduled to begin from August 24, 2026.
            Reporting Time: 9:00 AM 
            <br />
            Venue / Classroom Details: To be announced soon
            <br />
            
          </p>
          
          <p className="mt-2 text-sm leading-6 text-stone-500">
           <b>Please note</b> : The programme is scheduled throughout the day. Skill Lab sessions will be conducted from 2:00 PM to 5:00 PM in the respective departments.
<br></br>
            Please report: &nbsp; by 9:00 AM and plan to be available for the full-day induction programme.
          </p>
        </div>

        <div className="mb-6 h-px bg-stone-100" />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onOpenCirculars}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary"
          >
            <ExternalLink size={15} />
            Circulars
          </button>
          <a
            href={SIP_SCHEDULE_PDF}
            download="SIP-SCHEDULE-2026.pdf"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            <Download size={15} />
            Download the Schedule of 2026 SIP
          </a>
          <a
            href={RVCE_WEBSITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary"
          >
            <ExternalLink size={15} />
            Visit RVCE Website
          </a>
          <p className="text-center text-xs text-stone-400">
            RV College of Engineering · Mysore Road, Bengaluru - 560059
          </p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [circularsOpen, setCircularsOpen] = useState(false);

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#FAFAF9]">
      <DotGrid />
      <StartupNotice onOpenCirculars={() => setCircularsOpen(true)} />
      {circularsOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-stone-950/80 px-4 backdrop-blur-[30px]">
          <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-stone-200/20 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  Circulars
                </p>
                <h2 className="mt-2 text-2xl font-bold text-stone-950">
                  Important Circulars
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Download the circulars below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCircularsOpen(false)}
                className="rounded-full border border-stone-200 p-2 text-stone-500 transition-colors hover:border-primary hover:text-primary"
                aria-label="Close circulars popup"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={FIRST_SEMESTER_ACADEMIC_CALENDAR_2026_BATCH_PDF}
                  download="First Semester Academic calendar 2026 Batch.pdf"
                  className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <Download size={15} />
                  Download First Semester Academic calendar 2026 Batch
                </a>
                <a
                  href={FIRST_SEMESTER_ACADEMIC_CALENDAR_2026_BATCH_PDF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary"
                >
                  <ExternalLink size={15} />
                  View First Semester Academic calendar 2026 Batch
                </a>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={CIRCULAR_1_PDF}
                  download="Inauguration Circular.pdf"
                  className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <Download size={15} />
                  Download Inauguration Circular
                </a>
                <a
                  href={CIRCULAR_1_PDF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary"
                >
                  <ExternalLink size={15} />
                  View Inauguration Circular
                </a>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={SPORTS_CIRCULAR_PDF}
                  download="Sports Circular.pdf"
                  className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <Download size={15} />
                  Download Sports Circular
                </a>
                <a
                  href={SPORTS_CIRCULAR_PDF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-primary hover:text-primary"
                >
                  <ExternalLink size={15} />
                  View Sports Circular
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <Analytics />
    </Router>
  );
}
