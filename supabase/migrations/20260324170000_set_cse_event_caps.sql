UPDATE public.events
SET max_participants = 15
WHERE title = 'Hackathon';

UPDATE public.events
SET max_participants = 15
WHERE title IN ('Realm Of Secrets', 'Tech Escape Room');

UPDATE public.events
SET max_participants = 30
WHERE title = 'Bug Bounty';

UPDATE public.events
SET max_participants = 10
WHERE title = 'Build a PC';

UPDATE public.events
SET max_participants = 15
WHERE title = 'Prompt Wars';
