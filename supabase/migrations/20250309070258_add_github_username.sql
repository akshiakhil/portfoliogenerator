-- Add github_username column to portfolios table
ALTER TABLE portfolios
ADD COLUMN github_username text;

-- Update existing RLS policies
DROP POLICY IF EXISTS "Users can read own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can insert own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON portfolios;

-- Recreate policies with github_username
CREATE POLICY "Users can read own portfolios"
  ON portfolios FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own portfolios"
  ON portfolios FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
