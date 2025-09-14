/*
  # Create voting system tables

  1. New Tables
    - `votes`
      - `id` (uuid, primary key)
      - `device_id` (text, not null)
      - `team_id` (int, not null)
      - `score` (int, 1-10 constraint)
      - `created_at` (timestamp)
      - Unique constraint on (device_id, team_id)
    
    - `predictions`
      - `id` (uuid, primary key)
      - `emp_id` (text, unique, not null)
      - `name` (text, not null)
      - `top1` (int, not null)
      - `top2` (int, not null)
      - `top3` (int, not null)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since this is a voting app)
*/

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  team_id int NOT NULL,
  score int NOT NULL CHECK (score >= 1 AND score <= 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE (device_id, team_id)
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id text NOT NULL UNIQUE,
  name text NOT NULL,
  top1 int NOT NULL,
  top2 int NOT NULL,
  top3 int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (voting app needs to be accessible to everyone)
CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON votes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read predictions"
  ON predictions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert predictions"
  ON predictions
  FOR INSERT
  TO public
  WITH CHECK (true);