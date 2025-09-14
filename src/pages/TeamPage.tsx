import React from "react";
import { useParams, Link } from "react-router-dom";
import { VotingInterface } from "../components/VotingInterface";
import { TEAMS } from "../utils/teams";
import { ArrowLeft } from "lucide-react";

export const TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const teamIdNum = teamId ? parseInt(teamId) : null;
  const team = TEAMS.find((t) => t.id === teamIdNum);

  if (!team) {
    return (
      <div className="py-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Team Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The team you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Team Voting</h1>
          <p className="text-sm text-gray-600">Rate this team's performance</p>
        </div>
      </div>

      {/* Team Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-xl font-bold shadow">
            {team.id}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {team.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Voting Interface */}
      <VotingInterface teamId={team.id} teamName={team.name} />
    </div>
  );
};
