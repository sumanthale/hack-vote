/*
  # Create judge voting system tables

  1. New Tables
    - `judges`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `title` (text, unique, not null)
      - `submitted` (boolean, default false)
      - `created_at` (timestamp)
    
    - `teams`
      - `id` (int, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `judge_votes`
      - `id` (uuid, primary key)
      - `judge_id` (uuid, references judges)
      - `team_id` (int, references teams)
      - `feasibility` (int, 1-5 constraint)
      - `technical_approach` (int, 1-5 constraint)
      - `innovation` (int, 1-5 constraint)
      - `pitch_presentation` (int, 1-5 constraint)
      - `overall_impression` (int, 1-5 constraint)
      - `total_score` (int, computed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Unique constraint on (judge_id, team_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (judges need to vote)
*/

-- Create judges table
CREATE TABLE IF NOT EXISTS judges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL UNIQUE,
  submitted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create teams table (separate from existing teams for judges)
CREATE TABLE IF NOT EXISTS teams (
  id int PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create judge_votes table
CREATE TABLE IF NOT EXISTS judge_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  team_id int NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  feasibility int NOT NULL CHECK (feasibility >= 1 AND feasibility <= 10),
  technical_approach int NOT NULL CHECK (technical_approach >= 1 AND technical_approach <= 10),
  innovation int NOT NULL CHECK (innovation >= 1 AND innovation <= 10),
  pitch_presentation int NOT NULL CHECK (pitch_presentation >= 1 AND pitch_presentation <= 10),
  comments text, -- Optional, can be NULL
  total_score int GENERATED ALWAYS AS (
    feasibility + technical_approach + innovation + pitch_presentation
  ) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (judge_id, team_id)
);

-- Enable RLS
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can read judges"
  ON judges
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update judges"
  ON judges
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can read teams"
  ON teams
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read judge_votes"
  ON judge_votes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert judge_votes"
  ON judge_votes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update judge_votes"
  ON judge_votes
  FOR UPDATE
  TO public
  USING (true);

-- Insert sample data
INSERT INTO judges (name, title) VALUES
  ('Lyle Snider', 'SVP, Servicing Applications'),
  ('Biswajit Roy', 'VP, Supplier Lead'),
  ('Chintan Chawla', 'SVP, Global Operations Initiatives & Technology'),
  ('Sherine John', 'SVP, India Credit Leader'),
  ('Lolitha Rao', 'SVP, Technology - India'),
  ('David Chau', 'SVP, Credit Technology Strategy'),
  ('Parthiban Akkini', 'VP, Gen AI Architecture Leader'),
  ('Anil Kumar Kondiparthi', 'VP, Chief Technology Office, India')
ON CONFLICT (title) DO NOTHING;

INSERT INTO teams (id, name, description) VALUES
  (1, 'AI Devs', 'AI-powered solutions for modern challenges'),
  (2, 'AI Resolve', 'Full-stack innovators building the future'),
  (3, 'Codestorm', 'Analytics experts transforming data'),
  (4, 'CodeX-MadeEasy-1', 'Infrastructure masters simplifying complexity'),
  (5, 'Credit yoda', 'Security specialists protecting digital assets'),
  (6, 'Digital RC', 'App development pros creating experiences'),
  (7, 'Fast and Furious', 'Decentralized solutions for tomorrow'),
  (8, 'HCL tech observability', 'Connected device experts'),
  (9, 'HCLTech Credit Advisors', 'Design and usability champions'),
  (10, 'Metric Masters', 'Backend specialists building foundations'),
  (11, 'Neural Ninjas', 'Deployment experts streamlining processes'),
  (12, 'Spark Squad', 'Cutting-edge tech pioneers')
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for judge_votes
CREATE TRIGGER update_judge_votes_updated_at 
    BEFORE UPDATE ON judge_votes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();