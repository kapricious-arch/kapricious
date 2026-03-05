-- Add team_members column to registrations table for team events
ALTER TABLE public.registrations ADD COLUMN team_members JSONB DEFAULT NULL;

-- Add team_size column to track selected team size
ALTER TABLE public.registrations ADD COLUMN team_size INT DEFAULT 1;

COMMENT ON COLUMN public.registrations.team_members IS 'JSON array of team member names for team events. E.g., ["Alice", "Bob", "Charlie"]';
COMMENT ON COLUMN public.registrations.team_size IS 'Selected team size for this registration';
