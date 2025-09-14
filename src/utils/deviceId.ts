import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getDeviceId = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  if (!localStorage.getItem("hackathon-device-id")) {
    localStorage.setItem("hackathon-device-id", result.visitorId);
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
