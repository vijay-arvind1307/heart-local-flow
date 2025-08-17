import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { NgoProfileEditor } from '../components/NgoProfileEditor';
// TODO: If NgoProfileEditor is in a different path, update the import path accordingly
// import { EmergencyPostModal } from '../components/EmergencyPostModal';

export const NgoDashboardPage = () => {
  const { user } = useAuth();
  const [ngoData, setNgoData] = useState<any>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  useEffect(() => {
    const fetchNgoData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setNgoData(userDoc.data());
        }
      }
    };
    fetchNgoData();
  }, [user]);

  if (!ngoData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {ngoData.ngoName || 'NGO Partner'}!
        </h1>
        <div className="space-x-4">
          <Button variant="default">
            Post a New Opportunity
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsEmergencyModalOpen(true)}
          >
            Post an Emergency Alert
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-xl mb-2">Total Volunteers</h3>
              <p className="text-3xl font-bold">0</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-xl mb-2">Active Opportunities</h3>
              <p className="text-3xl font-bold">0</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-xl mb-2">Emergency Alerts</h3>
              <p className="text-3xl font-bold">0</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">My Opportunities</h2>
            {/* Opportunities list will go here */}
            <p>No opportunities posted yet.</p>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="mt-6">
            <NgoProfileEditor ngoData={ngoData} />
          </div>
        </TabsContent>
      </Tabs>

      {/*
            <EmergencyPostModal 
              isOpen={isEmergencyModalOpen}
              onClose={() => setIsEmergencyModalOpen(false)}
            />
      */}
      ```
    </div>
  );
};
