import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

// NGO interface
export interface NGO {
  id: string;
  name: string;
  email: string;
  description: string;
  location: string;
  website?: string;
  phone?: string;
  logo?: string;
  category: string;
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Stats
  volunteersCount: number;
  activeEvents: number;
  totalHours: number;
  donations: number;
  beneficiaries: number;
  completedEvents: number;
  averageRating: number;
  monthlyGrowth: number;
  
  // Contact info
  contactPerson: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Event interface
export interface NGOEvent {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: Timestamp;
  endDate: Timestamp;
  maxVolunteers: number;
  currentVolunteers: number;
  status: 'active' | 'completed' | 'cancelled';
  requirements: string[];
  skills: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Volunteer application interface
export interface VolunteerApplication {
  id: string;
  eventId: string;
  ngoId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  appliedAt: Timestamp;
  respondedAt?: Timestamp;
  hoursCompleted?: number;
  rating?: number;
  feedback?: string;
}

// Mock data for development
export const mockNGOData: NGO = {
  id: 'mock-ngo-1',
  name: 'Community Food Bank',
  email: 'contact@foodbank.org',
  description: 'Providing food assistance to families in need across the community.',
  location: 'Coimbatore, Tamil Nadu',
  website: 'https://foodbank.org',
  phone: '+91 98765 43210',
  logo: 'https://i.pravatar.cc/150?u=foodbank',
  category: 'Hunger Relief',
  verified: true,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  
  // Stats
  volunteersCount: 247,
  activeEvents: 12,
  totalHours: 1847,
  donations: 15420,
  beneficiaries: 892,
  completedEvents: 156,
  averageRating: 4.8,
  monthlyGrowth: 23,
  
  // Contact info
  contactPerson: 'Sarah Johnson',
  address: '123 Main Street',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  country: 'India',
  postalCode: '641001'
};

// Fetch NGO data by ID
export const getNGOById = async (ngoId: string): Promise<NGO | null> => {
  try {
    const ngoDoc = await getDoc(doc(db, 'ngos', ngoId));
    if (ngoDoc.exists()) {
      return {
        id: ngoDoc.id,
        ...ngoDoc.data()
      } as NGO;
    }
    return null;
  } catch (error) {
    console.error('Error fetching NGO:', error);
    return null;
  }
};

// Fetch current user's NGO data
export const getCurrentUserNGO = async (): Promise<NGO | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    
    return await getNGOById(currentUser.uid);
  } catch (error) {
    console.error('Error fetching current user NGO:', error);
    return null;
  }
};

// Update NGO stats
export const updateNGOStats = async (
  ngoId: string, 
  updates: Partial<Pick<NGO, 'volunteersCount' | 'activeEvents' | 'totalHours' | 'donations' | 'beneficiaries' | 'completedEvents' | 'averageRating' | 'monthlyGrowth'>>
): Promise<void> => {
  try {
    const ngoRef = doc(db, 'ngos', ngoId);
    await updateDoc(ngoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating NGO stats:', error);
    throw error;
  }
};

// Create new NGO event
export const createNGOEvent = async (eventData: Omit<NGOEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const eventRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update NGO stats
    await updateNGOStats(eventData.ngoId, {
      activeEvents: (await getNGOById(eventData.ngoId))?.activeEvents + 1 || 1
    });
    
    return eventRef.id;
  } catch (error) {
    console.error('Error creating NGO event:', error);
    throw error;
  }
};

// Get NGO events
export const getNGOEvents = async (ngoId: string, status?: 'active' | 'completed' | 'cancelled'): Promise<NGOEvent[]> => {
  try {
    let q = query(
      collection(db, 'events'),
      where('ngoId', '==', ngoId),
      orderBy('createdAt', 'desc')
    );
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    const querySnapshot = await getDocs(q);
    const events: NGOEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      } as NGOEvent);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching NGO events:', error);
    return [];
  }
};

