export interface Announcement {
  id: number;
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
    description:
      "YOUR SESSION IS AT: IS Block from 11:00 to 11:30 AM. Click below for venue details and navigation.",
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
    description: "Tutorial session for Group A students. Please bring your notebooks and calculators.",
    author: "Mathematics Department",
    category: "Department",
  },
  {
    id: 5,
    title: "Library Orientation Session",
    date: "2025-05-29",
    time: "03:00 PM - 04:00 PM",
    location: "Central Library",
    description: "Introduction to library resources and digital databases. All first-year students invited.",
    author: "Library Administration",
    category: "Venue",
  },
  {
    id: 6,
    title: "Workshop on Academic Ethics",
    date: "2025-05-30",
    time: "10:00 AM - 12:00 PM",
    location: "ECE Seminar Hall",
    description: "Important workshop covering plagiarism, citation practices, and academic integrity.",
    author: "Dean of Academics",
    category: "Dean",
    hasDocument: true,
  },
  {
    id: 7,
    title: "Computer Lab Access Schedule",
    date: "2025-05-26",
    location: "IT Block - Lab 1, 2, 3",
    description: "Updated schedule for computer lab access hours. Download the venue map and schedule.",
    author: "IT Department",
    category: "Venue",
    hasDocument: true,
  },
  {
    id: 8,
    title: "Chemistry Practical Batch Schedule",
    date: "2025-05-27",
    time: "09:00 AM - 05:00 PM",
    location: "Chemistry Block",
    description: "Batch-wise schedule for chemistry practicals. Check your batch timings in the PDF.",
    author: "Chemistry Department",
    category: "Timetable",
    hasDocument: true,
  },
];
