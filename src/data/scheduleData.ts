export type GroupType = "Group A" | "Group B";

export interface ScheduleSession {
  id: number;
  date: string;
  eventName: string;
  description: string;
  venue: string;
  time?: string;
  group: GroupType;
}

export const scheduleData: ScheduleSession[] = [
  {
    id: 1,
    date: "2026-08-24",
    eventName: "Orientation Address by the Principal",
    description:
      "Welcome and orientation address marking the beginning of the Student Induction Programme at RV College of Engineering.",
    venue: "RVCE",
    time: "09:15 AM - 10:30 AM",
    group: "Group A",
  },
  {
    id: 2,
    date: "2026-08-24",
    eventName: "Student Induction Programme",
    description:
      "Overview, objectives and schedule of the Student Induction Programme by the Office of Dean Student Affairs.",
    venue: "RVCE",
    time: "10:30 AM - 11:00 AM",
    group: "Group A",
  },
  {
    id: 3,
    date: "2026-08-24",
    eventName: "Interaction with HoDs, Faculty & Mentors",
    description:
      "Familiarization with the department and programme, vision and mission, professional societies, laboratories, workshops, facilities, programme outcomes and programme-specific outcomes.",
    venue: "Respective Departments",
    time: "11:30 AM - 01:00 PM",
    group: "Group A",
  },
  {
    id: 4,
    date: "2026-08-25",
    eventName: "Sports Facilities and Physical Well-being",
    description:
      "Orientation to sports facilities and physical well-being resources available at RVCE.",
    venue: "RVCE",
    time: "09:05 AM - 09:50 AM",
    group: "Group A",
  },
  {
    id: 5,
    date: "2026-08-25",
    eventName: "Library Orientation",
    description:
      "Introduction to library resources, digital learning platforms and accessing knowledge resources at RVCE.",
    venue: "RVCE Library",
    time: "10:00 AM - 10:45 AM",
    group: "Group A",
  },
  {
    id: 6,
    date: "2026-08-25",
    eventName: "Training and Placement Orientation",
    description:
      "Orientation on training and placement activities and preparation for career success.",
    venue: "RVCE",
    time: "11:15 AM - 12:00 PM",
    group: "Group A",
  },
  {
    id: 7,
    date: "2026-08-25",
    eventName: "Health and Wellness Awareness",
    description:
      "Awareness session covering the ill effects of tobacco, alcohol and substance abuse.",
    venue: "RVCE",
    time: "12:15 PM - 01:00 PM",
    group: "Group A",
  },
  {
    id: 8,
    date: "2026-08-25",
    eventName: "Universal Human Values",
    description:
      "Session on building character, ethics, responsible citizenship and holistic human values conducted by the Disha Bharath Team.",
    venue: "RVCE",
    time: "09:15 AM - 01:00 PM",
    group: "Group B",
  },
  {
    id: 9,
    date: "2026-08-26",
    eventName: "Id-Milad Holiday",
    description: "Holiday on account of Id-Milad. No Student Induction Programme sessions scheduled.",
    venue: "RVCE",
    group: "Group A",
  },
  {
    id: 10,
    date: "2026-08-27",
    eventName: "Universal Human Values",
    description:
      "Session on building character, ethics, responsible citizenship and holistic human values conducted by the Disha Bharath Team.",
    venue: "RVCE",
    time: "09:15 AM - 01:00 PM",
    group: "Group A",
  },
  {
    id: 11,
    date: "2026-08-27",
    eventName: "Sports Facilities and Physical Well-being",
    description:
      "Orientation to sports facilities and physical well-being resources available at RVCE.",
    venue: "RVCE",
    time: "09:05 AM - 09:50 AM",
    group: "Group B",
  },
  {
    id: 12,
    date: "2026-08-27",
    eventName: "Library Orientation",
    description:
      "Introduction to library resources, digital learning platforms and accessing knowledge resources at RVCE.",
    venue: "RVCE Library",
    time: "10:00 AM - 10:45 AM",
    group: "Group B",
  },
  {
    id: 13,
    date: "2026-08-27",
    eventName: "Training and Placement Orientation",
    description:
      "Orientation on training and placement activities and preparation for career success.",
    venue: "RVCE",
    time: "11:15 AM - 12:00 PM",
    group: "Group B",
  },
  {
    id: 14,
    date: "2026-08-27",
    eventName: "Health and Wellness Awareness",
    description:
      "Awareness session covering the ill effects of tobacco, alcohol and substance abuse.",
    venue: "RVCE",
    time: "12:15 PM - 01:00 PM",
    group: "Group B",
  },
  {
    id: 15,
    date: "2026-08-27",
    eventName: "Online Orientation to Student Clubs",
    description:
      "Online orientation introducing student clubs, followed by ticket booking for the Club Showcase.",
    venue: "Online",
    time: "07:00 PM - 09:00 PM",
    group: "Group B",
  },
  {
    id: 16,
    date: "2026-08-28",
    eventName: "Student Clubs Showcase",
    description:
      "Showcase of the technical, cultural and innovation ecosystem at RVCE, introducing students to various clubs and student communities.",
    venue: "RVCE Campus",
    time: "09:00 AM - 04:45 PM",
    group: "Group A",
  },
  {
    id: 17,
    date: "2026-08-29",
    eventName: "Student Clubs Showcase",
    description:
      "Continuation of the Student Clubs Showcase featuring the technical, cultural and innovation ecosystem at RVCE.",
    venue: "RVCE Campus",
    time: "09:00 AM - 02:00 PM",
    group: "Group B",
  },
];
