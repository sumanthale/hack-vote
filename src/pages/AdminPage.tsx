import React, { useState, useEffect } from 'react';
import { getTeamStats, getAllPredictions, subscribeToTeamStats } from '../services/firebase';
import { TeamStats, Prediction } from '../types';
import { TEAMS } from '../utils/teams';
import { Trophy, Users, Star, TrendingUp, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('');
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      
      // Get initial data
      Promise.all([
        getTeamStats(),
        getAllPredictions()
      ]).then(([stats, preds]) => {
        setTeamStats(stats);
        setPredictions(preds);
        setLoading(false);
      });

      // Subscribe to real-time updates
      const unsubscribe = subscribeToTeamStats((stats) => {
        setTeamStats(stats);
      });

      return unsubscribe;
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Link
            to="/"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-sm text-gray-600">Enter credentials to continue</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Login Required</h2>
            <p className="text-gray-600">Enter admin credentials to view dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="adminId" className="block text-sm font-semibold text-gray-900 mb-2">
                Admin Employee ID
              </label>
              <input
                type="text"
                id="adminId"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter admin ID"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const getTeamName = (teamId: string) => {
    return TEAMS.find(t => t.id === teamId)?.name || teamId;
  };

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
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Live voting results and predictions</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{teamStats.reduce((sum, team) => sum + team.voteCount, 0)}</div>
          <div className="text-xs text-gray-600">Total Votes</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{predictions.length}</div>
          <div className="text-xs text-gray-600">Predictions</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{TEAMS.length}</div>
          <div className="text-xs text-gray-600">Teams</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Team Leaderboard</h2>
        
        <div className="space-y-3">
          {teamStats.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{team.name}</div>
                  <div className="text-xs text-gray-600">{team.voteCount} votes</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{team.averageScore.toFixed(1)}</div>
                <div className="text-xs text-gray-600">avg score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">User Predictions</h2>
        
        <div className="space-y-3">
          {predictions.map((prediction, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{prediction.name}</div>
                <div className="text-xs text-gray-600">{prediction.employeeId}</div>
              </div>
              <div className="flex space-x-2">
                {prediction.top3.map((teamId, idx) => (
                  <div key={idx} className="flex-1 text-center p-2 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs text-blue-600 font-medium">#{idx + 1}</div>
                    <div className="text-xs text-gray-900 font-medium truncate">{getTeamName(teamId)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};