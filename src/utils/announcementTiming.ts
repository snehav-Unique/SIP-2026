import type { Announcement } from "../data/announcements";

function parseTimePart(date: Date, timePart: string) {
  const match = timePart.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function getAnnouncementTimeRange(announcement: Announcement) {
  const baseDate = new Date(announcement.date);
  if (Number.isNaN(baseDate.getTime())) return null;

  if (!announcement.time) {
    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(baseDate);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  const [startText, endText] = announcement.time
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean);

  const start = startText ? parseTimePart(baseDate, startText) : null;
  const end = endText ? parseTimePart(baseDate, endText) : null;

  if (start && end) return { start, end };
  if (start) {
  // no end time — keep visible until end of that day
  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);
  return { start, end: endOfDay };
}

  const fallbackStart = new Date(baseDate);
  fallbackStart.setHours(0, 0, 0, 0);
  const fallbackEnd = new Date(baseDate);
  fallbackEnd.setHours(23, 59, 59, 999);
  return { start: fallbackStart, end: fallbackEnd };
}

export function isAnnouncementCurrentOrUpcoming(
  announcement: Announcement,
  now = new Date(),
) {
  const range = getAnnouncementTimeRange(announcement);
  if (!range) return false;
  return range.end.getTime() >= now.getTime();
}
