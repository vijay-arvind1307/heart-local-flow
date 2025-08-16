// Firebase Cloud Functions for Leaderboard System
// Deploy this to Firebase Functions for server-side point calculations

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// Points calculation rules
const POINTS_RULES = {
  EVENT_COMPLETION: 50,
  HOUR_MULTIPLIER: 10,
  STREAK_BONUS: 5,
  REFERRAL_BONUS: 25,
  DONATION_BONUS: 1,
};

// Calculate user level based on total points
const calculateLevel = (totalPoints) => {
  return Math.floor(totalPoints / 100) + 1;
};

// Calculate badges based on user stats
const calculateBadges = (user) => {
  const badges = [];
  
  if (user.completedEvents >= 1) {
    badges.push('first-event');
  }
  
  if (user.volunteerHours >= 100) {
    badges.push('volunteer-100');
  } else if (user.volunteerHours >= 50) {
    badges.push('volunteer-50');
  } else if (user.volunteerHours >= 10) {
    badges.push('volunteer-10');
  }
  
  if (user.streak >= 30) {
    badges.push('streak-30');
  } else if (user.streak >= 7) {
    badges.push('streak-7');
  }
  
  return badges;
};

// Update user streak based on daily activity
const updateUserStreak = async (userId) => {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) return;
  
  const userData = userDoc.data();
  const now = admin.firestore.Timestamp.now();
  const lastActivity = userData.lastActivity || now;
  
  // Check if user was active yesterday
  const yesterday = new Date(now.toDate());
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastActivityDate = lastActivity.toDate();
  const isConsecutiveDay = 
    lastActivityDate.getDate() === yesterday.getDate() &&
    lastActivityDate.getMonth() === yesterday.getMonth() &&
    lastActivityDate.getFullYear() === yesterday.getFullYear();
  
  let newStreak = userData.streak || 0;
  
  if (isConsecutiveDay) {
    newStreak += 1;
  } else {
    // Check if it's today (reset streak to 1)
    const today = new Date(now.toDate());
    const isToday = 
      lastActivityDate.getDate() === today.getDate() &&
      lastActivityDate.getMonth() === today.getMonth() &&
      lastActivityDate.getFullYear() === today.getFullYear();
    
    if (!isToday) {
      newStreak = 1;
    }
  }
  
  return newStreak;
};

// Cloud Function: Update user stats when event is completed
exports.onEventCompletion = functions.firestore
  .document('eventCompletions/{completionId}')
  .onCreate(async (snap, context) => {
    const completionData = snap.data();
    const userId = completionData.userId;
    
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        console.error('User not found:', userId);
        return;
      }
      
      const userData = userDoc.data();
      const pointsEarned = completionData.pointsEarned;
      const hoursSpent = completionData.hoursSpent;
      
      // Update user stats
      const newTotalPoints = userData.totalPoints + pointsEarned;
      const newVolunteerHours = userData.volunteerHours + hoursSpent;
      const newCompletedEvents = userData.completedEvents + 1;
      const newLevel = calculateLevel(newTotalPoints);
      const newStreak = await updateUserStreak(userId);
      
      // Calculate new badges
      const updatedUser = {
        ...userData,
        totalPoints: newTotalPoints,
        volunteerHours: newVolunteerHours,
        completedEvents: newCompletedEvents,
        level: newLevel,
        streak: newStreak,
        lastActivity: admin.firestore.Timestamp.now(),
      };
      
      const newBadges = calculateBadges(updatedUser);
      updatedUser.badges = newBadges;
      
      await userRef.update(updatedUser);
      
      console.log(`Updated user ${userId} stats: +${pointsEarned} points, +${hoursSpent} hours`);
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  });

// Cloud Function: Update user stats when donation is made
exports.onDonation = functions.firestore
  .document('donations/{donationId}')
  .onCreate(async (snap, context) => {
    const donationData = snap.data();
    const userId = donationData.userId;
    
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        console.error('User not found:', userId);
        return;
      }
      
      const userData = userDoc.data();
      const pointsEarned = donationData.pointsEarned;
      
      // Update user stats
      const newTotalPoints = userData.totalPoints + pointsEarned;
      const newLevel = calculateLevel(newTotalPoints);
      const newStreak = await updateUserStreak(userId);
      
      const updatedUser = {
        ...userData,
        totalPoints: newTotalPoints,
        level: newLevel,
        streak: newStreak,
        lastActivity: admin.firestore.Timestamp.now(),
      };
      
      const newBadges = calculateBadges(updatedUser);
      updatedUser.badges = newBadges;
      
      await userRef.update(updatedUser);
      
      console.log(`Updated user ${userId} stats: +${pointsEarned} points from donation`);
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  });

