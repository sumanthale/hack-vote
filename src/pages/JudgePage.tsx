import React, { useState, useEffect } from "react";
import { JudgeSelector } from "../components/JudgeSelector";
import { TeamVotingForm } from "../components/TeamVotingForm";
import { JudgeSummary } from "../components/JudgeSummary";
import { StoredJudge } from "../utils/judgeStorage";
import {
  Team,
  JudgeVote,
  getTeams,
  getJudgeVotes,
  getJudgeById,
  submitJudgeFinal,
} from "../services/judgeService";
import { Users, Trophy, Eye } from "lucide-react";

export const JudgePage: React.FC = () => {
  const [selectedJudge, setSelectedJudge] = useState<StoredJudge | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [votes, setVotes] = useState<JudgeVote[]>([]);
  const [currentView, setCurrentView] = useState<"voting" | "summary">("voting");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedJudge) loadJudgeData();
  }, [selectedJudge]);

  const loadJudgeData = async () => {
    if (!selectedJudge) return;
    setLoading(true);
    setError("");
    try {
      const [teamsData, votesData, judgeData] = await Promise.all([
        getTeams(),
        getJudgeVotes(selectedJudge.id),
        getJudgeById(selectedJudge.id),
      ]);
      setTeams(teamsData);
      setVotes(votesData);
      setIsSubmitted(judgeData?.submitted || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const clearJudgeFromStorage = () => {
    localStorage.removeItem("hackathon-selected-judge");
    setSelectedJudge(null);
  };

  const handleVoteSubmitted = () => {
    if (selectedJudge) {
      getJudgeVotes(selectedJudge.id).then(setVotes);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedJudge) return;
    setIsSubmitting(true);
    try {
      await submitJudgeFinal(selectedJudge.id);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit final");
    } finally {
      setIsSubmitting(false);
    }
  };

  const votedTeamsCount = votes.length;
  const totalTeamsCount = teams.length;

  if (!selectedJudge) {
    return (
      <div className="py-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Judge Voting</h1>
        <p className="text-sm text-gray-600">
          Select your judge profile to begin
        </p>
        <JudgeSelector onJudgeSelected={setSelectedJudge} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
        <p className="text-gray-600">Loading judge data...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Judge Voting</h1>
          <p className="text-sm text-gray-600">
        Welcome, <span className="font-medium">{selectedJudge.name}</span>
        <button
          className="ml-2 text-blue-600 underline text-xs"
          onClick={clearJudgeFromStorage}
          type="button"
        >
          Not you? Change Judge
        </button>
          </p>
        </div>

        {!isSubmitted ? (
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
        <button
          onClick={() => setCurrentView("voting")}
          className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition ${
            currentView === "voting"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Users className="w-4 h-4" />
          Vote
        </button>
        <button
          onClick={() => setCurrentView("summary")}
          className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition ${
            currentView === "summary"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Summary
        </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-md text-sm font-medium">
        <Eye className="w-4 h-4" />
        View Only
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {!isSubmitted && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-900">Progress</span>
            <span className="text-gray-600">
              {votedTeamsCount}/{totalTeamsCount} voted
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  totalTeamsCount > 0
                    ? (votedTeamsCount / totalTeamsCount) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Content */}
      {currentView === "voting" ? (
        <div className="space-y-5">
          {teams.map((team) => {
            const existingVote = votes.find((v) => v.team_id === team.id);
            return (
              <TeamVotingForm
                key={team.id}
                team={team}
                judgeId={selectedJudge.id}
                existingVote={existingVote}
                onVoteSubmitted={handleVoteSubmitted}
              />
            );
          })}
        </div>
      ) : (
        <JudgeSummary
          teams={teams}
          votes={votes}
          onFinalSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      )}
    </div>
  );
};
