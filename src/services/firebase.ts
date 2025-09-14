import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy,
  limit,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Vote, Prediction, TeamStats } from '../types';
import { TEAMS } from '../utils/teams';

// Submit vote for a team
export const submitVote = async (teamId: string, score: number, deviceId: string): Promise<void> => {
  try {
    const voteRef = doc(db, 'teams', teamId, 'votes', deviceId);
    await setDoc(voteRef, {
      score,
      deviceId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

// Check if device has voted for a team
export const hasDeviceVoted = async (teamId: string, deviceId: string): Promise<boolean> => {
  try {
    const voteRef = doc(db, 'teams', teamId, 'votes', deviceId);
    const voteSnap = await getDoc(voteRef);
    return voteSnap.exists();
  } catch (error) {
    console.error('Error checking vote:', error);
    return false;
  }
};

// Submit prediction
export const submitPrediction = async (prediction: Prediction): Promise<void> => {
  try {
    const predictionRef = doc(db, 'predictions', prediction.employeeId);
    await setDoc(predictionRef, {
      ...prediction,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error submitting prediction:', error);
    throw error;
  }
};

// Check if employee has made prediction
export const hasEmployeePredicted = async (employeeId: string): Promise<boolean> => {
  try {
    const predictionRef = doc(db, 'predictions', employeeId);
    const predictionSnap = await getDoc(predictionRef);
    return predictionSnap.exists();
  } catch (error) {
    console.error('Error checking prediction:', error);
    return false;
  }
};

// Get team statistics
export const getTeamStats = async (): Promise<TeamStats[]> => {
  try {
    const stats: TeamStats[] = [];
    
    for (const team of TEAMS) {
      const votesRef = collection(db, 'teams', team.id, 'votes');
      const votesSnap = await getDocs(votesRef);
      
      let totalScore = 0;
      let voteCount = 0;
      
      votesSnap.forEach((doc) => {
        const vote = doc.data() as Vote;
        totalScore += vote.score;
        voteCount++;
      });
      
      const averageScore = voteCount > 0 ? totalScore / voteCount : 0;
      
      stats.push({
        id: team.id,
        name: team.name,
        totalScore,
        voteCount,
        averageScore
      });
    }
    
    return stats.sort((a, b) => b.averageScore - a.averageScore);
  } catch (error) {
    console.error('Error getting team stats:', error);
    return [];
  }
};

// Get all predictions
export const getAllPredictions = async (): Promise<Prediction[]> => {
  try {
    const predictionsRef = collection(db, 'predictions');
    const predictionsSnap = await getDocs(predictionsRef);
    
    const predictions: Prediction[] = [];
    predictionsSnap.forEach((doc) => {
      predictions.push(doc.data() as Prediction);
    });
    
    return predictions;
  } catch (error) {
    console.error('Error getting predictions:', error);
    return [];
  }
};

// Listen to team stats changes (for real-time updates)
export const subscribeToTeamStats = (callback: (stats: TeamStats[]) => void): (() => void) => {
  const unsubscribes: (() => void)[] = [];
  
  TEAMS.forEach((team) => {
    const votesRef = collection(db, 'teams', team.id, 'votes');
    const unsubscribe = onSnapshot(votesRef, () => {
      getTeamStats().then(callback);
    });
    unsubscribes.push(unsubscribe);
  });
  
  // Return cleanup function
  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
};