import React, { useState, useEffect } from "react";
import { TeamGrid } from "../components/TeamGrid";
import { PredictionForm } from "../components/PredictionForm";
import { hasMadePrediction } from "../utils/deviceId";
import {
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import LogoImg from "../assets/logo.png";

export const HomePage: React.FC = () => {
  const [hasPredicted, setHasPredicted] = useState(false);
  const [showPredictionForm, setShowPredictionForm] = useState(false);

  useEffect(() => {
    setHasPredicted(hasMadePrediction());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative py-5 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-5">
          <div className="relative w-28 h-w-28 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-2xl opacity-20 scale-150"></div>
            <div className="relative flex items-center justify-center">
              <img src={LogoImg} alt="logo"  />
            </div>
          </div>

          <div>
           
            <p className="mt-1 text-sm font-medium text-slate-600 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Hackathon Voting Platform
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </p>
          </div>

          <div className="flex justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-blue-500" /> Predict
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" /> Vote
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-green-500" /> Win
            </span>
          </div>
        </div>

        {/* Prediction Section */}
        {!hasPredicted ? (
          !showPredictionForm ? (
            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="space-y-4 text-center">
                  <img
                    src="https://cdn3d.iconscout.com/3d/premium/thumb/target-3d-icon-png-download-12045911.png"
                    alt="target"
                    className="w-14 h-14 mx-auto"
                  />
                  <h2 className="text-xl font-bold text-slate-900">
                    Make Your Predictions
                  </h2>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
                    Pick which teams will rule the{" "}
                    <span className="font-bold text-yellow-600">Top 3</span>
                  </p>
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1 text-xs text-red-600">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    Synchrony Employees Only
                  </div>
                  <button
                    onClick={() => setShowPredictionForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Start Predictions
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <PredictionForm
              onComplete={() => {
                setHasPredicted(true);
                setShowPredictionForm(false);
              }}
              onClose={() => setShowPredictionForm(false)}
            />
          )
        ) : (
          <div className="relative group max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl p-5 border border-green-200/50 shadow">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Predictions Locked In!
                </h2>
                <p className="text-sm text-slate-600">
                  Your predictions are{" "}
                  <span className="font-semibold text-green-700">saved</span>.
                  Now support your favorite teams below!
                </p>
                <div className="inline-flex items-center gap-1 bg-green-100 border border-green-300 rounded-full px-3 py-1 text-xs text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4" /> Submitted
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Vote for Teams
              </h2>
              <p className="text-xs text-slate-500">
                Support innovation with your vote
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-slate-200/50">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              Tap to vote
            </div>
          </div>
          <TeamGrid />
        </div>
      </div>
    </div>
  );
};
