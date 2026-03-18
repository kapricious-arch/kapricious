import { DepartmentEvent } from "./types";

export const mainEvents: DepartmentEvent[] = [
  {
    id: "fashion-show",
    title: "Vogueza -Fashion Show",
    teamSize: 14,
    registrationFee: "₹250 per head (College teams) / ₹350 per head (Other teams)",
    prizePool: "₹75,000",
    details:
      "Teams present a themed fashion performance featuring an introduction, ramp walk, and final pose. The event evaluates theme representation, costume creativity, stage confidence, and team coordination on the main stage.",
    prizes: ["🥇 ₹50,000", "🥈 ₹25,000"],
    type: "team",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=600&fit=crop",
    date: "March 27, 2026",
    time: "5:30 PM - 7:30 PM",
    venue: "Auditorium",
    rules: [
      "It is an open-theme show; the event does not specify or prefer any theme requirements. Teams are free to explore and present their concept or style of their choice",
      "It is a team event. A team can have 8-14 members",
      "The time limit for every team would be 15 minutes (including setup and the performance)",
      "Negative marking if participants exceed the time limit",
      "Should carry their tracks in pen drive and should be submitted in advance",
      "Vulgarity is strongly prohibited. Any form of obscenity will lead to debarring the team from the contest",
      "Props may be used to enhance the presentation, but must meet the following conditions: must be safe, non-obstructive, and easily portable. Sharp, heavy or hazardous props are strictly prohibited",
      "Judging Criteria: Participants will be judged based on Costume & Creativity, Ramp Walk & Confidence, Overall Presentation",
      "The decision of the judges will be final and binding",
      "Use of cigarettes, alcohol and any unfair means is strongly prohibited"
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
    title: "TAAL TARANG - Group Dance",
    teamSize: 20,
    registrationFee: "₹250 per head",
    prizePool: "₹75,000",
    details:
      "Bring the stage alive with a coordinated team dance performance across classical, western, fusion, or folk formats while following organizer instructions and fest participation guidelines.",
    prizes: ["🥇 ₹50,000", "🥈 ₹25,000"],
    type: "team",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1200&h=600&fit=crop",
    date: "March 27, 2026",
    time: "3:30 PM - 5:30 PM",
    venue: "Auditorium",
    rules: [
      "Each team must comprise a minimum of 8 members and a maximum of 20 members",
      "Time limit for the performance is 5 to 10 minutes. Exceeding this limit may lead to disqualification",
      "One minute will be allotted for the arrangement of the stage prior to the performance",
      "Each participating college can have only one team under this category",
      "Mixed groups from different colleges are not permitted. All members must represent the same college/institution",
      "Sound track must be in MP3 format",
      "Use of properties that may make the dance floor untidy is strictly prohibited and may result in disqualification",
      "The team has to restore the stage to its original condition within the given time limit",
      "Any form of vulgarity or inappropriate content will lead to immediate disqualification",
      "Judging criteria: Synchronization, choreography, creativity, rhythm, stage presence, and overall presentation",
      "The decision of the judges will be final and binding"
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
    title: "Rhythm -Spot Choreo",
    teamSize: 1,
    registrationFee: "₹100",
    prizePool: "₹4,500",
    details:
      "Prepare and perform an on-the-spot choreography based on the music or theme provided by the organizers. Rhythm tests creativity, synchronization, adaptability, expression, and stage energy in a fast-turnaround performance format.",
    prizes: ["🥇 ₹3,000", "🥈 ₹1,500"],
    type: "individual",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=1200&h=600&fit=crop",
    date: "March 27, 2026",
    time: "2:00 PM - 3:30 PM",
    venue: "Auditorium",
    rules: [
      "This is an individual event",
      "Random songs will be played for the contestants",
      "The songs will encompass various languages",
      "All types of dance forms are allowed",
      "Each performance will be allotted a time of 2 minutes",
      "No dangerous props are to be used on stage, such as fire, swords, or knives",
      "Participants must bring a valid ID card on the day of the event",
      "Participants must report at least half an hour prior to the schedule",
      "The decision of the judges will be final and binding"
    ],
    highlights: [
      "Official event title: Rhythm -Spot Choreo",
      "Individual participation only",
      "On-the-spot choreography challenge",
      "Judged on creativity, synchronization, and adaptability"
    ]
  },
  {
    id: "spot-photography",
    title: "PIXORA - Spot Photography",
    teamSize: 1,
    registrationFee: "₹100",
    prizePool: "₹3,000",
    details:
      "Registration starts at 10:00 AM on March 27, 2026. The event begins at 11:00 AM on March 27, 2026 and runs until 11:00 AM on March 28, 2026. PIXORA rewards creativity, technical quality, and how strongly your photograph reflects the given theme and the Kapricious fest spirit.",
    prizes: ["🥇 ₹2,000", "🥈 ₹1,000"],
    type: "individual",
    department: "CULTURAL",
    departmentName: "Cultural Events",
    image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=1200&h=600&fit=crop",
    date: "March 27-28, 2026",
    time: "Registration: 10:00 AM (Mar 27) | Event: 11:00 AM (Mar 27) - 11:00 AM (Mar 28)",
    venue: "Campus Wide, KMEA Engineering College",
    rules: [
      "Open to all registered Kapricious participants",
      "Bring your own DSLR camera or high-end smartphone",
      "Theme will be announced on the spot and photos must be taken only after the announcement",
      "Registration starts at 10:00 AM on March 27, 2026",
      "The event window is from 11:00 AM on March 27, 2026 to 11:00 AM on March 28, 2026",
      "One final JPEG image must be submitted per participant within the event window using the shared drive link",
      "Minimum image size: 1024 x 768 pixels",
      "Submit both the original unedited image and the final edited version",
      "Heavy manipulation or adding/removing elements is not permitted",
      "Plagiarism, stock images, or pre-taken photos will lead to disqualification",
      "Do not disturb people, animals, or the environment and avoid restricted areas",
      "Judging: creativity and originality, technical quality, and relevance to the theme"
    ],
    highlights: [
      "Official event title: PIXORA - Spot Photography",
      "Registration: Mar 27, 10:00 AM",
      "Event: Mar 27, 11:00 AM to Mar 28, 11:00 AM",
      "DSLR or smartphone participation",
      "Judged on originality, technique, and theme relevance"
    ]
  }
];
