-- Extend books table to hold all catalog data
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS artist text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS features text,
ADD COLUMN IF NOT EXISTS cover_front_url text,
ADD COLUMN IF NOT EXISTS cover_back_url text,
ADD COLUMN IF NOT EXISTS has_back boolean DEFAULT false;

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id text REFERENCES public.books(id) ON DELETE CASCADE,
    name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date text NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to reviews"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to insert books"
    ON public.books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update books"
    ON public.books FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete books"
    ON public.books FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert reviews"
    ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update reviews"
    ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete reviews"
    ON public.reviews FOR DELETE TO authenticated USING (true);

-- Storage bucket for covers
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Give public access to covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Allow authenticated uploads to covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');
CREATE POLICY "Allow authenticated updates to covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers');
CREATE POLICY "Allow authenticated deletes to covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers');
