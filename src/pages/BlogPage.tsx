
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleCard from "../components/ArticleCard";

// Dummy data for demonstration
const studentStories = [
  {
    id: 1,
    title: "From Struggle to Success: Priya's Journey",
    author: "Priya Sharma",
    category: "Success Story",
    tags: ["Education", "Inspiration"],
    image: "/assets/hero-image.jpg",
  },
  {
    id: 2,
    title: "How Volunteering Changed My Life",
    author: "Rahul Verma",
    category: "Student Experience",
    tags: ["Volunteering", "Growth"],
    image: "/assets/hero-image.jpg",
  },
  // ...more stories
];

const ngoUpdates = [
  {
    id: 101,
    title: "Clean Water Project Launched",
    author: "GreenEarth NGO",
    category: "NGO Update",
    tags: ["Environment", "Water"],
    image: "/assets/hero-image.jpg",
  },
  {
    id: 102,
    title: "New Education Center Opens",
    author: "EduCare Foundation",
    category: "NGO Update",
    tags: ["Education", "Community"],
    image: "/assets/hero-image.jpg",
  },
  // ...more updates
];

const tabs = [
  { label: "Student Stories", key: "students" },
  { label: "NGO Updates", key: "ngos" },
];

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [posts, setPosts] = useState(studentStories);

  useEffect(() => {
    setPosts(activeTab === "students" ? studentStories : ngoUpdates);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-darkNavy text-offWhite pb-16">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-darkNavy to-[#1a2236] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-offWhite">Our Community in Action</h1>
        <p className="text-lg md:text-xl text-mildRed font-medium max-w-2xl mx-auto">
          Stories of change from our students and updates from our partner NGOs.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex justify-center mt-10 mb-6">
        <div className="inline-flex bg-[#232b45] rounded-lg p-1 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none ${
                activeTab === tab.key
                  ? "bg-mildRed text-white shadow-md"
                  : "text-offWhite hover:bg-[#2d3656]"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <ArticleCard {...post} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;