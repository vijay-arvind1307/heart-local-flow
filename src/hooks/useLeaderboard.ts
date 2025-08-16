import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getLeaderboard, 
  getCurrentUserData, 
  getUserRank, 
  subscribeToLeaderboard,
  User,
  type User as LeaderboardUser
} from '../lib/leaderboard';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface UseLeaderboardOptions {
  timeFilter?: 'weekly' | 'monthly' | 'all-time';
  limit?: number;
  enableRealTime?: boolean;
}

export interface LeaderboardData {
  users: User[];
  currentUser: User | null;
  currentUserRank: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useLeaderboard = (options: UseLeaderboardOptions = {}): LeaderboardData => {
  const {
    timeFilter = 'all-time',
    limit = 50,
    enableRealTime = false
  } = options;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<number>(-1);
  const queryClient = useQueryClient();

  // Query for leaderboard data
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['leaderboard', timeFilter, limit],
    queryFn: () => getLeaderboard(timeFilter, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for current user data
  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserData,
    enabled: !!auth.currentUser,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Query for current user rank
  const { data: userRank } = useQuery({
    queryKey: ['currentUserRank', currentUser?.id],
    queryFn: () => getUserRank(currentUser?.id || ''),
    enabled: !!currentUser?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update current user state when user data changes
  useEffect(() => {
    setCurrentUser(userData || null);
  }, [userData]);

  // Update current user rank when rank data changes
  useEffect(() => {
    setCurrentUserRank(userRank || -1);
  }, [userRank]);

  // Real-time subscription
  useEffect(() => {
    if (!enableRealTime) return;

    const unsubscribe = subscribeToLeaderboard((updatedUsers) => {
      queryClient.setQueryData(['leaderboard', timeFilter, limit], updatedUsers);
    }, timeFilter);

    return () => unsubscribe();
  }, [enableRealTime, timeFilter, limit, queryClient]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Refetch current user data when auth state changes
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        queryClient.invalidateQueries({ queryKey: ['currentUserRank'] });
      } else {
        setCurrentUser(null);
        setCurrentUserRank(-1);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return {
    users,
    currentUser,
    currentUserRank,
    isLoading,
    error: error as Error | null,
    refetch
  };
};

// Hook for getting current user's leaderboard stats
export const useCurrentUserStats = () => {
  const { currentUser, currentUserRank, isLoading, error } = useLeaderboard({
    enableRealTime: true
  });

  return {
    user: currentUser,
    rank: currentUserRank,
    isLoading,
    error
  };
};

// Hook for getting top users only
export const useTopUsers = (limit: number = 10) => {
  const { users, isLoading, error } = useLeaderboard({
    limit,
    enableRealTime: true
  });

  return {
    topUsers: users.slice(0, limit),
    isLoading,
    error
  };
};
