CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL DEFAULT 'Ideas',
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_blog_posts" ON blog_posts;
CREATE POLICY "public_read_published_blog_posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_manage_blog_posts" ON blog_posts;
CREATE POLICY "authenticated_manage_blog_posts" ON blog_posts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);