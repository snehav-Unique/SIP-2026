export interface Announcement {
  id: string | number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  author: string;
  category: "Dean" | "Department" | "Timetable" | "Venue";
  hasDocument?: boolean;
}

export const defaultAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "First Year Orientation Program",
    date: "2025-05-28",
    time: "10:00 AM - 12:00 PM",
    location: "Main Auditorium",
    description: "Welcome session for all first-year students. Attendance is mandatory.",
    author: "Dean of Students",
    category: "Dean",
    hasDocument: true,
  },
  {
    id: 2,
    title: "Lab Session - Physics Practical",
    date: "2025-05-27",
    time: "11:00 AM - 11:30 AM",
    location: "IS Block",
    description: "Your session is at IS Block from 11:00 to 11:30 AM. Click below for venue details and navigation.",
    author: "Physics Department",
    category: "Timetable",
  },
  {
    id: 3,
    title: "Semester Timetable - First Year 2025",
    date: "2025-05-26",
    description: "Complete timetable for the first semester has been released. Download PDF for offline access.",
    author: "Academic Office",
    category: "Timetable",
    hasDocument: true,
  },
  {
    id: 4,
    title: "Mathematics Tutorial - Group A",
    date: "2025-05-27",
    time: "02:00 PM - 03:00 PM",
    location: "CS Block - Room 301",
    description: "Tutorial session for Group A students in CS Block Room 301.",
    author: "Mathematics Department",
    category: "Department",
  },
];
