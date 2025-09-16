import React, { useEffect, useState } from "react";
import { generateQRCode } from "../utils/qrcode";
import { getDeviceId } from "../utils/deviceId";
import { submitVote, hasDeviceVotedForTeam } from "../services/supabase";
import QRSnippet from "./QRSnippet";
import {
  CheckCircle,
  QrCode,
  Share,
  Star,
  Zap,
  Trophy,
  Heart,
} from "lucide-react";

interface VotingInterfaceProps {
  teamId: number;
  teamName: string;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  teamId,
  teamName,
}) => {
  const [score, setScore] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const deviceId = await getDeviceId();
        setHasVoted(await hasDeviceVotedForTeam(teamId, deviceId));
        const qr = await generateQRCode(`${window.location.origin}/team/${teamId}`);
        setQrCode(qr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [teamId]);

  const handleVote = async () => {
    if (!score || hasVoted) return;
    setIsSubmitting(true);
    setError("");
    try {
      const deviceId = await getDeviceId();
      await submitVote(teamId, score, deviceId);
      setHasVoted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit vote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareTeam = async () => {
    const url = `${window.location.origin}/team/${teamId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vote for ${teamName}`,
          text: `Cast your vote for ${teamName}!`,
          url,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 p-12 rounded-3xl border shadow-xl text-center space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-700 font-medium">Loading voting interface...</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50/80 p-8 rounded-3xl border border-green-200 shadow-lg text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-green-500 rounded-2xl flex items-center justify-center shadow-md animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Vote Submitted!
          </h3>
          <p className="text-slate-700">
            Thanks for supporting{" "}
            <span className="font-bold text-green-700">{teamName}</span> 🗳️
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-xl">
            <Heart className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Vote Recorded
            </span>
            <Trophy className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border hover:border-blue-300 hover:shadow-md"
          >
            <QrCode className="w-5 h-5" /> QR Code
          </button>
          <button
            onClick={shareTeam}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            <Share className="w-5 h-5" /> Share
          </button>
        </div>

        {showQR && qrCode && <QRSnippet teamId={teamId} teamName={teamName} qrCode={qrCode} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 p-8 rounded-3xl border shadow-xl">
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold">Rate {teamName}</h3>
          <p className="text-slate-600">Pick a score from 1–10</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 mb-6">
          {[...Array(10)].map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                onClick={() => setScore(num)}
                className={`rounded-xl font-bold py-3 transition ${
                  score === num
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-slate-100 hover:bg-blue-100"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((s) => {
            const val = s * 2;
            const active = score >= val;
            const half = score === val - 1;
            return (
              <div key={s} className="relative w-8 h-8">
                <Star
                  className={`w-8 h-8 ${
                    active
                      ? "text-yellow-400 fill-current"
                      : "text-slate-300"
                  }`}
                />
                {half && (
                  <div className="absolute inset-0 w-1/2 overflow-hidden">
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleVote}
          disabled={!score || isSubmitting}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
            !score || isSubmitting
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          }`}
        >
          {isSubmitting ? "Submitting..." : <><Trophy className="w-5 h-5" /> Submit ({score}/10)</>}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl border hover:border-blue-300 hover:shadow-md"
        >
          <QrCode className="w-5 h-5" /> Show QR
        </button>
        <button
          onClick={shareTeam}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl border hover:border-green-300 hover:shadow-md"
        >
          <Share className="w-5 h-5" /> Share
        </button>
      </div>

      {showQR && qrCode && <QRSnippet teamId={teamId} teamName={teamName} qrCode={qrCode} />}
    </div>
  );
};
