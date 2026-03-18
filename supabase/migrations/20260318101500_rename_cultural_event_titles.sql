WITH cultural_department AS (
  SELECT id
  FROM public.departments
  WHERE code = 'CULTURAL'
  LIMIT 1
)
UPDATE public.events e
SET title = CASE e.title
  WHEN 'Fashion Show' THEN 'Vogueza -Fashion Show'
  WHEN 'Group Dance' THEN 'TAAL TARANG - Group Dance'
  WHEN 'Step in Synchro' THEN 'Rhythm -Spot Choreo'
  WHEN 'Spot Choreo' THEN 'Rhythm -Spot Choreo'
  WHEN 'Spot Photography' THEN 'PIXORA - Spot Photography'
  ELSE e.title
END
FROM cultural_department cd
WHERE e.department_id = cd.id
  AND e.title IN (
    'Fashion Show',
    'Group Dance',
    'Step in Synchro',
    'Spot Choreo',
    'Spot Photography'
  );
