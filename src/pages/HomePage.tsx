import React, { useState, useEffect } from "react";
import { TeamGrid } from "../components/TeamGrid";
import { PredictionForm } from "../components/PredictionForm";
import { hasMadePrediction } from "../utils/deviceId";
import { Trophy, Target, CheckCircle, ArrowRight } from "lucide-react";

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
  const hidePredictionForm = () => {
    setShowPredictionForm(false);
  }

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
        <div className="text-center space-y-5">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Hackathon Voting
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
            Predict the winners 🎯 and rate your favorite teams ⭐  every vote
            counts!
          </p>
        </div>

      {/* Predictions Section */}
      {!hasPredicted ? (
        <div className="space-y-6">
          {!showPredictionForm ? (
            <div className="bg-white  rounded-3xl p-6 border border-gray-200 shadow-lg">
              <div className="text-center space-y-5">
              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Target className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 ">
                Make Your Predictions
              </h2>

              {/* Subtitle */}
              <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
                Choose which teams you think will take the{" "}
                <span className="font-semibold">Top 3</span> spots 🚀
              </p>
              {/* Eligibility Note */}
              <p className="text-xs text-red-600  font-medium mt-2">
                Only <span className="font-semibold">Synchrony Employees</span> are allowed for prediction.
              </p>

              {/* CTA */}
              <button
                onClick={handleMakePrediction}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
              text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all 
              flex items-center justify-center space-x-2 active:scale-[0.97]"
              >
                <Target className="w-5 h-5" />
                <span>Start Predictions</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              </div>
            </div>
          ) : (
            <PredictionForm onComplete={handlePredictionComplete} onClose={hidePredictionForm} />
          )}
        </div>
      ) : (
        <div
          className="bg-gradient-to-r from-green-50 to-emerald-50 
    rounded-3xl p-6 border border-green-200 shadow-sm"
        >
          <div className="text-center space-y-5">
            {/* Icon */}
            <div className="w-14 h-14 bg-green-100  rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-green-600 " />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 ">
              Predictions Submitted 🎉
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600  leading-relaxed max-w-sm mx-auto">
              Your predictions are <span className="font-semibold">locked</span>
              . Now go ahead and{" "}
              <span className="font-semibold">
                vote for your favorite teams
              </span>{" "}
              below!
            </p>
          </div>
        </div>
      )}

      {/* Teams Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Vote for Teams</h2>
            <div className="text-sm text-gray-600">Tap to vote</div>
          </div>
          <TeamGrid  />
        </div>
    </div>
  );
};
