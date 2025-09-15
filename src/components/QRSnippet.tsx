import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { QrCode } from "lucide-react";
import LogoImg from "../assets/logo.png";

interface QRSnippetProps {
  teamId: number;
  teamName: string;
  qrCode: string;
}

const QRSnippet: React.FC<QRSnippetProps> = ({ teamId, teamName, qrCode }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (qrRef.current) {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      }); // High-res export
      const link = document.createElement("a");
      link.download = `team-${teamId}-${teamName.replace(/\s+/g, "_")}-qr.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <>
      <div
        ref={qrRef}
        className="bg-gradient-to-b from-cyan-50 via-white to-blue-50 rounded-3xl p-8 border border-cyan-200 text-center shadow-2xl w-full max-w-sm mx-auto space-y-8 relative"
      >
        {/* Logo at the top */}
        <div className="flex justify-center mb-4">
          <img
            src={LogoImg}
            alt="Hackathon Logo"
            className="w-20 h-20 drop-shadow-md"
          />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
            Scan Here to Vote!
          </h3>
          <p className="text-base text-gray-700 font-medium">
            Support <span className="text-cyan-700 font-bold">{teamName}</span>{" "}
            with your vote
          </p>
        </div>

        {/* QR Image */}
        <div className="bg-white p-4 rounded-3xl border-4 border-cyan-500 inline-block shadow-xl hover:scale-105 transition-transform duration-300">
          <img
            src={qrCode}
            alt={`QR code for ${teamName}`}
            className="mx-auto w-56 h-56 sm:w-64 sm:h-64"
          />
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-2 mt-4">
          <p className="text-cyan-700 font-semibold flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-600" />
            Hackathon Voting Booth
          </p>
          <p className="text-blue-700 font-bold">
            Team: {teamName}
          </p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all w-full shadow-md"
      >
        Download Full Snippet
      </button>
    </>
  );
};

export default QRSnippet;
