import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Vote {
  id?: string;
  device_id: string;
  team_id: number;
  score: number;
  created_at?: string;
}

export interface Prediction {
  id?: string;
  emp_id: string;
  name: string;
  top1: number;
  top2: number;
  top3: number;
  created_at?: string;
}

export interface TeamStats {
  team_id: number;
  total_votes: number;
  avg_score: number;
}

// Utility functions
export const submitVote = async (teamId: number, score: number, deviceId: string): Promise<void> => {
  const { error } = await supabase
    .from('votes')
    .insert({
      device_id: deviceId,
      team_id: teamId,
      score: score
    });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('You already voted for this team.');
    }
    throw new Error(`Failed to submit vote: ${error.message}`);
  }
};

export const submitPrediction = async (empId: string, name: string, top3: [number, number, number]): Promise<void> => {
  const { error } = await supabase
    .from('predictions')
    .insert({
      emp_id: empId,
      name: name,
      top1: top3[0],
      top2: top3[1],
      top3: top3[2]
    });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('This Employee ID already submitted a prediction.');
    }
    throw new Error(`Failed to submit prediction: ${error.message}`);
  }
};

export const getLeaderboard = async (): Promise<TeamStats[]> => {
  const { data, error } = await supabase
    .from('votes')
    .select('team_id, score')
    .order('team_id');

  if (error) {
    throw new Error(`Failed to fetch leaderboard: ${error.message}`);
  }

  // Group by team_id and calculate stats
  const teamStats: { [key: number]: { total_votes: number; total_score: number } } = {};
  
  data.forEach((vote) => {
    if (!teamStats[vote.team_id]) {
      teamStats[vote.team_id] = { total_votes: 0, total_score: 0 };
    }
    teamStats[vote.team_id].total_votes++;
    teamStats[vote.team_id].total_score += vote.score;
  });

  return Object.entries(teamStats)
    .map(([teamId, stats]) => ({
      team_id: parseInt(teamId),
      total_votes: stats.total_votes,
      avg_score: stats.total_score / stats.total_votes
    }))
    .sort((a, b) => b.avg_score - a.avg_score);
};

export const getPredictions = async (): Promise<Prediction[]> => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch predictions: ${error.message}`);
  }

  return data || [];
};

export const hasDeviceVotedForTeam = async (teamId: number, deviceId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('device_id', deviceId)
    .eq('team_id', teamId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking vote:', error);
    return false;
  }

  return !!data;
};

export const hasEmployeePredicted = async (empId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('predictions')
    .select('id')
    .eq('emp_id', empId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking prediction:', error);
    return false;
  }

  return !!data;
};