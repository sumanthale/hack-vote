import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TEAMS } from '../utils/teams';
import { submitPrediction } from '../services/firebase';
import { markPredictionMade } from '../utils/deviceId';
import { User, Trophy, GripVertical, Plus, X, CheckCircle, ArrowLeft } from 'lucide-react';

interface PredictionFormProps {
  onComplete: () => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onComplete }) => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedTeams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedTeams(items);
  };

  const addTeam = (teamId: string) => {
    if (selectedTeams.length < 3 && !selectedTeams.includes(teamId)) {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams(selectedTeams.filter(id => id !== teamId));
  };

  const handleContinue = () => {
    if (selectedTeams.length === 3) {
      setShowUserForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !employeeId || selectedTeams.length !== 3) return;

    setIsSubmitting(true);
    try {
      await submitPrediction({
        name,
        employeeId,
        top3: selectedTeams as [string, string, string],
        timestamp: new Date()
      });
      
      markPredictionMade();
      onComplete();
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Failed to submit prediction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTeams = TEAMS.filter(team => !selectedTeams.includes(team.id));
  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏆';
    }
  };

  if (showUserForm) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => setShowUserForm(false)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Enter Your Details</h2>
            <p className="text-sm text-gray-600">Step 2 of 2</p>
          </div>
        </div>

        {/* Selected Teams Summary */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your Predictions</h3>
          <div className="space-y-2">
            {selectedTeams.map((teamId, index) => {
              const team = TEAMS.find(t => t.id === teamId);
              return (
                <div key={teamId} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                  <span className="text-lg">{getRankEmoji(index)}</span>
                  <div>
                    <span className="font-medium text-gray-900">{team?.name}</span>
                    <div className="text-xs text-blue-600">Position #{index + 1}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* User Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-900 mb-2">
              Employee ID / SSO
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your SSO/Employee ID"
            />
          </div>

          <button
            type="submit"
            disabled={!name || !employeeId || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit Predictions</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Select Your Top 3</h2>
        <p className="text-sm text-gray-600">Step 1 of 2 • Choose 3 teams in order</p>
      </div>

      {/* Selected Teams */}
      {selectedTeams.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Your Picks ({selectedTeams.length}/3)
          </h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-teams">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {selectedTeams.map((teamId, index) => {
                    const team = TEAMS.find(t => t.id === teamId);
                    return (
                      <Draggable key={teamId} draggableId={teamId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between bg-blue-50 p-3 rounded-xl transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div {...provided.dragHandleProps} className="p-1">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                              </div>
                              <span className="text-lg">{getRankEmoji(index)}</span>
                              <div>
                                <div className="font-medium text-gray-900">{team?.name}</div>
                                <div className="text-xs text-blue-600">Position #{index + 1}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTeam(teamId)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Available Teams */}
      {selectedTeams.length < 3 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Available Teams</h3>
          <div className="space-y-2">
            {availableTeams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => addTeam(team.id)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.description}</div>
                </div>
                <Plus className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={selectedTeams.length !== 3}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors"
      >
        {selectedTeams.length === 3 ? 'Continue' : `Select ${3 - selectedTeams.length} more team${3 - selectedTeams.length !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
};