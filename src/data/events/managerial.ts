import { DepartmentEvent } from "./types";

export const managerialEvents: DepartmentEvent[] = [
  {
    id: "star-of-kapricious",
    title: "Star of Kapricious",
    teamSize: 1,
    registrationFee: "₹150 for KMEA College Students / ₹250 for Other College Students",
    prizePool: "₹15,000",
    details:
      "The stage where you win the title by being unapologetically yourself. Star of Kapricious celebrates personality, attitude, opinions, thoughts, imperfections, and the uniqueness that sets you apart.",
    prizes: ["🥇 ₹10,000", "🥈 ₹5,000"],
    type: "individual",
    department: "MANAGERIAL",
    departmentName: "Managerial Events",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop",
    date: "March 28, 2026",
    time: "Reporting at 9:00 AM",
    venue: "Main Auditorium, KMEA Engineering College",
    rules: [
      "Individual participation only",
      "Open to +2, UG/PG students, and PhD scholars",
      "Participants must report by 9:00 AM on March 28, 2026",
      "Preliminary rounds will be conducted in the forenoon",
      "Main rounds will be conducted in the afternoon",
      "The judge's decision will be final in all matters",
    ],
    highlights: [
      "Individual personality title event",
      "Forenoon prelims and afternoon mains",
      "Open to +2, UG/PG, and PhD participants",
      "A platform to showcase what makes you unique",
    ],
  },
];
