import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JudgeSelector } from '../components/JudgeSelector';
import { TeamVotingForm } from '../components/TeamVotingForm';
import { JudgeSummary } from '../components/JudgeSummary';
import { StoredJudge } from '../utils/judgeStorage';
import { Team, JudgeVote, getTeams, getJudgeVotes, getJudgeById, submitJudgeFinal } from '../services/judgeService';
import { ArrowLeft, Users, Trophy, Eye } from 'lucide-react';

export const JudgePage: React.FC = () => {
  const [selectedJudge, setSelectedJudge] = useState<StoredJudge | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [votes, setVotes] = useState<JudgeVote[]>([]);
  const [currentView, setCurrentView] = useState<'voting' | 'summary'>('voting');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedJudge) {
      loadJudgeData();
    }
  }, [selectedJudge]);

  const loadJudgeData = async () => {
    if (!selectedJudge) return;

    setLoading(true);
    setError('');

    try {
      const [teamsData, votesData, judgeData] = await Promise.all([
        getTeams(),
        getJudgeVotes(selectedJudge.id),
        getJudgeById(selectedJudge.id)
      ]);

      setTeams(teamsData);
      setVotes(votesData);
      setIsSubmitted(judgeData?.submitted || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSubmitted = () => {
    // Reload votes to get updated data
    if (selectedJudge) {
      getJudgeVotes(selectedJudge.id).then(setVotes);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedJudge) return;

    setIsSubmitting(true);
    try {
      await submitJudgeFinal(selectedJudge.id);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit final');
    } finally {
      setIsSubmitting(false);
    }
  };

  const votedTeamsCount = votes.length;
  const totalTeamsCount = teams.length;

  if (!selectedJudge) {
    return (
      <div className="py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Judge Voting</h1>
            <p className="text-sm text-gray-600">Select your judge profile to begin</p>
          </div>
        </div>

        <JudgeSelector onJudgeSelected={setSelectedJudge} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading judge data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
       
          <div>
            <h1 className="text-xl font-bold text-gray-900">Judge Voting</h1>
            <p className="text-sm text-gray-600">Welcome, {selectedJudge.name}</p>
          </div>
        </div>

        {!isSubmitted && (
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('voting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'voting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Vote</span>
            </button>
            <button
              onClick={() => setCurrentView('summary')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Summary</span>
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-2 rounded-lg">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View Only</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {!isSubmitted && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Progress</span>
            <span className="text-sm text-gray-600">{votedTeamsCount}/{totalTeamsCount} teams voted</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${totalTeamsCount > 0 ? (votedTeamsCount / totalTeamsCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-center font-medium">{error}</p>
        </div>
      )}

      {/* Content */}
      {currentView === 'voting' ? (
        <div className="space-y-6">
          {teams.map((team) => {
            const existingVote = votes.find(vote => vote.team_id === team.id);
            return (
              <TeamVotingForm
                key={team.id}
                team={team}
                judgeId={selectedJudge.id}
                existingVote={existingVote}
                onVoteSubmitted={handleVoteSubmitted}
              />
            );
          })}
        </div>
      ) : (
        <JudgeSummary
          teams={teams}
          votes={votes}
          onFinalSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      )}
    </div>
  );
};