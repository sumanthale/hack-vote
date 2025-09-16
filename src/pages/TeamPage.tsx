import React from "react";
import { useParams, Link } from "react-router-dom";
import { VotingInterface } from "../components/VotingInterface";
import { TEAMS } from "../utils/teams";
import { ArrowLeft, Sparkles, Trophy, Users, Star } from "lucide-react";

export const TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const team = TEAMS.find((t) => t.id === Number(teamId));

  // --- Not Found State ---
  if (!team)
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-50/50 p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-red-200/50 text-center shadow-xl shadow-red-500/10">
          <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 grid place-items-center shadow-lg shadow-red-500/25">
            <span className="text-2xl text-white">❌</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-900">
            Team Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            This team doesn’t exist in our system.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );

  // --- Team Page ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative px-4 py-6 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:scale-110 shadow-md transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Team Voting</h1>
            </div>
            <p className="text-slate-600 text-sm">
              Cast your vote for innovation
            </p>
          </div>
        </div>

        {/* Team Card */}
        <div
          className={`relative group p-8 rounded-3xl backdrop-blur-xl transition border shadow-xl ${"bg-white/80 border-slate-200/40 shadow-blue-500/10"}`}
        >
          <div className="flex items-center gap-6  justify-center">

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-3xl font-black text-slate-900 text-center">
                  {team.name}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-center justify-center">
                <span className="flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm">
                  <Users className="w-4 h-4" /> Team #{team.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Interface */}
        <VotingInterface teamId={team.id} teamName={team.name} />

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm py-6">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            Every vote counts in shaping the future
            <Star className="w-4 h-4" />
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-3 opacity-40" />
        </div>
      </div>
    </div>
  );
};
