import React, { useState, useEffect } from "react";
import { Team, JudgeVote, submitTeamVote } from "../services/judgeService";
import { Save, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface TeamVotingFormProps {
  team: Team;
  judgeId: string;
  existingVote?: JudgeVote;
  onVoteSubmitted: () => void;
}

const CRITERIA = [
  {
    key: "feasibility",
    label: "Feasibility of Solution",
    description: "How realistic and implementable is the solution?",
  },
  {
    key: "technical_approach",
    label: "Technical Approach",
    description: "Quality of technical implementation and architecture",
  },
  {
    key: "innovation",
    label: "Innovation",
    description: "Creativity and uniqueness of the solution",
  },
  {
    key: "pitch_presentation",
    label: "Pitch / Presentation",
    description: "Quality of presentation and communication",
  },
  {
    key: "overall_impression",
    label: "Overall Impression",
    description: "General assessment of the project",
  },
] as const;

export const TeamVotingForm: React.FC<TeamVotingFormProps> = ({
  team,
  judgeId,
  existingVote,
  onVoteSubmitted,
}) => {
  const [scores, setScores] = useState({
    feasibility: existingVote?.feasibility || 0,
    technical_approach: existingVote?.technical_approach || 0,
    innovation: existingVote?.innovation || 0,
    pitch_presentation: existingVote?.pitch_presentation || 0,
    overall_impression: existingVote?.overall_impression || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(!!existingVote);
  const [expanded, setExpanded] = useState(!existingVote);

  useEffect(() => {
    if (existingVote) {
      setScores({
        feasibility: existingVote.feasibility,
        technical_approach: existingVote.technical_approach,
        innovation: existingVote.innovation,
        pitch_presentation: existingVote.pitch_presentation,
        overall_impression: existingVote.overall_impression,
      });
      setHasVoted(true);
      setExpanded(false);
    }
  }, [existingVote]);

  const handleScoreChange = (criterion: keyof typeof scores, score: number) => {
    setScores((prev) => ({ ...prev, [criterion]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allSelected = Object.values(scores).every((s) => s > 0);
    if (!allSelected) {
      setError("Please score all criteria.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await submitTeamVote({ judge_id: judgeId, team_id: team.id, ...scores });
      setHasVoted(true);
      setExpanded(false);
      onVoteSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const isComplete = Object.values(scores).every((s) => s > 0);

  return (
    <div
      className={`rounded-xl border p-4 sm:p-6 transition-all ${
        hasVoted ? "border-green-200 bg-green-50/40" : "border-gray-200 bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg text-white font-bold flex items-center justify-center">
            {team.id}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{team.name}</h3>
         
          </div>
        </div>
        {hasVoted && (
          <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-md text-xs font-medium">
            <CheckCircle className="w-4 h-4" /> Voted
          </span>
        )}
      </div>

      {/* Compact Summary */}
      {hasVoted && !expanded && (
        <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Total: <span className="text-blue-600 font-bold">{totalScore}/25</span>
          </span>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            View <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Expanded Form */}
      {expanded && (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-center font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {CRITERIA.map((criterion) => (
              <div key={criterion.key} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                    {criterion.label}
                  </h4>
                  <p className="text-xs text-gray-500">{criterion.description}</p>
                </div>
                <div className="flex gap-1 sm:gap-2 w-full justify-around">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleScoreChange(criterion.key, score)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-semibold transition ${
                        scores[criterion.key] >= score
                          ? "bg-blue-600 text-white shadow"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-100"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Score */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total Score</span>
                <span className="text-lg sm:text-xl font-bold text-blue-600">{totalScore}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(totalScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isComplete || isSubmitting}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
                !isComplete || isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : hasVoted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {hasVoted ? "Update Vote" : "Submit Vote"}
                </>
              )}
            </button>

            {/* Collapse Button */}
            {hasVoted && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="w-full text-xs text-gray-500 hover:text-gray-700 mt-1 flex justify-center items-center gap-1"
              >
                <ChevronUp className="w-3 h-3" /> Hide
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};
