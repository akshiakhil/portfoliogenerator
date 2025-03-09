-- Add public read access policy for portfolios
CREATE POLICY "Public read access for portfolios"
  ON portfolios
  FOR SELECT
  TO public
  USING (true);

-- Add public read access policy for projects
CREATE POLICY "Public read access for projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Add public read access policy for skills
CREATE POLICY "Public read access for skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);