// Get volunteer applications for NGO
export const getNGOApplications = async (ngoId: string): Promise<VolunteerApplication[]> => {
  try {
    const q = query(
      collection(db, 'applications'),
      where('ngoId', '==', ngoId),
      orderBy('appliedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications: VolunteerApplication[] = [];
    
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data()
      } as VolunteerApplication);
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching NGO applications:', error);
    return [];
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string, 
  status: 'approved' | 'rejected' | 'completed',
  hoursCompleted?: number,
  rating?: number,
  feedback?: string
): Promise<void> => {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    const updateData: any = {
      status,
      respondedAt: serverTimestamp()
    };
    
    if (hoursCompleted !== undefined) updateData.hoursCompleted = hoursCompleted;
    if (rating !== undefined) updateData.rating = rating;
    if (feedback !== undefined) updateData.feedback = feedback;
    
    await updateDoc(applicationRef, updateData);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Real-time NGO stats subscription
export const subscribeToNGOStats = (
  ngoId: string,
  callback: (stats: Partial<NGO>) => void
) => {
  const ngoRef = doc(db, 'ngos', ngoId);
  
  return onSnapshot(ngoRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        volunteersCount: data.volunteersCount || 0,
        activeEvents: data.activeEvents || 0,
        totalHours: data.totalHours || 0,
        donations: data.donations || 0,
        beneficiaries: data.beneficiaries || 0,
        completedEvents: data.completedEvents || 0,
        averageRating: data.averageRating || 0,
        monthlyGrowth: data.monthlyGrowth || 0
      });
    }
  });
};

// Calculate NGO stats from events and applications
export const calculateNGOStats = async (ngoId: string): Promise<Partial<NGO>> => {
  try {
    // Get all events for this NGO
    const events = await getNGOEvents(ngoId);
    const applications = await getNGOApplications(ngoId);
    
    const stats = {
      activeEvents: events.filter(e => e.status === 'active').length,
      completedEvents: events.filter(e => e.status === 'completed').length,
      totalHours: applications
        .filter(a => a.hoursCompleted)
        .reduce((sum, app) => sum + (app.hoursCompleted || 0), 0),
      volunteersCount: new Set(applications.map(a => a.volunteerId)).size,
      averageRating: applications
        .filter(a => a.rating)
        .reduce((sum, app) => sum + (app.rating || 0), 0) / 
        applications.filter(a => a.rating).length || 0
    };
    
    return stats;
  } catch (error) {
    console.error('Error calculating NGO stats:', error);
    return {};
  }
};

// Search NGOs
export const searchNGOs = async (
  searchTerm: string,
  category?: string,
  location?: string,
  limit: number = 20
): Promise<NGO[]> => {
  try {
    let q = query(
      collection(db, 'ngos'),
      where('verified', '==', true),
      orderBy('name'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const ngos: NGO[] = [];
    
    querySnapshot.forEach((doc) => {
      const ngo = {
        id: doc.id,
        ...doc.data()
      } as NGO;
      
      // Filter by search term
      const matchesSearch = !searchTerm || 
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = !category || ngo.category === category;
      
      // Filter by location
      const matchesLocation = !location || 
        ngo.location.toLowerCase().includes(location.toLowerCase());
      
      if (matchesSearch && matchesCategory && matchesLocation) {
        ngos.push(ngo);
      }
    });
    
    return ngos;
  } catch (error) {
    console.error('Error searching NGOs:', error);
    return [];
  }
};

// Get top NGOs by impact
export const getTopNGOs = async (limit: number = 10): Promise<NGO[]> => {
  try {
    const q = query(
      collection(db, 'ngos'),
      where('verified', '==', true),
      orderBy('beneficiaries', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const ngos: NGO[] = [];
    
    querySnapshot.forEach((doc) => {
      ngos.push({
        id: doc.id,
        ...doc.data()
      } as NGO);
    });
    
    return ngos;
  } catch (error) {
    console.error('Error fetching top NGOs:', error);
    return [];
  }
};
