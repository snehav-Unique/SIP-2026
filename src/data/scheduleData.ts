export type CycleType = "Physics Cycle" | "Chemistry Cycle";

export interface ScheduleSession {
  id: number;
  date: string;
  eventName: string;
  description: string;
  venue: string;
  time?: string;
  cycle: CycleType | "Both";
}

// Edit these objects directly when the SIP timetable changes.
// Each entry is plain data, so you can update the title, date, venue,
// time, description, or cycle without touching the page component.
export const scheduleData: ScheduleSession[] = [
  {
    id: 1,
    date: "2025-08-25",
    eventName: "SIP 2025-26 Launch",
    description: "Opening ceremony for RVCE Student Induction Programme for 2025 first-year students.",
    venue: "Main Auditorium",
    time: "09:00 AM",
    cycle: "Both",
  },
  {
    id: 2,
    date: "2025-08-25",
    eventName: "Campus to Career",
    description: "Talks on career journey and happiness, followed by departmental skill lab session 1.",
    venue: "Sir M V Hall",
    time: "11:00 AM",
    cycle: "Physics Cycle",
  },
  {
    id: 3,
    date: "2025-08-25",
    eventName: "Campus to Career",
    description: "Talks on career journey and happiness, followed by departmental skill lab session 1.",
    venue: "Civil Seminar Hall",
    time: "02:00 PM",
    cycle: "Chemistry Cycle",
  },
  {
    id: 4,
    date: "2025-08-25",
    eventName: "Skill Lab Session 1",
    description: "Department-wise classroom mapping for skill lab sessions - hands-on activity for all branches.",
    venue: "AIML / CI - Civil Seminar Hall",
    time: "03:30 PM",
    cycle: "Both",
  },
  {
    id: 5,
    date: "2025-08-26",
    eventName: "Academic Orientation",
    description: "Orientation on curriculum, OBE, first-year courses, and interaction with HoDs and faculty.",
    venue: "Sir M V Hall",
    time: "10:00 AM",
    cycle: "Physics Cycle",
  },
  {
    id: 6,
    date: "2025-08-26",
    eventName: "Academic Orientation",
    description: "Orientation on curriculum, OBE, first-year courses, and interaction with HoDs and faculty.",
    venue: "Civil Seminar Hall",
    time: "10:00 AM",
    cycle: "Chemistry Cycle",
  },
  {
    id: 7,
    date: "2025-08-26",
    eventName: "Skill Lab Session 2",
    description: "Second skill lab session focused on communication and problem-solving fundamentals.",
    venue: "Assigned Classrooms",
    time: "02:00 PM",
    cycle: "Both",
  },
  {
    id: 8,
    date: "2025-08-27",
    eventName: "Venue Allotment",
    description: "Branch-wise seminar hall allocation announced for remaining SIP sessions.",
    venue: "Notice Board / Online",
    time: "09:00 AM",
    cycle: "Both",
  },
];
