# Blog Feature Setup Guide

## Overview
This guide will help you set up the blog feature that allows admins to create and manage blog posts using Firestore.

## Prerequisites
- Firebase project with Firestore enabled
- React application with Firebase configuration

## Installation

### 1. Install Required Dependencies
```bash
npm install react-quill
```

### 2. Firebase Firestore Setup
Make sure your Firebase project has Firestore enabled and the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.email == 'admin@ripple.com' || 
         request.auth.token.email.matches('.*admin.*'));
    }
  }
}
```

## Features Implemented

### 1. Admin Create Post Page (`/admin/create-post`)
- **Protected Route**: Only accessible by admin users
- **Rich Text Editor**: Uses React Quill for content editing
- **Form Fields**:
  - Post Title (required)
  - Author (required)
  - Category (Student Story or NGO Update)
  - Tags (comma-separated)
  - Featured Image URL
  - Content (rich text editor)
- **Firestore Integration**: Saves posts to `posts` collection

### 2. Updated Blog Page (`/blog`)
- **Dynamic Loading**: Fetches posts from Firestore
- **Category Filtering**: Toggle between Student Stories and NGO Updates
- **Admin Controls**: "Create Post" button for admins
- **Loading States**: Shows loading spinner while fetching data
- **Empty States**: Helpful messages when no posts are found

### 3. Article Card Component
- **Responsive Design**: Works on all screen sizes
- **Hover Effects**: Smooth animations and transitions
- **Tag Display**: Shows post tags with styling

## Usage

### For Admins
1. Navigate to `/admin/create-post`
2. Fill in the required fields
3. Use the rich text editor for content
4. Click "Publish Post" to save to Firestore
5. Posts will appear on the main blog page

### For Users
1. Visit `/blog` to see all published posts
2. Use tabs to filter between Student Stories and NGO Updates
3. Click on any post card to view the full article

## Admin Access Control
Currently, admin access is granted to users with:
- Email: `admin@ripple.com`
- Email containing "admin" (e.g., `testadmin@example.com`)

You can modify this logic in:
- `src/pages/admin/CreatePostPage.tsx` (line 35)
- `src/pages/BlogPage.tsx` (line 25)

## Data Structure
Posts are stored in Firestore with the following structure:

```javascript
{
  title: string,
  author: string,
  category: "Student Story" | "NGO Update",
  tags: string[],
  featuredImageUrl: string,
  content: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  authorId: string,
  authorEmail: string,
  status: "published"
}
```

## Customization

### Styling
- All components use the existing dark theme
- Colors are defined in Tailwind CSS classes
- Rich text editor styling can be customized in the CreatePostPage component

### Categories
To add new categories:
1. Update the Select component in `CreatePostPage.tsx`
2. Update the filtering logic in `BlogPage.tsx`
3. Update the tabs array in `BlogPage.tsx`

### Rich Text Editor
The React Quill editor can be customized by modifying the `modules` prop in `CreatePostPage.tsx`.

## Troubleshooting

### React Quill Not Loading
If you see errors related to React Quill:
1. Make sure `react-quill` is installed: `npm install react-quill`
2. Check that the import statements are correct
3. Verify the CSS import: `import 'react-quill/dist/quill.snow.css'`

### Firestore Connection Issues
1. Verify Firebase configuration in `src/firebase.js`
2. Check Firestore security rules
3. Ensure the `posts` collection exists in your Firestore database

### Admin Access Issues
1. Check the admin email logic in both components
2. Verify user authentication is working
3. Check browser console for any errors

## Security Considerations
- Admin routes are protected by authentication
- Firestore security rules should be configured properly
- Input validation is implemented on the frontend
- Consider adding server-side validation for production use
