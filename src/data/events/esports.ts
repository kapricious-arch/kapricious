import { DepartmentEvent } from "./types";

export const esportsEvents: DepartmentEvent[] = [
  {
    id: "mini-militia-tournament",
    title: "Mini Militia Tournament",
    teamSize: 5,
    registrationFee: "₹60",
    prizePool: "₹1,500",
    details:
      "A competitive Esports showdown for Mini Militia players at Kapricious 2026. Squad up, coordinate your attacks, and battle through the bracket for the top spot.",
    prizes: ["Winner prize from ₹1,500 pool", "Runner-up prize from ₹1,500 pool"],
    type: "team",
    department: "ESPORTS",
    departmentName: "Esports",
    image: "/images/events/esports/mini-militia.png",
    coordinators: [
      {
        name: "Farhan",
        phone: "+91 85904 33123",
      },
      {
        name: "Ali Ihlas",
        phone: "+91 82810 66448",
      },
      {
        name: "Fathahudheen",
        phone: "+91 94006 68195",
      },
    ],
    date: "March 27, 2026",
    time: "10:30 AM - 4:00 PM",
    venue: "Esports Zone, KMEA Engineering College",
    rules: [
      "Team event; squad composition and match format will be announced by the coordinators",
      "Participants must report before the tournament starts for check-in and lobby allocation",
      "Only registered players will be allowed to compete",
      "Fair play is mandatory; cheating, hacks, or exploit abuse will lead to disqualification",
      "Organizer and referee decisions will be final throughout the tournament",
    ],
    highlights: [
      "Dedicated Esports department event",
      "Competitive Mini Militia bracket",
      "Team-based action gameplay",
      "Live tournament atmosphere at Kapricious 2026",
    ],
  },
  {
    id: "bgmi-tournament",
    title: "BGMI Tournament",
    teamSize: 4,
    registrationFee: "₹50",
    prizePool: "₹1,500",
    details:
      "A BGMI tournament for battle royale fans at Kapricious 2026. Build your squad, survive the drop, and outplay the lobby to claim the title.",
    prizes: ["Winner prize from ₹1,500 pool", "Runner-up prize from ₹1,500 pool"],
    type: "team",
    department: "ESPORTS",
    departmentName: "Esports",
    image: "/images/events/esports/bgmi.png",
    coordinators: [
      {
        name: "Farhan",
        phone: "+91 85904 33123",
      },
      {
        name: "Ali Ihlas",
        phone: "+91 82810 66448",
      },
      {
        name: "Fathahudheen",
        phone: "+91 94006 68195",
      },
    ],
    date: "March 28, 2026",
    time: "10:30 AM - 4:00 PM",
    venue: "Esports Zone, KMEA Engineering College",
    rules: [
      "Team event; match settings, maps, and room rules will be shared by the organizers",
      "All players must complete reporting and lobby setup before the first round",
      "Only registered squads or approved roster members may participate",
      "Use of unfair means, cheats, or unauthorized tools is strictly prohibited",
      "Tournament rulings by organizers will be final",
    ],
    highlights: [
      "BGMI battle royale competition",
      "Squad-based gameplay",
      "Multiple rounds across the tournament window",
      "Esports action on the second day of Kapricious 2026",
    ],
  },
  {
    id: "game-experience-zone",
    title: "Game Experience Zone",
    teamSize: 1,
    registrationFee: "Starts from ₹50",
    prizePool: "Access to Gaming Zone",
    details:
      "An open gaming experience zone running across both days of Kapricious 2026. Drop in, explore different titles, and enjoy the Esports vibe throughout the fest.",
    prizes: ["Interactive gaming access", "On-ground experience"],
    type: "individual",
    department: "ESPORTS",
    departmentName: "Esports",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&h=600&fit=crop",
    coordinators: [
      {
        name: "Farhan",
        phone: "+91 85904 33123",
      },
      {
        name: "Ali Ihlas",
        phone: "+91 82810 66448",
      },
      {
        name: "Fathahudheen",
        phone: "+91 94006 68195",
      },
    ],
    date: "March 27-28, 2026",
    time: "9:30 AM - 4:00 PM",
    venue: "Esports Zone, KMEA Engineering College",
    rules: [
      "The experience zone will be open during the listed time window on both event days",
      "Participants must follow coordinator instructions while using the gaming setup",
      "Handle all equipment carefully and avoid damaging the setup",
      "Queue discipline and fair usage are expected from all participants",
      "Access timings or title rotations may be managed by the organizers on site",
    ],
    highlights: [
      "Open gaming zone across two days",
      "Hands-on play experience",
      "Casual and spectator-friendly setup",
      "Part of the new Esports department lineup",
    ],
  },
];

