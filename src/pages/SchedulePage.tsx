import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Download,
  ExternalLink,
  MapPin,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import AnimatedContent from "../components/AnimatedContent";
import SplitText from "../components/SplitText";
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
  const d = new Date(dateString);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

function parseTimeToMinutes(timeStr: string) {
  if (!timeStr) return Number.MAX_SAFE_INTEGER;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function getSessionDateTime(dateString: string, timeStr?: string) {
  const minutes = parseTimeToMinutes(timeStr ?? "");
  const date = new Date(dateString);
  if (minutes === Number.MAX_SAFE_INTEGER) return date;
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

function getSessionStatus(session: { date: string; time?: string }, now: Date) {
  const startsAt = getSessionDateTime(session.date, session.time);
  const endsAt = new Date(startsAt.getTime() + 90 * 60 * 1000);

  if (now > endsAt) return "completed";
  if (now >= startsAt && now <= endsAt) return "now";
  return "upcoming";
}

function getVisibleSessions(selectedCycle: CycleType | null) {
  if (!selectedCycle) return [];
  return scheduleData.filter(
    (session) => session.cycle === "Both" || session.cycle === selectedCycle,
  );
}

function getAutoScrollDate(groupedSessions: { date: string }[], now: Date) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return (
    groupedSessions.find((day) => new Date(day.date).toDateString() === now.toDateString())?.date ??
    groupedSessions.find((day) => new Date(day.date) >= today)?.date ??
    groupedSessions[0]?.date ??
    null
  );
}

function CyclePickerScreen({ onSelect }: { onSelect: (cycle: CycleType) => void }) {
  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl items-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/95 shadow-[0_24px_80px_rgba(28,25,23,0.10)]">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-stone-950 p-6 text-white sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles size={14} />
                SIP 2026 Schedule
              </span>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                Choose your cycle to build your timeline.
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Your schedule will show sessions for your cycle plus shared events that apply to everyone.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-bold">{scheduleData.length}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/45">Sessions</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-bold">2</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/45">Cycles</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-bold">SIP</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/45">Timeline</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Which cycle are you in?
              </p>
              <div className="mt-5 grid gap-4">
                {(["Physics Cycle", "Chemistry Cycle"] as CycleType[]).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => onSelect(cycle)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <span>
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        {cycle === "Physics Cycle" ? "Physics" : "Chemistry"}
                      </span>
                      <span className="mt-3 block text-xl font-bold text-stone-950">{cycle}</span>
                      <span className="mt-1 block text-sm leading-6 text-stone-500">
                        View a clean timeline for {cycle.toLowerCase()} students.
                      </span>
                    </span>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-primary group-hover:text-white">
                      <ArrowRight size={18} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CycleQuickSwitch({
  selectedCycle,
  onSelect,
}: {
  selectedCycle: CycleType;
  onSelect: (cycle: CycleType) => void;
}) {
  return (
    <div className="flex rounded-full border border-stone-200 bg-stone-100 p-1">
      {(["Physics Cycle", "Chemistry Cycle"] as CycleType[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => onSelect(cycle)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors sm:px-4 ${
            selectedCycle === cycle
              ? "bg-primary text-white shadow-sm"
              : "text-stone-500 hover:text-stone-900"
          }`}
            >
          {cycle === "Physics Cycle" ? "Physics" : "Chemistry"}
            </button>
          ))}
    </div>
  );
}

function EmptyScheduleState() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center">
      <CalendarDays size={28} className="mx-auto text-stone-300" />
      <p className="mt-3 font-semibold text-stone-900">No sessions found for this cycle.</p>
      <p className="mt-1 text-sm text-stone-500">Try switching cycles or checking the PDF schedule.</p>
    </div>
  );
}

export function SchedulePage() {
  const autoScrollTargetRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledRef = useRef(false);
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

  const nextSession = useMemo(() => {
    const now = new Date();
    return [...visibleSessions]
      .sort((a, b) => getSessionDateTime(a.date, a.time).getTime() - getSessionDateTime(b.date, b.time).getTime())
      .find((session) => getSessionStatus(session, now) !== "completed");
  }, [visibleSessions]);

  const handleSelectCycle = (cycle: CycleType) => {
    window.localStorage.setItem(CYCLE_STORAGE_KEY, cycle);
    setSelectedCycle(cycle);
  };

  useEffect(() => {
    if (!selectedCycle || groupedSessions.length === 0 || hasAutoScrolledRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      autoScrollTargetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      hasAutoScrolledRef.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [groupedSessions.length, selectedCycle]);

  if (!selectedCycle) {
    return <CyclePickerScreen onSelect={handleSelectCycle} />;
  }

  const now = new Date();
  const autoScrollDate = getAutoScrollDate(groupedSessions, now);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <section className="overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(28,25,23,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <CalendarDays size={13} />
                  SIP Schedule
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                  {selectedCycle}
                </span>
              </div>
              <AnimatedContent distance={16} duration={0.6} threshold={0.05}>
                <SplitText
                  text="Student induction schedule"
                  tag="h1"
                  splitType="words"
                  textAlign="left"
                  delay={38}
                  duration={0.6}
                  className="mt-4 block text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl"
                />
              </AnimatedContent>
            </div>
            <CycleQuickSwitch selectedCycle={selectedCycle} onSelect={handleSelectCycle} />
          </div>

          {nextSession && (
            <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Next up</p>
                  <h2 className="mt-1 text-base font-bold text-stone-950">{nextSession.eventName}</h2>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{nextSession.description}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-stone-600 sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
                    <Clock3 size={13} className="text-primary" />
                    {nextSession.time ?? "TBA"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
                    <MapPin size={13} className="text-primary" />
                    {nextSession.venue}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                window.localStorage.removeItem(CYCLE_STORAGE_KEY);
                setSelectedCycle(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-primary hover:text-primary"
            >
              <RotateCcw size={15} />
              Change cycle
            </button>
            <a
              href={schedulePdf}
              download="Sip-Shedule-2025-old.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              <Download size={15} />
              Download PDF
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

        {/* Timeline */}
        {groupedSessions.length === 0 ? (
          <EmptyScheduleState />
        ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent sm:left-10" />

          <div className="space-y-0">
            {groupedSessions.map((day, dayIndex) => {
              const dayDate = new Date(day.date);
              const isPast = dayDate < now;
              const isToday = dayDate.toDateString() === now.toDateString();
              const shouldAutoScrollToDay = day.date === autoScrollDate;
              const { day: dayNum, month, year } = formatShortDate(day.date);

              return (
                <AnimatedContent
                  key={day.date}
                  distance={24}
                  duration={0.6}
                  delay={dayIndex * 0.08}
                  threshold={0.05}
                >
                  <div
                    ref={shouldAutoScrollToDay ? autoScrollTargetRef : null}
                    className="relative flex scroll-mt-6 gap-6 pb-10 sm:scroll-mt-8 sm:gap-8"
                  >

                    {/* Date bubble on timeline */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-2xl shadow-lg border-2 transition-all ${
                        isToday
                          ? "bg-primary border-primary text-white shadow-primary/30"
                          : isPast
                          ? "bg-stone-100 border-stone-200 text-stone-400"
                          : "bg-white border-primary/30 text-stone-900"
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-white/80" : isPast ? "text-stone-400" : "text-primary"}`}>
                          {month}
                        </span>
                        <span className={`text-2xl sm:text-3xl font-bold leading-none ${isToday ? "text-white" : isPast ? "text-stone-400" : "text-stone-950"}`}>
                          {dayNum}
                        </span>
                        <span className={`text-[9px] font-semibold ${isToday ? "text-white/60" : isPast ? "text-stone-300" : "text-stone-400"}`}>
                          {year}
                        </span>
                      </div>

                      {/* Today indicator */}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white uppercase tracking-wide shadow">
                          Today
                        </div>
                      )}
                    </div>

                    {/* Sessions for this day */}
                    <div className="flex-1 space-y-3 pt-2">
                      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                        {formatDateLabel(day.date)}
                      </p>

                      {day.items.map((session) => {
                        const status = getSessionStatus(session, now);
                        const sessionIsPast = status === "completed";
                        const sessionIsNow = status === "now";
                        const isBoth = session.cycle === "Both";

                        return (
                          <div
                            key={session.id}
                            className={`relative rounded-2xl border p-4 transition-all hover:shadow-md ${
                              sessionIsNow
                                ? "border-primary bg-white shadow-lg shadow-primary/10"
                                : sessionIsPast
                                ? "border-stone-100 bg-stone-50 opacity-60"
                                : isBoth
                                ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                                : "border-stone-200 bg-white hover:border-primary/30"
                            }`}
                          >
                            {/* Status icon */}
                            <div className="absolute -left-[2.85rem] top-4 sm:-left-[3.35rem]">
                              {sessionIsPast ? (
                                <CheckCircle2 size={16} className="text-stone-300 bg-white rounded-full" />
                              ) : sessionIsNow ? (
                                <Circle size={16} className="text-primary fill-primary/20 bg-white rounded-full" />
                              ) : (
                                <Circle size={16} className={`${isBoth ? "text-primary" : "text-stone-300"} bg-white rounded-full`} />
                              )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-bold text-stone-950">{session.eventName}</h3>
                                  {isBoth ? (
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                                      Both cycles
                                    </span>
                                  ) : sessionIsNow ? (
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                      Happening now
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-stone-500">
                                      {session.cycle}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs leading-5 text-stone-500">{session.description}</p>
                              </div>

                              <div className="flex flex-wrap gap-3 text-xs text-stone-500 sm:flex-col sm:items-end sm:gap-1.5">
                                <span className="inline-flex items-center gap-1.5">
                                  <Clock3 size={12} className="text-primary" />
                                  {session.time ?? "TBA"}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin size={12} className="text-primary" />
                                  {session.venue}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedContent>
              );
            })}

            {/* End of timeline */}
            <div className="relative flex gap-6 sm:gap-8">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50">
                <CalendarDays size={20} className="text-stone-300" />
              </div>
              <div className="flex items-center">
                <p className="text-sm font-semibold text-stone-400">End of SIP Programme</p>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
