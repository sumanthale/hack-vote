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
  const [expanded, setExpanded] = useState(!existingVote); // expand if new vote

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
      setExpanded(false); // collapse when loaded
    }
  }, [existingVote]);

  const handleScoreChange = (criterion: keyof typeof scores, score: number) => {
    setScores((prev) => ({ ...prev, [criterion]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allScoresSelected = Object.values(scores).every((score) => score > 0);
    if (!allScoresSelected) {
      setError("Please select scores for all criteria");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await submitTeamVote({
        judge_id: judgeId,
        team_id: team.id,
        ...scores,
      });

      setHasVoted(true);
      setExpanded(false); // collapse after submit
      onVoteSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalScore = Object.values(scores).reduce(
    (sum, score) => sum + score,
    0
  );
  const isComplete = Object.values(scores).every((score) => score > 0);

  return (
    <div
      className={`bg-white rounded-2xl p-6 border transition-all ${
        hasVoted ? "border-green-200 bg-green-50/30" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white font-bold flex items-center justify-center">
            {team.id}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
            {team.description && (
              <p className="text-sm text-gray-600">{team.description}</p>
            )}
          </div>
        </div>

        {hasVoted && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Voted</span>
          </div>
        )}
      </div>

      {/* Compact Summary */}
      {hasVoted && !expanded && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
          <span className="font-semibold text-gray-700">
            Total Score:{" "}
            <span className="text-blue-600 font-bold">{totalScore}/25</span>
          </span>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-blue-600 font-medium flex items-center space-x-1 hover:underline"
          >
            <span>View Details</span>
            <ChevronDown className="w-4 h-4" />
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
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {criterion.label}
                  </h4>
                  <p className="text-sm text-gray-600">{criterion.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() =>
                        handleScoreChange(criterion.key, score)
                      }
                      className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                        scores[criterion.key] >= score
                          ? "bg-blue-600 text-white shadow-md"
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
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Score</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalScore}/25
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(totalScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isComplete || isSubmitting}
              className={`w-full font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                !isComplete || isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : hasVoted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{hasVoted ? "Update Vote" : "Submit Vote"}</span>
                </>
              )}
            </button>

            {/* Collapse Button */}
            {hasVoted && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="w-full mt-2 flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Details
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};
