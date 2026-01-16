-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;

-- Create a permissive policy that allows anyone to create reservations
CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);