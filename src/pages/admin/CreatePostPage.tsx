import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

// Import React Quill for rich text editing
// Note: You'll need to install react-quill: npm install react-quill
import FallbackEditor from '../../components/FallbackEditor';

// Try to import ReactQuill, fallback to simple textarea if not available
let ReactQuill: any = null;
try {
  ReactQuill = require('react-quill').default;
  require('react-quill/dist/quill.snow.css');
} catch (error) {
  console.warn('ReactQuill not available, using fallback editor');
}

interface BlogPost {
  title: string;
  author: string;
  category: 'Student Story' | 'NGO Update';
  tags: string;
  featuredImageUrl: string;
  content: string;
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    title: '',
    author: '',
    category: 'Student Story',
    tags: '',
    featuredImageUrl: '',
    content: ''
  });

  // Check if user is admin (you can customize this logic)
  // Temporarily allow all authenticated users for testing
  const isAdmin = user ? true : false;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/blog')} className="bg-red-500 hover:bg-red-600">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof BlogPost, value: string) => {
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post.title || !post.author || !post.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        ...post,
        tags: post.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authorId: user?.uid,
        authorEmail: user?.email,
        status: 'published'
      };

      await addDoc(collection(db, 'posts'), postData);
      
      alert('Post published successfully!');
      navigate('/blog');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Error publishing post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Button>
            <h1 className="text-2xl font-bold text-white">Create New Post</h1>
          </div>
          <div className="text-sm text-gray-400">
            Logged in as: {user?.email}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
                     {/* Title */}
           <div>
             <Label htmlFor="title" className="text-white font-medium">
               Post Title *
             </Label>
             <Input
               id="title"
               type="text"
               value={post.title}
               onChange={(e) => handleInputChange('title', e.target.value)}
               placeholder="Enter the post title..."
               className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-red-500"
               required
             />
           </div>

                     {/* Author and Category Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <Label htmlFor="author" className="text-white font-medium">
                 Author *
               </Label>
               <Input
                 id="author"
                 type="text"
                 value={post.author}
                 onChange={(e) => handleInputChange('author', e.target.value)}
                 placeholder="Enter author name..."
                 className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-red-500"
                 required
               />
             </div>

             <div>
               <Label htmlFor="category" className="text-white font-medium">
                 Category *
               </Label>
               <Select
                 value={post.category}
                 onValueChange={(value: 'Student Story' | 'NGO Update') => 
                   handleInputChange('category', value)
                 }
               >
                 <SelectTrigger className="mt-2 bg-slate-800 border-slate-700 text-white">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="bg-slate-800 border-slate-700">
                   <SelectItem value="Student Story">Student Story</SelectItem>
                   <SelectItem value="NGO Update">NGO Update</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>

                     {/* Tags and Featured Image Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <Label htmlFor="tags" className="text-white font-medium">
                 Tags
               </Label>
               <Input
                 id="tags"
                 type="text"
                 value={post.tags}
                 onChange={(e) => handleInputChange('tags', e.target.value)}
                 placeholder="Education, Inspiration, Volunteering..."
                 className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-red-500"
               />
               <p className="text-xs text-gray-400 mt-1">
                 Separate tags with commas
               </p>
             </div>

             <div>
               <Label htmlFor="featuredImageUrl" className="text-white font-medium">
                 Featured Image URL
               </Label>
               <Input
                 id="featuredImageUrl"
                 type="url"
                 value={post.featuredImageUrl}
                 onChange={(e) => handleInputChange('featuredImageUrl', e.target.value)}
                 placeholder="https://example.com/image.jpg"
                 className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-red-500"
               />
             </div>
           </div>

                     {/* Content */}
           <div>
             <Label htmlFor="content" className="text-white font-medium">
               Content *
             </Label>
             <div className="mt-2">
               {ReactQuill ? (
                 <ReactQuill
                   theme="snow"
                   value={post.content}
                   onChange={(value) => handleInputChange('content', value)}
                   placeholder="Write your blog post content here..."
                   modules={{
                     toolbar: [
                       [{ 'header': [1, 2, 3, false] }],
                       ['bold', 'italic', 'underline', 'strike'],
                       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                       [{ 'color': [] }, { 'background': [] }],
                       ['link', 'image'],
                       ['clean']
                     ]
                   }}
                   className="bg-slate-800 border-slate-700 rounded-md"
                   style={{
                     backgroundColor: '#1e293b',
                     borderColor: '#475569',
                     color: '#f8fafc'
                   }}
                 />
               ) : (
                 <FallbackEditor
                   value={post.content}
                   onChange={(value) => handleInputChange('content', value)}
                   placeholder="Write your blog post content here... (Install react-quill for rich text editing)"
                 />
               )}
             </div>
           </div>

                     {/* Submit Button */}
           <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
             <Button
               type="button"
               variant="outline"
               onClick={() => navigate('/blog')}
               className="border-slate-700 text-white hover:bg-slate-700"
             >
               Cancel
             </Button>
             <Button
               type="submit"
               disabled={isSubmitting}
               className="bg-red-500 hover:bg-red-600 text-white"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Publishing...
                 </>
               ) : (
                 <>
                   <Save className="w-4 h-4 mr-2" />
                   Publish Post
                 </>
               )}
             </Button>
           </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreatePostPage; 
