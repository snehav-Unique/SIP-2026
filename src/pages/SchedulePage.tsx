import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Download, MapPin, ExternalLink } from "lucide-react";
import { scheduleData, type CycleType } from "../data/scheduleData";
import schedulePdf from "../../Sip-Shedule-2025-old.pdf";

const CYCLE_STORAGE_KEY = "rvce_schedule_cycle";

function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateString));
}

function parseTimeToMinutes(timeStr: string) {
  if (!timeStr) return Number.MAX_SAFE_INTEGER; // Push TBA to end
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + mins;
}

function getVisibleSessions(selectedCycle: CycleType | null) {
  if (!selectedCycle) return [];
  return scheduleData.filter(
    (session) => session.cycle === "Both" || session.cycle === selectedCycle,
  );
}

function CyclePickerModal({
  onSelect,
}: {
  onSelect: (cycle: CycleType) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/90 px-4 py-6 text-white backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 sm:p-7">
        <div className="mb-5 pr-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/90">
            Select your cycle
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Are you Physics or Chemistry cycle?
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Choose your cycle to see only the relevant SIP schedule. Shared events marked for both cycles will still be shown.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(["Physics Cycle", "Chemistry Cycle"] as CycleType[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => onSelect(cycle)}
              className="rounded-2xl border border-white/10 bg-white/10 p-5 text-left transition-transform hover:-translate-y-0.5 hover:bg-white/15"
            >
              <div className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {cycle === "Physics Cycle" ? "Physics" : "Chemistry"}
              </div>
              <h3 className="mt-3 text-xl font-bold text-white">{cycle}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Show only {cycle.toLowerCase()} sessions and the shared sessions for both cycles.
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SchedulePage() {
  const [selectedCycle, setSelectedCycle] = useState<CycleType | null>(() => {
    const stored = window.localStorage.getItem(CYCLE_STORAGE_KEY);
    return stored === "Physics Cycle" || stored === "Chemistry Cycle" ? stored : null;
  });

  const visibleSessions = useMemo(() => getVisibleSessions(selectedCycle), [selectedCycle]);

  const groupedSessions = useMemo(() => {
    const grouped = visibleSessions.reduce<Record<string, typeof visibleSessions>>((acc, session) => {
      if (!acc[session.date]) acc[session.date] = [];
      acc[session.date].push(session);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, items]) => ({
        date,
        items: [...items].sort((a, b) => parseTimeToMinutes(a.time ?? "") - parseTimeToMinutes(b.time ?? "")),
      }));
  }, [visibleSessions]);

  const handleSelectCycle = (cycle: CycleType) => {
    window.localStorage.setItem(CYCLE_STORAGE_KEY, cycle);
    setSelectedCycle(cycle);
  };

  if (!selectedCycle) {
    return <CyclePickerModal onSelect={handleSelectCycle} />;
  }

  const sessionCount = visibleSessions.length;
  const datesCount = groupedSessions.length;
  const sharedCount = visibleSessions.filter((session) => session.cycle === "Both").length;

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <section className="overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(28,25,23,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <CalendarDays size={13} />
                  SIP Schedule
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                  {selectedCycle}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
                Student induction schedule
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
                The page now filters directly to your chosen cycle. Edit the session objects in `src/data/scheduleData.ts` whenever the schedule changes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Sessions</p>
                <p className="mt-2 text-3xl font-bold text-stone-950">{sessionCount}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Dates</p>
                <p className="mt-2 text-3xl font-bold text-stone-950">{datesCount}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Shared</p>
                <p className="mt-2 text-3xl font-bold text-stone-950">{sharedCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                window.localStorage.removeItem(CYCLE_STORAGE_KEY);
                setSelectedCycle(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-primary hover:text-primary"
            >
              Change cycle
            </button>
            <a
              href={schedulePdf}
              download="Sip-Shedule-2025-old.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              <Download size={15} />
              Download Schedule PDF
            </a>
            <a
              href={schedulePdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink size={15} />
              View PDF
            </a>
          </div>
        </section>

        <div className="space-y-4">
          {groupedSessions.map((day) => (
            <section
              key={day.date}
              className="overflow-hidden rounded-[1.75rem] border border-stone-200/70 bg-white/90 shadow-[0_12px_40px_rgba(28,25,23,0.06)]"
            >
              <div className="flex flex-col gap-1 border-b border-stone-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                    {formatShortDate(day.date)}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-stone-950">{formatDateLabel(day.date)}</h2>
                </div>
                <p className="text-sm text-stone-400">
                  {day.items.length} session{day.items.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="grid gap-4 p-5">
                {day.items.map((session) => (
                  <article
                    key={session.id}
                    className="grid gap-4 rounded-2xl border border-stone-100 bg-stone-50/70 p-4 lg:grid-cols-[auto_1fr_auto]"
                  >
                    <div className="flex min-w-24 flex-col items-start justify-center rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Time
                      </span>
                      <span className="mt-1 text-base font-bold text-stone-950">
                        {session.time ?? "TBA"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-stone-950">{session.eventName}</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                          {session.cycle}
                        </span>
                      </div>
                      <p className="max-w-3xl text-sm leading-6 text-stone-500">
                        {session.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-stone-500 lg:min-w-56 lg:items-end">
                      <div className="inline-flex items-center gap-2">
                        <Clock3 size={15} className="text-primary" />
                        <span>{session.time ?? "To be announced"}</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <MapPin size={15} className="text-primary" />
                        <span className="text-right">{session.venue}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
