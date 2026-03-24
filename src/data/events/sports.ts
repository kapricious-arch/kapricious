import { DepartmentEvent } from "./types";

export const sportsEvents: DepartmentEvent[] = [
  {
    id: "sevens-football-tournament",
    title: "7's Football Tournament",
    teamSize: 14,
    registrationFee: "₹800 per team",
    prizePool: "₹13,000 + Trophies",
    details:
      "Kapricious'26 Sports Fiesta presents a 7's football tournament with cash prizes for the top three teams and trophies for the top two finishers at KMEA College Ground.",
    prizes: ["🥇 ₹7,000 + Trophy", "🥈 ₹4,000 + Trophy", "🥉 ₹2,000"],
    type: "team",
    department: "SPORTS",
    departmentName: "Sports Fiesta",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
    date: "March 24, 2026",
    time: "TBA",
    venue: "KMEA College Ground",
    rules: [
      "7-a-side tournament format with up to 7 substitute players",
      "Minimum 7 members are required per team; up to 14 players can be registered including substitutes",
      "Registration fee is charged per team",
      "Valid college identification may be required",
      "Fixtures and match rules will be announced by organizers",
      "Referee and organizer decisions are final",
      "Unsporting conduct may lead to disqualification",
    ],
    highlights: [
      "Kapricious'26 Sports Fiesta event",
      "Top 3 teams win cash prizes",
      "Trophies for first and second place",
      "Outdoor football tournament at KMEA College Ground",
    ],
  },
];
