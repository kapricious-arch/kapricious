INSERT INTO public.departments (name, code)
VALUES ('Esports', 'ESPORTS')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name;

WITH esports_department AS (
  SELECT id
  FROM public.departments
  WHERE code = 'ESPORTS'
  LIMIT 1
),
canonical(title, description, rules, event_date, venue, image_url, max_participants) AS (
  VALUES
    (
      'Mini Militia Tournament',
      'A competitive Esports showdown for Mini Militia players at Kapricious 2026.',
      E'1. Team event; squad composition and match format will be announced by the coordinators\n2. Participants must report before the tournament starts for check-in and lobby allocation\n3. Only registered players will be allowed to compete\n4. Fair play is mandatory; cheating, hacks, or exploit abuse will lead to disqualification\n5. Organizer and referee decisions will be final throughout the tournament',
      '2026-03-27 10:30:00+05:30'::timestamptz,
      'Esports Zone, KMEA Engineering College',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
      NULL
    ),
    (
      'BGMI Tournament',
      'A BGMI tournament for battle royale fans at Kapricious 2026.',
      E'1. Team event; match settings, maps, and room rules will be shared by the organizers\n2. All players must complete reporting and lobby setup before the first round\n3. Only registered squads or approved roster members may participate\n4. Use of unfair means, cheats, or unauthorized tools is strictly prohibited\n5. Tournament rulings by organizers will be final',
      '2026-03-28 10:30:00+05:30'::timestamptz,
      'Esports Zone, KMEA Engineering College',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
      NULL
    ),
    (
      'Game Experience Zone',
      'An open gaming experience zone running across both days of Kapricious 2026.',
      E'1. The experience zone will be open during the listed time window on both event days\n2. Participants must follow coordinator instructions while using the gaming setup\n3. Handle all equipment carefully and avoid damaging the setup\n4. Queue discipline and fair usage are expected from all participants\n5. Access timings or title rotations may be managed by the organizers on site',
      '2026-03-27 09:30:00+05:30'::timestamptz,
      'Esports Zone, KMEA Engineering College',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600&fit=crop',
      NULL
    )
)
INSERT INTO public.events (title, description, rules, department_id, event_date, venue, image_url, max_participants)
SELECT c.title, c.description, c.rules, d.id, c.event_date, c.venue, c.image_url, c.max_participants
FROM canonical c
CROSS JOIN esports_department d
WHERE NOT EXISTS (
  SELECT 1
  FROM public.events e
  WHERE e.department_id = d.id
    AND e.title = c.title
);

WITH esports_department AS (
  SELECT id
  FROM public.departments
  WHERE code = 'ESPORTS'
  LIMIT 1
),
canonical(title, description, rules, event_date, venue, image_url, max_participants) AS (
  VALUES
    (
      'Mini Militia Tournament',
      'A competitive Esports showdown for Mini Militia players at Kapricious 2026.',
      E'1. Team event; squad composition and match format will be announced by the coordinators\n2. Participants must report before the tournament starts for check-in and lobby allocation\n3. Only registered players will be allowed to compete\n4. Fair play is mandatory; cheating, hacks, or exploit abuse will lead to disqualification\n5. Organizer and referee decisions will be final throughout the tournament',
      '2026-03-27 10:30:00+05:30'::timestamptz,
      'Esports Zone, KMEA Engineering College',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
      NULL
    ),
    (
      'BGMI Tournament',
      'A BGMI tournament for battle royale fans at Kapricious 2026.',
      E'1. Team event; match settings, maps, and room rules will be shared by the organizers\n2. All players must complete reporting and lobby setup before the first round\n3. Only registered squads or approved roster members may participate\n4. Use of unfair means, cheats, or unauthorized tools is strictly prohibited\n5. Tournament rulings by organizers will be final',
      '2026-03-28 10:30:00+05:30'::timestamptz,
      'Esports Zone, KMEA Engineering College',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
      NULL
    ),
    (
      'Game Experience Zone',
      'An open gaming experience zone running across both days of Kapricious 2026.',
      E'1. The experience zone will be open during the listed time window on both event days\n2. Participants must follow coordinator instructions while using the gaming setup\n3. Handle all equipment carefully and avoid damaging the setup\n4. Queue discipline and fair usage are expected from all participants\n5. Access timings or title rotations may be managed by the organizers on site',
      '2026-03-27 09:30:00+05:30'::timestamptz,
      'Esports Zone, KMEA Engineering College',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600&fit=crop',
      NULL
    )
)
UPDATE public.events e
SET
  description = c.description,
  rules = c.rules,
  event_date = c.event_date,
  venue = c.venue,
  image_url = c.image_url,
  max_participants = c.max_participants
FROM canonical c
CROSS JOIN esports_department d
WHERE e.department_id = d.id
  AND e.title = c.title;
