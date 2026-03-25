UPDATE public.events
SET max_participants = 0
WHERE title IN (
  'InnovateX – Robotics & Tech Talks',
  'Vibe Coding Ideathon'
);

UPDATE public.events
SET max_participants = 0
WHERE title = '7''s Football Tournament';
