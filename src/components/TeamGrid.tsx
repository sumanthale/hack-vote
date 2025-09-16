import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TEAMS } from "../utils/teams";
import { CheckCircle, Vote, ArrowRight } from "lucide-react";
import { getDeviceId } from "../utils/deviceId";
import { supabase } from "../services/supabase";

export const TeamGrid: React.FC = () => {
  const [votedTeams, setVotedTeams] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const deviceId = await getDeviceId();
      const { data } = await supabase
        .from("votes")
        .select("team_id")
        .eq("device_id", deviceId);
      if (data) setVotedTeams(data.map((row) => row.team_id));
    })();
  }, []);

  return (
    <div className="grid gap-3">
      {TEAMS.map((team, index) => {
        const hasVoted = votedTeams.includes(team.id);

        return (
          <Link
            key={team.id}
            to={`/team/${team.id}`}
            className={`group flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-sm hover:border-blue-300 ${
              hasVoted
                ? "bg-green-50 border-green-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white shadow-md transition-transform group-hover:scale-105 ${
                  hasVoted
                    ? "bg-green-500 shadow-green-500/30"
                    : "bg-blue-500 shadow-blue-500/30"
                }`}
              >
                {hasVoted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Team name */}
              <h3 className="font-medium text-slate-900 group-hover:text-blue-600">
                {team.name}
              </h3>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                  hasVoted
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                }`}
              >
                {hasVoted ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Voted
                  </>
                ) : (
                  <>
                    <Vote className="h-4 w-4" /> Vote
                  </>
                )}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
