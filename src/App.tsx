import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import LeaderboardPage from "./pages/LeaderboardPage";
import AuthChoicePage from "./pages/AuthChoicePage";
import StudentLoginPage from "./pages/StudentLoginPage";
import NgoLoginPage from "./pages/NgoLoginPage";
import NgoDashboard from "./pages/NgoDashboard";
import NgoProfilePage from "./pages/NgoProfilePage";
import WishlistPage from "./pages/WishlistPage";
import StatCardDemo from "./pages/StatCardDemo";
import OpportunityDetailPage from "./pages/OpportunityDetailPage";
import PrivateRoute from "./components/PrivateRoute";

import NotFound from "./pages/NotFound";

import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/get-started" element={<AuthChoicePage />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route path="/ngo-login" element={<NgoLoginPage />} />
          <Route path="/ngo/:ngoId" element={<NgoProfilePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/ngo-dashboard" element={<NgoDashboard />} />
            <Route path="/stat-card-demo" element={<StatCardDemo />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