// Cloud Function: Update user stats when referral is made
exports.onReferral = functions.firestore
  .document('referrals/{referralId}')
  .onCreate(async (snap, context) => {
    const referralData = snap.data();
    const referrerId = referralData.referrerId;
    
    try {
      const userRef = db.collection('users').doc(referrerId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        console.error('User not found:', referrerId);
        return;
      }
      
      const userData = userDoc.data();
      const pointsEarned = referralData.pointsEarned;
      
      // Update user stats
      const newTotalPoints = userData.totalPoints + pointsEarned;
      const newLevel = calculateLevel(newTotalPoints);
      const newStreak = await updateUserStreak(referrerId);
      
      const updatedUser = {
        ...userData,
        totalPoints: newTotalPoints,
        level: newLevel,
        streak: newStreak,
        lastActivity: admin.firestore.Timestamp.now(),
      };
      
      const newBadges = calculateBadges(updatedUser);
      updatedUser.badges = newBadges;
      
      await userRef.update(updatedUser);
      
      console.log(`Updated user ${referrerId} stats: +${pointsEarned} points from referral`);
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  });

// Cloud Function: Daily streak reset (runs at midnight)
exports.dailyStreakReset = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const usersSnapshot = await db.collection('users').get();
      
      const batch = db.batch();
      let batchCount = 0;
      const maxBatchSize = 500;
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const lastActivity = userData.lastActivity;
        
        if (lastActivity) {
          const lastActivityDate = lastActivity.toDate();
          const now = new Date();
          const daysSinceLastActivity = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));
          
          // Reset streak if user hasn't been active for more than 1 day
          if (daysSinceLastActivity > 1) {
            batch.update(userDoc.ref, { streak: 0 });
            batchCount++;
          }
        }
        
        // Commit batch if it reaches max size
        if (batchCount >= maxBatchSize) {
          await batch.commit();
          batchCount = 0;
        }
      }
      
      // Commit remaining updates
      if (batchCount > 0) {
        await batch.commit();
      }
      
      console.log('Daily streak reset completed');
      
    } catch (error) {
      console.error('Error in daily streak reset:', error);
    }
  });

// Cloud Function: Weekly leaderboard snapshot
exports.weeklyLeaderboardSnapshot = functions.pubsub
  .schedule('0 0 * * 0') // Every Sunday at midnight
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const usersSnapshot = await db.collection('users')
        .orderBy('totalPoints', 'desc')
        .limit(100)
        .get();
      
      const leaderboardData = usersSnapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        totalPoints: doc.data().totalPoints,
        volunteerHours: doc.data().volunteerHours,
        completedEvents: doc.data().completedEvents,
        timestamp: admin.firestore.Timestamp.now(),
      }));
      
      // Save weekly snapshot
      await db.collection('leaderboardSnapshots').add({
        type: 'weekly',
        data: leaderboardData,
        timestamp: admin.firestore.Timestamp.now(),
      });
      
      console.log('Weekly leaderboard snapshot saved');
      
    } catch (error) {
      console.error('Error creating weekly leaderboard snapshot:', error);
    }
  });

// Cloud Function: Monthly leaderboard snapshot
exports.monthlyLeaderboardSnapshot = functions.pubsub
  .schedule('0 0 1 * *') // First day of every month at midnight
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const usersSnapshot = await db.collection('users')
        .orderBy('totalPoints', 'desc')
        .limit(100)
        .get();
      
      const leaderboardData = usersSnapshot.docs.map((doc, index) => ({
        userId: doc.id,
        rank: index + 1,
        totalPoints: doc.data().totalPoints,
        volunteerHours: doc.data().volunteerHours,
        completedEvents: doc.data().completedEvents,
        timestamp: admin.firestore.Timestamp.now(),
      }));
      
      // Save monthly snapshot
      await db.collection('leaderboardSnapshots').add({
        type: 'monthly',
        data: leaderboardData,
        timestamp: admin.firestore.Timestamp.now(),
      });
      
      console.log('Monthly leaderboard snapshot saved');
      
    } catch (error) {
      console.error('Error creating monthly leaderboard snapshot:', error);
    }
  });
