export interface Team {
  id: number;
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
  top3: [number, number, number];
  timestamp: Date;
}

export interface TeamStats {
  id: number;
  name: string;
  totalScore: number;
  voteCount: number;
  averageScore: number;
}