import { v4 as uuidv4 } from "uuid";

export const getDeviceId = async () => {
  let deviceId = localStorage.getItem("hackathon-device-id-new");
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("hackathon-device-id-new", deviceId!);
  }
  console.log("Generated Device ID:", deviceId);
  return deviceId;
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
