export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('hackathon-device-id');
  
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('hackathon-device-id', deviceId);
  }
  
  return deviceId;
};

export const hasVotedForTeam = (teamId: string): boolean => {
  const votes = JSON.parse(localStorage.getItem('hackathon-votes') || '[]');
  return votes.includes(teamId);
};

export const markTeamAsVoted = (teamId: string): void => {
  const votes = JSON.parse(localStorage.getItem('hackathon-votes') || '[]');
  if (!votes.includes(teamId)) {
    votes.push(teamId);
    localStorage.setItem('hackathon-votes', JSON.stringify(votes));
  }
};

export const hasMadePrediction = (): boolean => {
  return localStorage.getItem('hackathon-prediction') === 'true';
};

export const markPredictionMade = (): void => {
  localStorage.setItem('hackathon-prediction', 'true');
};