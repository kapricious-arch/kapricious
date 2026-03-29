export const REGISTRATIONS_CLOSED = true;

export const REGISTRATIONS_CLOSED_MESSAGE =
  "Registrations are closed for all events. Thank you for the overwhelming response.";

export const REGISTRATIONS_CLOSED_DETAIL =
  "Event registrations have been closed across Kapricious 2026. You can still browse event details on the site.";

export const CLOSED_EVENT_IDS = new Set([
  "assemble-x",
  "bgmi-tournament",
  "bridgit",
  "build-a-pc",
  "bug-bounty",
  "cad-combat",
  "code-catastrophe",
  "code-red",
  "css-royale",
  "e-solder",
  "fashion-show",
  "prompt-wars",
  "group-dance",
  "tech-escape-room",
  "hackathon",
  "hazard-huzzle",
  "infrahunt",
  "insight",
  "innovatex",
  "mini-militia-tournament",
  "movethon",
  "power-play-arena",
  "robosoccer",
  "safety-verdict",
  "sevens-football-tournament",
  "spot-photography",
  "step-in-synchro",
]);

export const isEventRegistrationClosed = (eventId?: string | null) =>
  REGISTRATIONS_CLOSED || (!!eventId && CLOSED_EVENT_IDS.has(eventId));
