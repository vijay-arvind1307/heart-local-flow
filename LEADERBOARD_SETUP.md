# 🏆 Leaderboard Feature Setup Guide

This guide will help you set up the complete leaderboard system for your Ripple platform.

## 📋 Overview

The leaderboard system includes:
- **Real-time leaderboard** with top users display
- **Point calculation system** for events, donations, and referrals
- **Badge system** with achievements
- **Level progression** based on total points
- **Streak tracking** for daily activity
- **Firebase Cloud Functions** for server-side calculations

## 🚀 Quick Start

### 1. Firebase Setup

#### Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`ripple-factor`)
3. Navigate to **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode** (for development)
6. Select a location close to your users

#### Enable Authentication (if not already done)
1. Go to **Authentication** in Firebase Console
2. Enable **Email/Password** and **Google** sign-in methods
3. Add your domain to authorized domains

### 2. Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data and leaderboard
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leaderboard snapshots are read-only
    match /leaderboardSnapshots/{docId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // Event completions
    match /eventCompletions/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Donations
    match /donations/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Referrals
    match /referrals/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // User activities (for analytics)
    match /userActivities/{docId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Database Schema

Create the following collections in Firestore:

#### Users Collection
```typescript
{
  id: string,                    // User ID (from Firebase Auth)
  name: string,                  // Display name
  avatar: string,                // Profile picture URL
  email: string,                 // Email address
  totalPoints: number,           // Total points earned
  volunteerHours: number,        // Total hours volunteered
  completedEvents: number,       // Number of events completed
  badges: string[],              // Array of badge IDs
  rank: number,                  // Current rank (calculated)
  level: number,                 // User level (calculated)
  streak: number,                // Current streak days
  lastActivity: Timestamp,       // Last activity timestamp
  createdAt: Timestamp,          // Account creation timestamp
  organization?: string,         // Optional: organization name
  bio?: string,                  // Optional: user bio
  location?: string              // Optional: user location
}
```

#### Event Completions Collection
```typescript
{
  id: string,                    // Auto-generated
  userId: string,                // User who completed the event
  eventId: string,               // Event ID
  eventName: string,             // Event name
  pointsEarned: number,          // Points earned
  hoursSpent: number,            // Hours spent
  organizationId: string,        // Organization ID
  organizationName: string,      // Organization name
  completedAt: Timestamp         // Completion timestamp
}
```

#### Donations Collection
```typescript
{
  id: string,                    // Auto-generated
  userId: string,                // User who made donation
  amount: number,                // Donation amount
  pointsEarned: number,          // Points earned
  organizationId: string,        // Organization ID
  organizationName: string,      // Organization name
  donatedAt: Timestamp           // Donation timestamp
}
```

#### Referrals Collection
```typescript
{
  id: string,                    // Auto-generated
  referrerId: string,            // User who made the referral
  referredUserId: string,        // User who was referred
  pointsEarned: number,          // Points earned by referrer
  referredAt: Timestamp          // Referral timestamp
}
```

### 4. Sample Data

Add some sample users to test the leaderboard:

```javascript
// Add this to your Firebase Console > Firestore > Add Document
{
  "name": "Elena Rodriguez",
  "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  "email": "elena@example.com",
  "totalPoints": 2847,
  "volunteerHours": 256,
  "completedEvents": 42,
  "badges": ["volunteer-100", "streak-30", "donation-100"],
  "rank": 1,
  "level": 15,
  "streak": 45,
  "lastActivity": Timestamp.now(),
  "createdAt": Timestamp.now(),
  "bio": "Passionate community volunteer",
  "location": "Coimbatore, India"
}
```

## 🔧 Firebase Cloud Functions Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Initialize Firebase Functions
```bash
firebase login
firebase init functions
```

### 3. Deploy Functions
Copy the contents of `firebase-functions/leaderboard-functions.js` to your `functions/index.js` file, then deploy:

```bash
firebase deploy --only functions
```

## 🎯 Points System

### Point Calculation Rules
- **Event Completion**: 50 base points + 10 points per hour
- **Donations**: 1 point per dollar donated
- **Referrals**: 25 points per successful referral
- **Streak Bonus**: 5 points per day maintained

### Badge System
- **First Step** (🎯): Complete first event
- **Dedicated Helper** (🌟): 10+ volunteer hours
- **Community Hero** (🏆): 50+ volunteer hours
- **Legendary Volunteer** (👑): 100+ volunteer hours
- **Week Warrior** (🔥): 7+ day streak
- **Month Master** (⚡): 30+ day streak
- **Team Builder** (🤝): Refer 5+ friends
- **Generous Heart** (💝): Donate $100+

### Level System
- **Level 1**: 0-99 points
- **Level 2**: 100-199 points
- **Level 3**: 200-299 points
- And so on...

## 🎨 Customization

### Colors and Styling
The leaderboard uses your existing design system. You can customize:

1. **Badge Colors**: Edit `BADGES` object in `src/lib/leaderboard.ts`
2. **Level Colors**: Modify `getLevelColor` function in `LeaderboardPage.tsx`
3. **Podium Colors**: Update `podiumColors` object in `LeaderboardPage.tsx`

### Point Rules
Modify the `POINTS_RULES` object in `src/lib/leaderboard.ts`:

```typescript
export const POINTS_RULES = {
  EVENT_COMPLETION: 50,    // Base points for completing an event
  HOUR_MULTIPLIER: 10,     // Points per hour volunteered
  STREAK_BONUS: 5,         // Bonus points for maintaining streak
  REFERRAL_BONUS: 25,      // Points for referring a friend
  DONATION_BONUS: 1,       // Points per dollar donated
};
```

## 🧪 Testing

### 1. Test with Mock Data
The leaderboard currently uses mock data. To test with real Firebase data:

1. Replace mock data calls in `LeaderboardPage.tsx` with Firebase queries
2. Use the `useLeaderboard` hook for real-time updates
3. Test point calculations with the provided functions

### 2. Test Point Calculations
```javascript
// Test event completion
await recordEventCompletion(
  'event-123',
  'Food Bank Volunteer',
  4,
  'org-456',
  'Community Food Bank'
);

// Test donation
await recordDonation(50, 'org-456', 'Community Food Bank');

// Test referral
await recordReferral('referred-user-id');
```

## 📱 Mobile Responsiveness

The leaderboard is fully responsive with:
- **Mobile-first design**
- **Horizontal scrolling** for opportunity cards
- **Touch-friendly interactions**
- **Optimized for all screen sizes**

## 🔄 Real-time Updates

The leaderboard updates in real-time using:
- **Firebase Firestore listeners**
- **React Query for caching**
- **Optimistic updates** for better UX

## 🚨 Error Handling

The system includes comprehensive error handling:
- **Network errors**
- **Authentication errors**
- **Firebase permission errors**
- **Data validation errors**

## 📊 Analytics

Track leaderboard engagement with:
- **User activity logs**
- **Point earning events**
- **Badge unlock events**
- **Streak maintenance**

## 🔒 Security Considerations

1. **Server-side validation** in Cloud Functions
2. **Client-side input validation**
3. **Firestore security rules**
4. **Rate limiting** for point calculations
5. **Audit logging** for all point changes

## 🚀 Deployment Checklist

- [ ] Firebase project configured
- [ ] Firestore database created
- [ ] Security rules updated
- [ ] Cloud Functions deployed
- [ ] Sample data added
- [ ] Authentication enabled
- [ ] Domain authorized
- [ ] Error handling tested
- [ ] Mobile responsiveness verified
- [ ] Real-time updates working

## 🆘 Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check Firestore security rules
   - Verify user authentication

2. **Real-time updates not working**
   - Check Firebase configuration
   - Verify network connectivity

3. **Points not updating**
   - Check Cloud Functions deployment
   - Verify function triggers

4. **Badges not appearing**
   - Check badge calculation logic
   - Verify user data structure

### Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console errors
3. Verify network requests
4. Test with Firebase emulator

## 🎉 Congratulations!

Your leaderboard system is now ready! Users can:
- View real-time rankings
- Earn points through volunteering
- Unlock badges and achievements
- Track their progress
- Compete with other volunteers

The system will automatically:
- Calculate points and levels
- Award badges based on achievements
- Update rankings in real-time
- Maintain user streaks
- Create leaderboard snapshots

Happy coding! 🚀
