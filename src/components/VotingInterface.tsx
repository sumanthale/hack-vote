import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, QrCode, Share, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitVote, hasDeviceVoted } from '../services/firebase';
import { getDeviceId, hasVotedForTeam, markTeamAsVoted } from '../utils/deviceId';
import { generateQRCode } from '../utils/qrcode';

interface VotingInterfaceProps {
  teamId: string;
  teamName: string;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({ teamId, teamName }) => {
  const [score, setScore] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [showQR, setShowQR] = useState<boolean>(false);

  useEffect(() => {
    const checkVoteStatus = async () => {
      const deviceId = getDeviceId();
      const votedFromDevice = hasVotedForTeam(teamId);
      const votedInDB = await hasDeviceVoted(teamId, deviceId);
      
      setHasVoted(votedFromDevice || votedInDB);
    };

    const generateTeamQR = async () => {
      const teamUrl = `${window.location.origin}/team/${teamId}`;
      const qrCodeData = await generateQRCode(teamUrl);
      setQrCode(qrCodeData);
    };

    checkVoteStatus();
    generateTeamQR();
  }, [teamId]);

  const handleVote = async () => {
    if (score === 0 || hasVoted) return;

    setIsSubmitting(true);
    try {
      const deviceId = getDeviceId();
      await submitVote(teamId, score, deviceId);
      markTeamAsVoted(teamId);
      setHasVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vote for ${teamName}`,
          text: `Cast your vote for ${teamName} in the hackathon!`,
          url: `${window.location.origin}/team/${teamId}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const teamUrl = `${window.location.origin}/team/${teamId}`;
      await navigator.clipboard.writeText(teamUrl);
      alert('Team URL copied to clipboard!');
    }
  };

  if (hasVoted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vote Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for voting for <span className="font-semibold text-green-700">{teamName}</span>
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
            
            <button
              onClick={shareQRCode}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {showQR && qrCode && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
            <img src={qrCode} alt={`QR code for ${teamName}`} className="mx-auto rounded-xl mb-4" />
            <p className="text-sm text-gray-600">Scan to vote for {teamName}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rate {teamName}</h3>
          <p className="text-gray-600">Tap a number to rate from 1 to 10</p>
        </div>

        {/* Score Selection */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setScore(num)}
              className={`aspect-square rounded-xl font-bold text-lg transition-all active:scale-95 ${
                score >= num
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Star Rating Display */}
        <div className="flex justify-center items-center space-x-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 transition-colors ${
                score >= star * 2
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          {score > 0 && (
            <span className="ml-3 text-lg font-bold text-gray-900">
              {score}/10
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleVote}
          disabled={score === 0 || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </span>
          ) : (
            score > 0 ? `Submit Vote (${score}/10)` : 'Select a Score'
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          <QrCode className="w-4 h-4" />
          <span>QR Code</span>
        </button>
        
        <button
          onClick={shareQRCode}
          className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          <Share className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* QR Code Display */}
      {showQR && qrCode && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
          <img src={qrCode} alt={`QR code for ${teamName}`} className="mx-auto rounded-xl mb-4" />
          <p className="text-sm text-gray-600">Scan to vote for {teamName}</p>
        </div>
      )}
    </div>
  );
};