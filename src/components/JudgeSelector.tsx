import React, { useState, useEffect } from "react";
import { Judge, getJudges } from "../services/judgeService";
import {
  getSelectedJudge,
  setSelectedJudge,
  StoredJudge,
} from "../utils/judgeStorage";
import { User, ChevronDown, CheckCircle } from "lucide-react";

interface JudgeSelectorProps {
  onJudgeSelected: (judge: StoredJudge) => void;
  onSubmit?: (judge: StoredJudge) => void; // 👈 optional submit callback
}

export const JudgeSelector: React.FC<JudgeSelectorProps> = ({
  onJudgeSelected,
}) => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [selectedJudge, setSelectedJudgeState] = useState<StoredJudge | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJudges = async () => {
      try {
        const [judgesData, storedJudge] = await Promise.all([
          getJudges(),
          Promise.resolve(getSelectedJudge()),
        ]);

        setJudges(judgesData);

        if (storedJudge) {
          setSelectedJudgeState(storedJudge);
          onJudgeSelected(storedJudge);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load judges");
      } finally {
        setLoading(false);
      }
    };

    loadJudges();
  }, [onJudgeSelected]);

  const handleJudgeSelect = (judge: Judge) => {
    const storedJudge: StoredJudge = {
      id: judge.id,
      name: judge.name,
      title: judge.title,
    };

    setSelectedJudge(storedJudge);
    setSelectedJudgeState(storedJudge);
    setIsOpen(false);
    // onJudgeSelected(storedJudge);
  };

  const handleSubmit = () => {
    if (selectedJudge) {
      onJudgeSelected(selectedJudge);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading judges...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <p className="text-red-700 text-center font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 ">Select Judge</h2>
          <p className="text-sm text-gray-600">
            Choose your judge profile to continue
          </p>
        </div>

      </div>

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl text-left hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {selectedJudge ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedJudge.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedJudge.title}
                  </div>
                </div>
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Select a judge...</span>
              </>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
            {judges.map((judge) => (
              <button
                key={judge.id}
                onClick={() => handleJudgeSelect(judge)}
                className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {judge.name}
                  </div>
                  <div className="text-sm text-gray-600">{judge.title}</div>
                  {judge.submitted && (
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Submitted
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedJudge}
        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all ${
          selectedJudge
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
};
