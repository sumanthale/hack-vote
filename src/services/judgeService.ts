import { supabase } from './supabase';

// Types
export interface Judge {
  id: string;
  name: string;
  title: string;
  submitted: boolean;
  created_at?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface JudgeVote {
  id?: string;
  judge_id: string;
  team_id: number;
  feasibility: number;
  technical_approach: number;
  innovation: number;
  pitch_presentation: number;
  comments?: string;   // optional comments field
  total_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamResult {
  team_id: number;
  team_name: string;
  team_description?: string;
  avg_total_score: number;
  avg_feasibility: number;
  avg_technical_approach: number;
  avg_innovation: number;
  avg_pitch_presentation: number;
  judge_count: number;
}
export interface JudgeScoreDetail {
  team_id: number;
  team_name: string;
  judge_id: string;
  judge_name: string;
  feasibility: number;
  technical_approach: number;
  innovation: number;
  pitch_presentation: number;
  total_score: number;
}

// Judge operations
export const getJudges = async (): Promise<Judge[]> => {
  const { data, error } = await supabase
    .from('judges')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch judges: ${error.message}`);
  }

  return data || [];
};

export const getJudgeById = async (judgeId: string): Promise<Judge | null> => {
  const { data, error } = await supabase
    .from('judges')
    .select('*')
    .eq('id', judgeId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch judge: ${error.message}`);
  }

  return data;
};

export const submitJudgeFinal = async (judgeId: string): Promise<void> => {
  const { error } = await supabase
    .from('judges')
    .update({ submitted: true })
    .eq('id', judgeId);

  if (error) {
    throw new Error(`Failed to submit final: ${error.message}`);
  }
};

// Team operations
export const getTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('id');

  if (error) {
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }

  return data || [];
};

// Vote operations
export const getJudgeVotes = async (judgeId: string): Promise<JudgeVote[]> => {
  const { data, error } = await supabase
    .from('judge_votes')
    .select('*')
    .eq('judge_id', judgeId)
    .order('team_id');

  if (error) {
    throw new Error(`Failed to fetch votes: ${error.message}`);
  }

  return data || [];
};

export const submitTeamVote = async (
  vote: Omit<JudgeVote, 'id' | 'total_score' | 'created_at' | 'updated_at'>
): Promise<void> => {
  const { error } = await supabase
    .from('judge_votes')
    .upsert(vote, { onConflict: 'judge_id,team_id' });

  if (error) {
    throw new Error(`Failed to submit vote: ${error.message}`);
  }
};

// Results operations
export const getJudgeResults = async (): Promise<TeamResult[]> => {
  const { data, error } = await supabase
    .from('judge_votes')
    .select(`
      team_id,
      feasibility,
      technical_approach,
      innovation,
      pitch_presentation,
      total_score,
      teams!inner(name, description)
    `);

  if (error) {
    throw new Error(`Failed to fetch results: ${error.message}`);
  }

  // Group by team and calculate averages
  const teamResults: { [key: number]: TeamResult } = {};

  data?.forEach((vote: any) => {
    const teamId = vote.team_id;

    if (!teamResults[teamId]) {
      teamResults[teamId] = {
        team_id: teamId,
        team_name: vote.teams.name,
        team_description: vote.teams.description,
        avg_total_score: 0,
        avg_feasibility: 0,
        avg_technical_approach: 0,
        avg_innovation: 0,
        avg_pitch_presentation: 0,
        judge_count: 0
      };
    }

    const result = teamResults[teamId];
    result.judge_count++;
    result.avg_total_score += vote.total_score;
    result.avg_feasibility += vote.feasibility;
    result.avg_technical_approach += vote.technical_approach;
    result.avg_innovation += vote.innovation;
    result.avg_pitch_presentation += vote.pitch_presentation;
  });

  // Calculate final averages
  Object.values(teamResults).forEach(result => {
    if (result.judge_count > 0) {
      result.avg_total_score = result.avg_total_score / result.judge_count;
      result.avg_feasibility = result.avg_feasibility / result.judge_count;
      result.avg_technical_approach = result.avg_technical_approach / result.judge_count;
      result.avg_innovation = result.avg_innovation / result.judge_count;
      result.avg_pitch_presentation = result.avg_pitch_presentation / result.judge_count;
    }
  });

  return Object.values(teamResults).sort((a, b) => b.avg_total_score - a.avg_total_score);
};
export const getJudgeScores = async (): Promise<JudgeScoreDetail[]> => {
  const { data, error } = await supabase
    .from('judge_votes')
    .select(`
      team_id,
      feasibility,
      technical_approach,
      innovation,
      pitch_presentation,
      total_score,
      judges!inner(id, name),
      teams!inner(name)
    `)
    .order('team_id');

  if (error) {
    throw new Error(`Failed to fetch judge scores: ${error.message}`);
  }

  return (
    data?.map((vote: any) => ({
      team_id: vote.team_id,
      team_name: vote.teams.name,
      judge_id: vote.judges.id,
      judge_name: vote.judges.name,
      feasibility: vote.feasibility,
      technical_approach: vote.technical_approach,
      innovation: vote.innovation,
      pitch_presentation: vote.pitch_presentation,
      total_score: vote.total_score
    })) || []
  );
};