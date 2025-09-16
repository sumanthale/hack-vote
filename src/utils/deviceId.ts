import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { v4 as uuid } from "uuid";
export const getDeviceId = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  if (!localStorage.getItem("hackathon-device-id-one")) {
    localStorage.setItem("hackathon-device-id-one", 
      `${uuid()}`
    );
  }
  console.log("Generated Device ID:", `${uuid()}`);

  return result.visitorId; // Unique per device/browser
};

export const hasVotedForTeam = (teamId: string): boolean => {
  const votes = JSON.parse(localStorage.getItem("hackathon-votes-new") || "[]");
  return votes.includes(teamId);
};

export const markTeamAsVoted = (teamId: string): void => {
  const votes = JSON.parse(localStorage.getItem("hackathon-votes-new") || "[]");
  if (!votes.includes(teamId)) {
    votes.push(teamId);
    localStorage.setItem("hackathon-votes-new", JSON.stringify(votes));
  }
};

export const hasMadePrediction = (): boolean => {
  return localStorage.getItem("hackathon-prediction") === "true";
};

export const markPredictionMade = (): void => {
  localStorage.setItem("hackathon-prediction", "true");
};
