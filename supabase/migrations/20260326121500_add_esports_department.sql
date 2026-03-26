INSERT INTO public.departments (name, code)
VALUES ('Esports', 'ESPORTS')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name;
