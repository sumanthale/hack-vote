export interface Team {
  id: string;
  name: string;
  description?: string;
}

export interface Vote {
  score: number;
  deviceId: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface Prediction {
  name: string;
  employeeId: string;
  top3: [string, string, string];
  timestamp: Date;
}

export interface TeamStats {
  id: string;
  name: string;
  totalScore: number;
  voteCount: number;
  averageScore: number;
}