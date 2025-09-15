import React from 'react';
import { Team, JudgeVote } from '../services/judgeService';
import { CheckCircle, AlertCircle, Trophy } from 'lucide-react';

interface JudgeSummaryProps {
  teams: Team[];
  votes: JudgeVote[];
  onFinalSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export const JudgeSummary: React.FC<JudgeSummaryProps> = ({
  teams,
  votes,
  onFinalSubmit,
  isSubmitting,
  isSubmitted
}) => {
  const getVoteForTeam = (teamId: number) => {
    return votes.find(vote => vote.team_id === teamId);
  };

  const votedTeams = votes.length;
  const totalTeams = teams.length;
  const allTeamsVoted = votedTeams === totalTeams;

  const sortedTeams = teams.map(team => ({
    ...team,
    vote: getVoteForTeam(team.id)
  })).sort((a, b) => {
    if (a.vote && b.vote) {
      return (b.vote.total_score || 0) - (a.vote.total_score || 0);
    }
    if (a.vote && !b.vote) return -1;
    if (!a.vote && b.vote) return 1;
    return a.id - b.id;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Final Summary</h2>
            <p className="text-sm text-gray-600">Review your votes before final submission</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Voting Progress</span>
            <span className="text-sm font-medium text-gray-600">{votedTeams}/{totalTeams} teams</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                allTeamsVoted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(votedTeams / totalTeams) * 100}%` }}
            />
          </div>
          {!allTeamsVoted && (
            <p className="text-sm text-amber-600 mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Please vote for all teams before final submission
            </p>
          )}
        </div>
      </div>

      {/* Teams Summary */}
      <div className="space-y-3">
        {sortedTeams.map((team, index) => {
          const vote = team.vote;
          const hasVoted = !!vote;

          return (
            <div
              key={team.id}
              className={`bg-white rounded-2xl p-4 border transition-all ${
                hasVoted ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    hasVoted && vote ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {hasVoted && vote && index < 3 ? (
                      index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                    ) : (
                      team.id
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    {hasVoted ? (
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                        <span>F: {vote?.feasibility}/5</span>
                        <span>T: {vote?.technical_approach}/5</span>
                        <span>I: {vote?.innovation}/5</span>
                        <span>P: {vote?.pitch_presentation}/5</span>
                        <span>O: {vote?.overall_impression}/5</span>
                      </div>
                    ) : (
                      <span className="text-sm text-red-600">Not voted</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {hasVoted ? (
                    <>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{vote?.total_score}/25</div>
                        <div className="text-xs text-gray-600">Total Score</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </>
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Submit Button */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submission Complete!</h3>
              <p className="text-gray-600">Your votes have been submitted and locked.</p>
            </div>
          </div>
        ) : (
          <button
            onClick={onFinalSubmit}
            disabled={!allTeamsVoted || isSubmitting}
            className={`w-full font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 ${
              !allTeamsVoted || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Final...</span>
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5" />
                <span>Final Submit ({votedTeams}/{totalTeams})</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};