import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  onSnapshot,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

// User interface for Firestore
export interface User {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  volunteerHours: number;
  completedEvents: number;
  badges: string[];
  rank: number;
  level: number;
  streak: number;
  lastActivity: Timestamp;
  createdAt: Timestamp;
  email: string;
  organization?: string;
  bio?: string;
  location?: string;
}

// Event completion interface
export interface EventCompletion {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  pointsEarned: number;
  hoursSpent: number;
  completedAt: Timestamp;
  organizationId: string;
  organizationName: string;
}

// Badge definitions
export const BADGES = {
  'first-event': { name: 'First Step', icon: '🎯', color: 'bg-blue-500', pointsRequired: 1 },
  'volunteer-10': { name: 'Dedicated Helper', icon: '🌟', color: 'bg-green-500', pointsRequired: 100 },
  'volunteer-50': { name: 'Community Hero', icon: '🏆', color: 'bg-yellow-500', pointsRequired: 500 },
  'volunteer-100': { name: 'Legendary Volunteer', icon: '👑', color: 'bg-purple-500', pointsRequired: 1000 },
  'streak-7': { name: 'Week Warrior', icon: '🔥', color: 'bg-orange-500', pointsRequired: 50 },
  'streak-30': { name: 'Month Master', icon: '⚡', color: 'bg-red-500', pointsRequired: 200 },
  'referral-5': { name: 'Team Builder', icon: '🤝', color: 'bg-indigo-500', pointsRequired: 300 },
  'donation-100': { name: 'Generous Heart', icon: '💝', color: 'bg-pink-500', pointsRequired: 100 },
};

// Points calculation rules
export const POINTS_RULES = {
  EVENT_COMPLETION: 50, // Base points for completing an event
  HOUR_MULTIPLIER: 10, // Points per hour volunteered
  STREAK_BONUS: 5, // Bonus points for maintaining streak
  REFERRAL_BONUS: 25, // Points for referring a friend
  DONATION_BONUS: 1, // Points per dollar donated
};

// Level calculation
export const calculateLevel = (totalPoints: number): number => {
  return Math.floor(totalPoints / 100) + 1;
};

// Badge calculation
export const calculateBadges = (user: User): string[] => {
  const badges: string[] = [];
  
  // First event badge
  if (user.completedEvents >= 1) {
    badges.push('first-event');
  }
  
  // Volunteer hour badges
  if (user.volunteerHours >= 100) {
    badges.push('volunteer-100');
  } else if (user.volunteerHours >= 50) {
    badges.push('volunteer-50');
  } else if (user.volunteerHours >= 10) {
    badges.push('volunteer-10');
  }
  
  // Streak badges
  if (user.streak >= 30) {
    badges.push('streak-30');
  } else if (user.streak >= 7) {
    badges.push('streak-7');
  }
  
  return badges;
};

// Update user points and stats
export const updateUserStats = async (
  userId: string, 
  pointsToAdd: number, 
  hoursToAdd: number = 0,
  eventCompleted: boolean = false
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as User;
    const newTotalPoints = userData.totalPoints + pointsToAdd;
    const newVolunteerHours = userData.volunteerHours + hoursToAdd;
    const newCompletedEvents = eventCompleted ? userData.completedEvents + 1 : userData.completedEvents;
    const newLevel = calculateLevel(newTotalPoints);
    
    // Update streak (simplified logic - in real app, check last activity date)
    const newStreak = userData.streak; // This would be calculated based on daily activity
    
    // Calculate new badges
    const updatedUser = {
      ...userData,
      totalPoints: newTotalPoints,
      volunteerHours: newVolunteerHours,
      completedEvents: newCompletedEvents,
      level: newLevel,
      streak: newStreak,
      lastActivity: serverTimestamp(),
    };
    
    const newBadges = calculateBadges(updatedUser);
    updatedUser.badges = newBadges;
    
    await updateDoc(userRef, updatedUser);
    
    // Log the activity
    await addDoc(collection(db, 'userActivities'), {
      userId,
      type: eventCompleted ? 'event_completed' : 'points_earned',
      pointsEarned: pointsToAdd,
      hoursSpent: hoursToAdd,
      timestamp: serverTimestamp(),
      totalPointsAfter: newTotalPoints,
    });
    
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Get leaderboard data
export const getLeaderboard = async (
  timeFilter: 'weekly' | 'monthly' | 'all-time' = 'all-time',
  limit: number = 50
): Promise<User[]> => {
  try {
    let q = query(
      collection(db, 'users'),
      orderBy('totalPoints', 'desc'),
      limit(limit)
    );
    
    // Add time filter if needed (in real app, you'd filter by date range)
    // For now, we'll return all-time data
    
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
        rank: 0, // Will be calculated below
      } as User);
    });
    
    // Calculate ranks
    users.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Get current user's data
export const getCurrentUserData = async (): Promise<User | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data() as User;
    return {
      id: userDoc.id,
      ...userData,
    };
  } catch (error) {
    console.error('Error fetching current user data:', error);
    throw error;
  }
};

// Get user's rank
export const getUserRank = async (userId: string): Promise<number> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return -1;
    }
    
    const userData = userDoc.data() as User;
    
    // Get all users ordered by points
    const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let rank = 1;
    for (const doc of querySnapshot.docs) {
      if (doc.id === userId) {
        return rank;
      }
      rank++;
    }
    
    return -1;
  } catch (error) {
    console.error('Error calculating user rank:', error);
    throw error;
  }
};

// Real-time leaderboard subscription
export const subscribeToLeaderboard = (
  callback: (users: User[]) => void,
  timeFilter: 'weekly' | 'monthly' | 'all-time' = 'all-time'
) => {
  const q = query(
    collection(db, 'users'),
    orderBy('totalPoints', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
        rank: 0,
      } as User);
    });
    
    // Calculate ranks
    users.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    callback(users);
  });
};

// Record event completion
export const recordEventCompletion = async (
  eventId: string,
  eventName: string,
  hoursSpent: number,
  organizationId: string,
  organizationName: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Calculate points earned
    const pointsEarned = POINTS_RULES.EVENT_COMPLETION + (hoursSpent * POINTS_RULES.HOUR_MULTIPLIER);
    
    // Update user stats
    await updateUserStats(currentUser.uid, pointsEarned, hoursSpent, true);
    
    // Record the event completion
    await addDoc(collection(db, 'eventCompletions'), {
      userId: currentUser.uid,
      eventId,
      eventName,
      pointsEarned,
      hoursSpent,
      organizationId,
      organizationName,
      completedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error('Error recording event completion:', error);
    throw error;
  }
};

// Record donation
export const recordDonation = async (
  amount: number,
  organizationId: string,
  organizationName: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const pointsEarned = Math.floor(amount * POINTS_RULES.DONATION_BONUS);
    
    // Update user stats
    await updateUserStats(currentUser.uid, pointsEarned);
    
    // Record the donation
    await addDoc(collection(db, 'donations'), {
      userId: currentUser.uid,
      amount,
      pointsEarned,
      organizationId,
      organizationName,
      donatedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error('Error recording donation:', error);
    throw error;
  }
};

// Record referral
export const recordReferral = async (referredUserId: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const pointsEarned = POINTS_RULES.REFERRAL_BONUS;
    
    // Update referrer's stats
    await updateUserStats(currentUser.uid, pointsEarned);
    
    // Record the referral
    await addDoc(collection(db, 'referrals'), {
      referrerId: currentUser.uid,
      referredUserId,
      pointsEarned,
      referredAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error('Error recording referral:', error);
    throw error;
  }
};
