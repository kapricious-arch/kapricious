DO $$
DECLARE
  sf_department_id UUID;
  sfe_department_id UUID;
BEGIN
  SELECT id INTO sf_department_id
  FROM public.departments
  WHERE code = 'SF'
  LIMIT 1;

  SELECT id INTO sfe_department_id
  FROM public.departments
  WHERE code = 'SFE'
  LIMIT 1;

  IF sf_department_id IS NOT NULL AND sfe_department_id IS NULL THEN
    UPDATE public.departments
    SET code = 'SFE',
        name = 'Safety & Fire Engineering'
    WHERE id = sf_department_id;
  ELSIF sf_department_id IS NOT NULL AND sfe_department_id IS NOT NULL THEN
    UPDATE public.events
    SET department_id = sfe_department_id
    WHERE department_id = sf_department_id;

    UPDATE public.registrations
    SET department_id = sfe_department_id
    WHERE department_id = sf_department_id;

    DELETE FROM public.departments
    WHERE id = sf_department_id;
  ELSIF sfe_department_id IS NOT NULL THEN
    UPDATE public.departments
    SET name = 'Safety & Fire Engineering'
    WHERE id = sfe_department_id;
  END IF;
END $$;

UPDATE public.events
SET venue = CASE venue
  WHEN 'D301' THEN 'D301 (Auditorium Block)'
  WHEN 'D302' THEN 'D302 (Auditorium Block)'
  WHEN 'D303' THEN 'D303 (Auditorium Block)'
  WHEN 'Bus Bay, D301, Corridor of D301, Premise of HOD Cabin, SFE, External Staircase of Green Block'
    THEN 'Bus Bay, D301 (Auditorium Block), Garage (Auditorium Block), External Staircase of Green Block'
  ELSE venue
END
WHERE venue IN (
  'D301',
  'D302',
  'D303',
  'Bus Bay, D301, Corridor of D301, Premise of HOD Cabin, SFE, External Staircase of Green Block'
);
