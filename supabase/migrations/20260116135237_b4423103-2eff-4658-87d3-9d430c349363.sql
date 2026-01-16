-- Drop the restrictive INSERT policy and create a permissive one
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;

-- Create a new permissive INSERT policy for public reservations
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (true);