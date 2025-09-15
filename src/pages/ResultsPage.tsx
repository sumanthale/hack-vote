import React, { useState, useEffect } from 'react';
import { getJudgeResults, TeamResult } from '../services/judgeService';
import { Trophy, Users, Star, TrendingUp, Award } from 'lucide-react';

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
      <div className="py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex  flex-col items-center justify-between gap-3">
        <div className="flex items-center space-x-3">

          <div>
            <h1 className="text-lg font-bold text-gray-900">Results Dashboard</h1>
            <p className="text-xs text-gray-500">Hackathon judge voting summary</p>
          </div>
        </div>

        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center space-x-1 transition ${
              selectedView === 'overall'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Overall</span>
          </button>
          <button
            onClick={() => setSelectedView('criteria')}
            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center space-x-1 transition ${
              selectedView === 'criteria'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Criteria</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">{results.length}</div>
          <div className="text-xs text-gray-500">Teams Evaluated</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">
            {results.length > 0 ? Math.max(...results.map(r => r.judge_count)) : 0}
          </div>
          <div className="text-xs text-gray-500">Max Judges</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">
            {results.length > 0 ? results[0].avg_total_score.toFixed(1) : '0.0'}
          </div>
          <div className="text-xs text-gray-500">Top Score</div>
        </div>
      </div>

      {/* Results */}
      {selectedView === 'overall' ? (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">Team Rankings</h2>

          {results.map((team, index) => (
            <div
              key={team.team_id}
              className={`bg-white rounded-xl p-4 border shadow-sm transition hover:shadow-md ${
                index < 3 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-r ${getRankColor(index)}`}>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.team_name}</h3>
                 
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      {team.judge_count} judges
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {team.avg_total_score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">/ 40.0</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(team.avg_total_score / 40) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-900">Criteria Breakdown</h2>

          {results.map((team, index) => (
            <div key={team.team_id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-r ${getRankColor(index)}`}>
                  {getRankIcon(index)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{team.team_name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Total: {team.avg_total_score.toFixed(1)}/40</span>
                    <span className="mx-1">•</span>
                    <span>{team.judge_count} judges</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { key: 'feasibility', label: 'Feasibility', value: team.avg_feasibility },
                  { key: 'technical', label: 'Technical Approach', value: team.avg_technical_approach },
                  { key: 'innovation', label: 'Innovation', value: team.avg_innovation },
                  { key: 'pitch', label: 'Pitch/Presentation', value: team.avg_pitch_presentation },
                  // { key: 'overall', label: 'Overall Impression', value: team.comments }
                ].map((criterion) => (
                  <div key={criterion.key} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <span className="text-sm text-gray-800">{criterion.label}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(criterion.value / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                        {criterion.value.toFixed(1)}/10
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
