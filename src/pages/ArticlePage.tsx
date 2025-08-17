
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Interweave } from "interweave";
import { ArrowLeft, Share2, Twitter, Facebook, Linkedin, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

const socialLinks = [
  { 
    name: "Twitter", 
    icon: Twitter, 
    url: "https://twitter.com/intent/tweet",
    color: "hover:text-blue-400"
  },
  { 
    name: "Facebook", 
    icon: Facebook, 
    url: "https://facebook.com/sharer/sharer.php",
    color: "hover:text-blue-600"
  },
  { 
    name: "LinkedIn", 
    icon: Linkedin, 
    url: "https://linkedin.com/sharing/share-offsite",
    color: "hover:text-blue-700"
  },
];

const ArticlePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postDoc = await getDoc(doc(db, 'posts', id));
        
        if (postDoc.exists()) {
          const data = postDoc.data();
          setPost({
            id: postDoc.id,
            title: data.title,
            author: data.author,
            category: data.category,
            tags: data.tags || [],
            featuredImageUrl: data.featuredImageUrl,
            content: data.content,
            createdAt: data.createdAt,
            status: data.status
          });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Error loading post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.content?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blog')} className="bg-red-500 hover:bg-red-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header with Back Button */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        {/* Sticky Social Bar */}
        <motion.aside 
          className="hidden lg:flex flex-col items-center sticky top-24 h-fit mr-8 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="space-y-4 bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
            <div className="text-center mb-2">
              <Share2 className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <span className="text-xs text-gray-400">Share</span>
            </div>
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => handleShare(link.name.toLowerCase())}
                  className={`group p-2 rounded-lg transition-all duration-200 ${link.color}`}
                  aria-label={`Share on ${link.name}`}
                >
                  <IconComponent className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
                </button>
              );
            })}
          </div>
        </motion.aside>

        {/* Article Content */}
        <main className="max-w-4xl w-full mx-auto px-4 py-8 pb-20 lg:pb-8">
          {/* Featured Image Header */}
          {post.featuredImageUrl && (
            <motion.div 
              className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                  {post.title}
                </h1>
              </div>
            </motion.div>
          )}

          {/* Article Header (if no featured image) */}
          {!post.featuredImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                {post.title}
              </h1>
            </motion.div>
          )}

          {/* Meta Information */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 mb-8 text-gray-400 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {post.author}</span>
            </div>
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            <span className="text-red-500 font-medium">{post.category}</span>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-700 text-xs text-red-500 px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Article Content */}
          <motion.article 
            className="max-w-none text-white leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Interweave 
              content={post.content}
              className="article-content"
            />
          </motion.article>
        </main>
      </div>

      {/* Mobile Social Sharing Bar */}
      <motion.div 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4 z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex justify-center items-center space-x-6">
          <span className="text-sm text-gray-400 mr-2">Share:</span>
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => handleShare(link.name.toLowerCase())}
                className={`group p-2 rounded-lg transition-all duration-200 ${link.color}`}
                aria-label={`Share on ${link.name}`}
              >
                <IconComponent className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ArticlePage;