import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { v4 as uuid } from "uuid";
export const getDeviceId = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
   const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;

  if (!localStorage.getItem("hackathon-device-id-new")) {
    localStorage.setItem("hackathon-device-id-new", 
      `${result.visitorId}-${btoa(userAgent + platform + language)}-${uuid()}`
    );
  }
  console.log("Generated Device ID:", result.visitorId);

  return result.visitorId; // Unique per device/browser
};

export const hasVotedForTeam = (teamId: string): boolean => {
  const votes = JSON.parse(localStorage.getItem("hackathon-votes") || "[]");
  return votes.includes(teamId);
};

export const markTeamAsVoted = (teamId: string): void => {
  const votes = JSON.parse(localStorage.getItem("hackathon-votes") || "[]");
  if (!votes.includes(teamId)) {
    votes.push(teamId);
    localStorage.setItem("hackathon-votes", JSON.stringify(votes));
  }
};

export const hasMadePrediction = (): boolean => {
  return localStorage.getItem("hackathon-prediction") === "true";
};

export const markPredictionMade = (): void => {
  localStorage.setItem("hackathon-prediction", "true");
};
