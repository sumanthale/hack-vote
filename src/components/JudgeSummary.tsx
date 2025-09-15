import React from "react";
import { Team, JudgeVote } from "../services/judgeService";
import { CheckCircle, AlertCircle, Trophy, MessageSquare } from "lucide-react";

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
  isSubmitted,
}) => {
  const getVoteForTeam = (teamId: number) =>
    votes.find((vote) => vote.team_id === teamId);

  const votedTeams = votes.length;
  const totalTeams = teams.length;
  const allTeamsVoted = votedTeams === totalTeams;

  const sortedTeams = teams
    .map((team) => ({
      ...team,
      vote: getVoteForTeam(team.id),
    }))
    .sort((a, b) => {
      if (a.vote && b.vote)
        return (b.vote.total_score || 0) - (a.vote.total_score || 0);
      if (a.vote && !b.vote) return -1;
      if (!a.vote && b.vote) return 1;
      return a.id - b.id;
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Final Summary
            </h2>
            <p className="text-xs text-gray-500">
              Review before final submission
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-800">Progress</span>
            <span className="text-gray-600">
              {votedTeams}/{totalTeams}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                allTeamsVoted ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${(votedTeams / totalTeams) * 100}%` }}
            />
          </div>
          {!allTeamsVoted && (
            <p className="text-xs text-amber-600 mt-2 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Please complete voting for all teams
            </p>
          )}
        </div>
      </div>

      {/* Teams Summary */}
      <div className="space-y-2">
        {sortedTeams.map((team, index) => {
          const vote = team.vote;
          const hasVoted = !!vote;
          const medal =
            index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

          return (
            <div
              key={team.id}
              className={`bg-white rounded-xl p-3 border flex items-center justify-between transition-all ${
                hasVoted
                  ? "border-green-200 bg-green-50/40"
                  : "border-red-200 bg-red-50/40"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold bg-gray-100">
                  {hasVoted && medal ? medal : team.id}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{team.name}</h3>
                  {hasVoted ? (
                    <>
                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 mt-1">
                        <span>F: {vote?.feasibility}</span>
                        <span>T: {vote?.technical_approach}</span>
                        <span>I: {vote?.innovation}</span>
                        <span>P: {vote?.pitch_presentation}</span>
                      </div>
                      {vote?.comments && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {vote.comments}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-red-600">Not voted</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {hasVoted ? (
                  <>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {vote?.total_score}/40
                      </div>
                      <div className="text-[10px] text-gray-500">Score</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </>
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Submit */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
        {isSubmitted ? (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Submission Complete
            </h3>
            <p className="text-sm text-gray-600">Your votes are locked.</p>
          </div>
        ) : (
          <button
            onClick={onFinalSubmit}
            disabled={!allTeamsVoted || isSubmitting}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
              !allTeamsVoted || isSubmitting
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Submitting...</span>
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                <span className="text-sm">
                  Final Submit ({votedTeams}/{totalTeams})
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
