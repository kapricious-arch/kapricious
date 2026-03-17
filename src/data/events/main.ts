import { DepartmentEvent } from "./types";

export const mainEvents: DepartmentEvent[] = [
  {
    id: "fashion-show",
    title: "Fashion Show",
    teamSize: 5,
    registrationFee: "₹250 per head (College teams) / ₹350 per head (Other teams)",
    prizePool: "₹75,000",
    details:
      "Teams present a themed fashion performance featuring an introduction, ramp walk, and final pose. The event evaluates theme representation, costume creativity, stage confidence, and team coordination on the main stage.",
    prizes: ["🥇 ₹50,000", "🥈 ₹25,000"],
    type: "team",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=600&fit=crop",
    date: "March 28, 2026",
    time: "5:30 PM - 7:30 PM",
    venue: "Auditorium",
    rules: [
      "Open to all registered fest participants",
      "Participants must perform in teams",
      "Minimum team size: 5 members",
      "Each team must have a team leader for coordination",
      "Teams must follow the theme provided by the organizers",
      "Teams must report to the venue on time for briefing and coordination",
      "Each team will be given a specific time limit for the ramp walk or performance",
      "Performance should include introduction, ramp walk, and final pose",
      "Background music must be submitted to the organizers before the event",
      "Participants must ensure proper coordination and synchronization",
      "Use of fire, water, or hazardous materials is strictly prohibited",
      "Any vulgarity or inappropriate content will lead to disqualification",
      "Participants are responsible for their costumes and accessories",
      "Judging: theme representation, creativity and innovation, confidence and stage presence, coordination",
      "The judges' decision will be final and binding"
    ],
    highlights: [
      "Theme-based team runway performance",
      "Includes introduction, ramp walk, and final pose",
      "Judged on costume creativity and stage confidence",
      "Largest cultural team prize pool"
    ]
  },
  {
    id: "group-dance",
    title: "Group Dance",
    teamSize: 15,
    registrationFee: "₹250 per head",
    prizePool: "₹75,000",
    details:
      "Bring the stage alive with a coordinated team dance performance across classical, western, fusion, or folk formats while following organizer instructions and fest participation guidelines.",
    prizes: ["🥇 ₹50,000", "🥈 ₹25,000"],
    type: "team",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200&h=600&fit=crop",
    date: "March 28, 2026",
    time: "3:30 PM - 5:30 PM",
    venue: "Auditorium",
    rules: [
      "Open to all registered fest participants",
      "Participants must carry valid ID cards during the event",
      "Registration must be completed before the deadline",
      "Participants must follow all instructions given by the organizers",
      "Team participation applies for this event",
      "Each participant may register for multiple events unless there is a time clash",
      "Substitution of participants is not allowed after registration",
      "Participants must maintain discipline throughout the event",
      "Misconduct, cheating, or unfair means will lead to disqualification",
      "Respect towards judges, organizers, and fellow participants is mandatory",
      "The judges' decision will be final and binding",
      "Results will be announced after evaluation",
      "No disputes regarding results will be entertained",
      "Organizers reserve the right to modify rules if required",
      "Participants are responsible for their belongings",
      "Any damage to property will be the responsibility of the participant"
    ],
    highlights: [
      "Team dance stage event",
      "High-energy auditorium performance slot",
      "Valid for registered fest participants only",
      "Top-tier cultural team prizes"
    ]
  },
  {
    id: "step-in-synchro",
    title: "Rhythm - Spot Choreo",
    teamSize: 5,
    registrationFee: "₹200",
    prizePool: "₹8,000",
    details:
      "Prepare and perform an on-the-spot choreography based on the music or theme provided by the organizers. Rhythm tests creativity, synchronization, adaptability, expression, and stage energy in a fast-turnaround performance format.",
    prizes: ["🥇 ₹5,000", "🥈 ₹3,000"],
    type: "team",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=1200&h=600&fit=crop",
    date: "March 28, 2026",
    time: "2:00 PM - 3:30 PM",
    venue: "Auditorium",
    rules: [
      "Open to all registered fest participants",
      "Solo and team entries are allowed",
      "Team size: 1 to 5 members",
      "Multiple teams from the same college are allowed",
      "Choreography must be prepared on the spot based on the music or theme provided",
      "Preparation time will be given before the performance begins",
      "Performance duration should stay within 3 to 5 minutes",
      "Participants must use the music provided by the organizers",
      "Inappropriate or offensive content is strictly prohibited",
      "Dangerous props or fire are not allowed",
      "Exceeding the time limit may lead to penalties",
      "Any misconduct or rule violation will lead to disqualification",
      "Judging: choreography, synchronization, expression and energy, adaptability",
      "Participants must report to the venue on time",
      "The judges' decision will be final and binding"
    ],
    highlights: [
      "Official event title: Rhythm",
      "Solo or team participation up to 5 members",
      "On-the-spot choreography challenge",
      "Judged on creativity, synchronization, and adaptability"
    ]
  },
  {
    id: "spot-photography",
    title: "Spot Photography - Pixora",
    teamSize: 1,
    registrationFee: "₹100",
    prizePool: "₹3,000",
    details:
      "Capture an original image based on the on-spot theme announcement and submit it within 24 hours. Pixora rewards creativity, technical quality, and how strongly your photograph reflects the given theme and the Kapricious fest spirit.",
    prizes: ["🥇 ₹2,000", "🥈 ₹1,000"],
    type: "individual",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=1200&h=600&fit=crop",
    date: "March 28, 2026",
    time: "10:00 AM - 1:00 PM",
    venue: "Campus Wide, KMEA Engineering College",
    rules: [
      "Open to all registered Kapricious participants",
      "Bring your own DSLR camera or high-end smartphone",
      "Theme will be announced on the spot and photos must be taken only after the announcement",
      "One final JPEG image must be submitted per participant within 24 hours using the shared drive link",
      "Minimum image size: 1024 x 768 pixels",
      "Submit both the original unedited image and the final edited version",
      "Heavy manipulation or adding/removing elements is not permitted",
      "Plagiarism, stock images, or pre-taken photos will lead to disqualification",
      "Do not disturb people, animals, or the environment and avoid restricted areas",
      "Judging: creativity and originality, technical quality, and relevance to the theme"
    ],
    highlights: [
      "Official event title: Pixora",
      "24-hour submission window",
      "DSLR or smartphone participation",
      "Judged on originality, technique, and theme relevance"
    ]
  },
  {
    id: "star-of-kapricious",
    title: "Star of Kapricious",
    teamSize: 1,
    registrationFee: "₹250",
    prizePool: "₹15,000",
    details:
      "A grand talent showcase where individuals perform singing, dancing, standup, instrumental, or any unique act on the main stage.",
    prizes: ["🥇 ₹10,000", "🥈 ₹5,000"],
    type: "individual",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop",
    date: "March 28, 2026",
    time: "5:00 PM - 8:00 PM",
    venue: "Main Auditorium, KMEA Engineering College",
    rules: [
      "Individual participation only",
      "Any talent welcome: singing, dancing, comedy, instruments, etc.",
      "Performance duration: 3-5 minutes",
      "Bring your own instruments or props",
      "Pre-recorded tracks allowed for singers",
      "Judging: talent (40%), stage presence (30%), audience engagement (30%)"
    ],
    highlights: [
      "Grand stage with pro lighting",
      "Celebrity judges",
      "Showcase any talent",
      "Biggest individual prize"
    ]
  }
];
