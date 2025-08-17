
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleCard from "../components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiPostGeneratorModal } from "../components/AiPostGeneratorModal";
import { sampleBlogData } from "../data/blogData";

// Interface for blog posts
interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  featuredImageUrl?: string;
  content: string;
  createdAt: any;
  status: string;
}

const tabs = [
  { label: "Student Stories", key: "students" },
  { label: "NGO Updates", key: "ngos" },
];

const BlogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Check if user is admin
  // Temporarily allow all authenticated users for testing
  const isAdmin = user ? true : false;

  // Use sample data instead of Firestore
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setAllPosts(sampleBlogData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter posts based on active tab
  useEffect(() => {
    const filteredPosts = allPosts.filter(post => {
      if (activeTab === "students") {
        return post.category === "Student Story";
      } else {
        return post.category === "NGO Update";
      }
    });
    setPosts(filteredPosts);
  }, [activeTab, allPosts]);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-slate-900 to-slate-800 py-16 px-4 text-center">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Our Community in Action</h1>
            <p className="text-lg md:text-xl text-red-500 font-medium max-w-2xl">
              Stories of change from our students and updates from our partner NGOs.
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-3">
              <Button
                onClick={() => setIsAiModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 border-0"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate with AI
              </Button>
              <Button
                onClick={() => navigate('/admin/create-post')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Post
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="flex justify-center mt-10 mb-6">
        <div className="inline-flex bg-slate-700 rounded-lg p-1 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none ${
                activeTab === tab.key
                  ? "bg-red-500 text-white shadow-md"
                  : "text-white hover:bg-slate-600"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading posts...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              No {activeTab === "students" ? "student stories" : "NGO updates"} found.
            </p>
            {isAdmin && (
              <Button
                onClick={() => navigate('/admin/create-post')}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <ArticleCard 
                  id={post.id}
                  title={post.title}
                  author={post.author}
                  category={post.category}
                  tags={post.tags}
                  image={post.featuredImageUrl || "/assets/hero-image.jpg"}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Post Generator Modal */}
      <AiPostGeneratorModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

export default BlogPage;