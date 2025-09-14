import React from 'react';
import { Link } from 'react-router-dom';
import { TEAMS } from '../utils/teams';
import { ArrowRight, Users, Eye, Vote } from 'lucide-react';

interface TeamGridProps {
  canVote?: boolean;
}

export const TeamGrid: React.FC<TeamGridProps> = ({ canVote = false }) => {
  return (
    <div className="space-y-3">
      {TEAMS.map((team, index) => (
        <Link
          key={team.id}
          to={`/team/${team.id}`}
          className="block bg-white rounded-2xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-4">
            {/* Team Avatar */}
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            
            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {team.name}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {team.description}
              </p>
            </div>
            
            {/* Status & Arrow */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {canVote ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <Vote className="w-3 h-3" />
                  <span className="text-xs font-medium">Vote</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs font-medium">View</span>
                </div>
              )}
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};