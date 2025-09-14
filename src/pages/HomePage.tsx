import React, { useState, useEffect } from 'react';
import { TeamGrid } from '../components/TeamGrid';
import { PredictionForm } from '../components/PredictionForm';
import { hasMadePrediction } from '../utils/deviceId';
import { Trophy, Target, CheckCircle, ArrowRight, Users, Star } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [hasPredicted, setHasPredicted] = useState<boolean>(false);
  const [showPredictionForm, setShowPredictionForm] = useState<boolean>(false);

  useEffect(() => {
    const predicted = hasMadePrediction();
    setHasPredicted(predicted);
  }, []);

  const handlePredictionComplete = () => {
    setHasPredicted(true);
    setShowPredictionForm(false);
  };

  const handleMakePrediction = () => {
    setShowPredictionForm(true);
  };

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Hackathon Voting
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Predict winners and vote for your favorite teams
        </p>
      </div>

      {/* Stats */}


      {/* Predictions Section */}
      {!hasPredicted ? (
        <div className="space-y-6">
          {!showPredictionForm ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Make Your Predictions
                </h2>
                <p className="text-gray-600">
                  Predict which teams will win the top 3 positions
                </p>
                <button
                  onClick={handleMakePrediction}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Target className="w-5 h-5" />
                  <span>Start Predictions</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <PredictionForm onComplete={handlePredictionComplete} />
          )}
        </div>
      ) : (
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Predictions Submitted!
            </h2>
            <p className="text-gray-600">
              Your predictions are locked. Now vote for individual teams below.
            </p>
          </div>
        </div>
      )}

      {/* Teams Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {hasPredicted ? 'Vote for Teams' : 'Competing Teams'}
          </h2>
          <div className="text-sm text-gray-600">
            {hasPredicted ? 'Tap to vote' : 'Preview only'}
          </div>
        </div>
        <TeamGrid canVote={hasPredicted} />
      </div>

      {/* Call to Action for Non-Predicted Users */}
      {!hasPredicted && !showPredictionForm && (
        <div className="bg-gray-100 rounded-2xl p-6 text-center">
          <Target className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start?</h3>
          <p className="text-gray-600 mb-4">
            Make predictions to unlock team voting
          </p>
          <button
            onClick={handleMakePrediction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Make Predictions
          </button>
        </div>
      )}
    </div>
  );
};