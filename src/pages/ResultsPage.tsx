import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJudgeResults, TeamResult } from '../services/judgeService';
import { ArrowLeft, Trophy, Users, Star, TrendingUp, Award } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedView, setSelectedView] = useState<'overall' | 'criteria'>('overall');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getJudgeResults();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
          <p className="text-red-700 text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Results Dashboard</h1>
            <p className="text-sm text-gray-600">Hackathon judge voting results</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedView === 'overall'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Overall</span>
          </button>
          <button
            onClick={() => setSelectedView('criteria')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedView === 'criteria'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Criteria</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{results.length}</div>
          <div className="text-xs text-gray-600">Teams Evaluated</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {results.length > 0 ? Math.max(...results.map(r => r.judge_count)) : 0}
          </div>
          <div className="text-xs text-gray-600">Max Judges</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {results.length > 0 ? results[0].avg_total_score.toFixed(1) : '0.0'}
          </div>
          <div className="text-xs text-gray-600">Top Score</div>
        </div>
      </div>

      {/* Results */}
      {selectedView === 'overall' ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Team Rankings</h2>
          
          {results.map((team, index) => (
            <div
              key={team.team_id}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition-all ${
                index < 3 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r ${getRankColor(index)}`}>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{team.team_name}</h3>
                    {team.team_description && (
                      <p className="text-sm text-gray-600">{team.team_description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {team.judge_count} judges
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {team.avg_total_score.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">/ 25.0</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(team.avg_total_score / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Detailed Criteria Breakdown</h2>
          
          {results.map((team, index) => (
            <div key={team.team_id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-r ${getRankColor(index)}`}>
                  {getRankIcon(index)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{team.team_name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Total: {team.avg_total_score.toFixed(1)}/25</span>
                    <span>•</span>
                    <span>{team.judge_count} judges</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'feasibility', label: 'Feasibility', value: team.avg_feasibility },
                  { key: 'technical', label: 'Technical Approach', value: team.avg_technical_approach },
                  { key: 'innovation', label: 'Innovation', value: team.avg_innovation },
                  { key: 'pitch', label: 'Pitch/Presentation', value: team.avg_pitch_presentation },
                  { key: 'overall', label: 'Overall Impression', value: team.avg_overall_impression }
                ].map((criterion) => (
                  <div key={criterion.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-900">{criterion.label}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(criterion.value / 5) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 w-12 text-right">
                        {criterion.value.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};