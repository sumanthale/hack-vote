import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TEAMS } from "../utils/teams";
import { ArrowRight, CheckCircle, Vote } from "lucide-react";
import { getDeviceId } from "../utils/deviceId";
import { supabase } from "../services/supabase";

interface TeamGridProps {
  canVote?: boolean;
}

export const TeamGrid: React.FC<TeamGridProps> = () => {
  const [votedTeams, setVotedTeams] = useState<number[]>([]);

  useEffect(() => {
    const fetchVotes = async () => {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase
        .from("votes")
        .select("team_id")
        .eq("device_id", deviceId);

      if (!error && data) {
        setVotedTeams(data.map((row) => row.team_id));
      }
    };

    fetchVotes();
  }, []);
  return (
    <div className="space-y-3">
      {TEAMS.map((team, index) => {
        const hasVoted = votedTeams.includes(team.id);

        return (
          <Link
            key={team.id}
            to={`/team/${team.id}`}
            className={`block rounded-2xl p-4 border transition-all active:scale-[0.98] ${
              hasVoted
                ? "bg-green-50 border-green-300 hover:border-green-400"
                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Team Avatar */}
              <div className="w-8 h-8 font-bold bg-blue-600 rounded-md text-white flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>

              {/* Team Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{team.name}</h3>
                </div>
              </div>

              {/* Status & Arrow */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {hasVoted ? (
                  <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">Voted</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    <Vote className="w-3 h-3" />
                    <span className="text-xs font-medium">Vote</span>
                  </div>
                )}
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
