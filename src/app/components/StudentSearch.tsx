import { useState } from "react";
import { Search, X, User, GraduationCap, Clock3 as ClockIcon, MapPin as MapPinIcon } from "lucide-react";
import { useStudentSearch } from "../../hooks/useStudentSearch";

export function StudentSearch() {
  const [usn, setUsn] = useState("");
  const { result, searching, notFound, search, clear } = useStudentSearch();

  const handleSearch = () => search(usn);

  const handleClear = () => {
    setUsn("");
    clear();
  };

  // Slot 1/2/3 are just time ranges on this schema — venue is shared, not per-slot
  const slots = result
    ? [
        { number: 1, time: result.slot1 },
        { number: 2, time: result.slot2 },
        { number: 3, time: result.slot3 },
      ].filter((s) => s.time)
    : [];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(28,25,23,0.08)] backdrop-blur sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Find My Details
        </p>
        <h2 className="mt-1 text-xl font-bold text-stone-950">Search by Student ID</h2>
        <p className="mt-1 text-sm text-stone-500">
          Enter your Student ID to find your venue and reporting times.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="e.g. 1RV24AI001"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-xl border border-stone-200 py-3 pl-9 pr-4 text-sm font-semibold tracking-wider outline-none transition focus:border-primary"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!usn.trim() || searching}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {searching ? "..." : "Search"}
        </button>
        {(result || notFound) && (
          <button
            onClick={handleClear}
            className="rounded-xl border border-stone-200 px-3 py-3 text-stone-500 transition hover:border-primary hover:text-primary"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {notFound && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          No student found for USN <strong>{usn}</strong>. Check the USN and try again.
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <User size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {result.usn}
              </p>
              <p className="text-base font-bold text-stone-950">
                {result.group && <span className="mr-2 text-primary">You belong to - group {result.group} &bull;</span>}
                {result.name}
              </p>
            </div>
          </div>

          {result.branch && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-stone-100 bg-white px-3 py-2.5">
              <GraduationCap size={14} className="shrink-0 text-primary" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Branch
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  {result.branch}
                </p>
              </div>
            </div>
          )}

          {result.venue && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-stone-100 bg-white px-3 py-2.5">
              <MapPinIcon size={14} className="shrink-0 text-primary" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Venue
                </p>
                <p className="text-sm font-semibold text-stone-900">{result.venue}</p>
              </div>
            </div>
          )}

          {slots.length > 0 && (
            <div className="space-y-2">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Session Schedule
              </p>
              {slots.map((slot) => (
                <div
                  key={slot.number}
                  className="flex items-center gap-3 rounded-xl border border-stone-100 bg-white px-3 py-2.5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {slot.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon size={12} className="shrink-0 text-primary" />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
                        Time
                      </p>
                      <p className="text-xs font-semibold text-stone-900">
                        {slot.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}