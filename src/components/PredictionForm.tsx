import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TEAMS } from "../utils/teams";
import { submitPrediction } from "../services/supabase";
import { markPredictionMade } from "../utils/deviceId";
import {
  User,
  Trophy,
  GripVertical,
  Plus,
  X,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface PredictionFormProps {
  onComplete: () => void;
  onClose: () => void;
}

// Sortable row for the selected picks
function SortablePick({ id, index, name, onRemove }: { id: string; index: number; name: string; onRemove: (id: string) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 999 : undefined,
  } as React.CSSProperties;

  const getRankEmoji = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-xl transition-shadow ${isDragging ? "shadow-lg scale-105" : ""} bg-white dark:bg-gray-800`}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <div {...listeners} className="p-2 rounded-md bg-gray-50 dark:bg-gray-900">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        <div className="text-lg">{getRankEmoji(index)}</div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{name}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Position #{index + 1}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(id)}
        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        aria-label={`Remove ${name}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onComplete, onClose }) => {
  // store team ids as numbers
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // lock body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = selectedTeams.findIndex((id) => String(id) === String(active.id));
    const newIndex = selectedTeams.findIndex((id) => String(id) === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    if (oldIndex !== newIndex) {
      setSelectedTeams((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const addTeam = (teamId: number) => {
    if (selectedTeams.length < 3 && !selectedTeams.includes(teamId)) {
      setSelectedTeams((s) => [...s, teamId]);
    }
  };

  const removeTeam = (teamIdStr: string) => {
    const idNum = Number(teamIdStr);
    setSelectedTeams((s) => s.filter((id) => id !== idNum));
  };

  const handleContinue = () => {
    if (selectedTeams.length === 3) setShowUserForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !employeeId ||
      selectedTeams.length !== 3 ||
      employeeId.length !== 9
    ) return;
    setIsSubmitting(true);
    setError("");
    try {
      // submitPrediction(empId: string, name: string, top3: [number,number,number])
      await submitPrediction(employeeId, name, selectedTeams as [number, number, number]);
      markPredictionMade();
      onComplete();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to submit prediction. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTeams = TEAMS.filter((t) => !selectedTeams.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="h-full overflow-auto p-6">{/* inner scroll area */}
          {!showUserForm ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Trophy className="w-10 h-10 text-yellow-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Your Top 3</h2>
                <p className="text-sm text-gray-500">Step 1 of 2 • Drag to reorder</p>
              </div>

              {/* Selected Picks (sortable) */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Your Picks ({selectedTeams.length}/3)</h3>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}> 
                  <SortableContext items={selectedTeams.map(String)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3 min-h-[60px]">
                      {selectedTeams.length === 0 && (
                        <div className="text-center text-sm text-gray-500">No picks yet — tap teams below to add</div>
                      )}

                      {selectedTeams.map((teamId, idx) => {
                        const team = TEAMS.find((t) => t.id === teamId)!;
                        return (
                          <SortablePick key={String(teamId)} id={String(teamId)} index={idx} name={team.name} onRemove={removeTeam} />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Available Teams (tap to add) */}
              {selectedTeams.length < 3 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Available Teams</h3>
                  <div className="space-y-2">
                    {availableTeams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => addTeam(team.id)}
                        className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.description}</div>
                        </div>
                        <Plus className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Continue button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={selectedTeams.length !== 3}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all"
              >
                {selectedTeams.length === 3 ? "Continue" : `Select ${3 - selectedTeams.length} more`}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <button onClick={() => setShowUserForm(false)} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>

              <div className="text-center space-y-2">
                <User className="w-10 h-10 text-blue-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Details</h2>
                <p className="text-sm text-gray-500">Step 2 of 2</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Predictions</h3>
                <div className="space-y-2">
                  {selectedTeams.map((teamId, index) => {
                    const team = TEAMS.find((t) => t.id === teamId)!;
                    return (
                      <div key={teamId} className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{team.name}</span>
                          <div className="text-xs text-blue-600 dark:text-blue-400">Position #{index + 1}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-700 text-center font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Employee ID / SSO"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <button
                  type="submit"
                  disabled={!name || employeeId.length !== 9 || isSubmitting}
                  className={`w-full font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                  !name || employeeId.length !== 9 || isSubmitting
                    ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
