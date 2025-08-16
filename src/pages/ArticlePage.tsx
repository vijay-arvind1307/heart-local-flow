
import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Dummy data for demonstration
const DUMMY_ARTICLES = [
  {
    id: 1,
    title: "From Struggle to Success: Priya's Journey",
    author: "Priya Sharma",
    date: "2025-08-10",
    image: "/assets/hero-image.jpg",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, eu consectetur nisl nisi euismod nisi. Vivamus euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, eu consectetur nisl nisi euismod nisi.`,
  },
  {
    id: 101,
    title: "Clean Water Project Launched",
    author: "GreenEarth NGO",
    date: "2025-08-01",
    image: "/assets/hero-image.jpg",
    content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.`,
  },
];

const getArticleById = (id) => DUMMY_ARTICLES.find((a) => a.id === Number(id));

const socialLinks = [
  { name: "Twitter", icon: "M19.633 7.997c.013.176.013.353.013.53 0 5.39-4.104 11.61-11.61 11.61-2.307 0-4.453-.676-6.26-1.84.322.038.637.05.972.05 1.92 0 3.686-.638 5.096-1.713-1.793-.037-3.308-1.217-3.833-2.846.25.037.5.062.763.062.366 0 .73-.05 1.07-.142-1.87-.375-3.28-2.03-3.28-4.017v-.05c.55.305 1.18.488 1.85.513a4.07 4.07 0 0 1-1.81-3.39c0-.75.2-1.45.55-2.05a11.62 11.62 0 0 0 8.42 4.27c-.062-.3-.1-.613-.1-.925 0-2.26 1.83-4.09 4.09-4.09 1.18 0 2.25.5 3 1.3a8.13 8.13 0 0 0 2.59-.988 4.07 4.07 0 0 1-1.8 2.25 8.18 8.18 0 0 0 2.34-.637 8.77 8.77 0 0 1-2.04 2.12z", url: "https://twitter.com/share" },
  { name: "Facebook", icon: "M18 2h-3a6 6 0 0 0-6 6v3H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2.293a1 1 0 0 0 .707-1.707l-3-3A1 1 0 0 0 15 10h-2V8a2 2 0 0 1 2-2h3a1 1 0 0 0 0-2z", url: "https://facebook.com/sharer/sharer.php" },
  { name: "LinkedIn", icon: "M16 8a6 6 0 1 0-12 0 6 6 0 0 0 12 0zm-1.5 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM6.75 12.25h1.5v4.5h-1.5v-4.5zm.75-2.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2.25 2.25h1.5v4.5h-1.5v-4.5zm.75-2.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z", url: "https://linkedin.com/shareArticle" },
];

const ArticlePage: React.FC = () => {
  const { id } = useParams();
  const article = getArticleById(id);

  if (!article) {
    return <div className="text-center text-offWhite py-20">Article not found.</div>;
  }

  return (
    <div className="min-h-screen bg-darkNavy text-offWhite flex justify-center">
      {/* Sticky Social Bar */}
      <aside className="hidden lg:flex flex-col items-center sticky top-24 h-fit mr-8 z-10">
        <div className="space-y-4 bg-[#232b45] rounded-xl p-4 shadow-lg">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label={`Share on ${link.name}`}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-mildRed group-hover:scale-110 transition-transform">
                <path d={link.icon} fill="currentColor" />
              </svg>
            </a>
          ))}
        </div>
      </aside>

      {/* Article Content */}
      <main className="max-w-2xl w-full mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-offWhite">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 mb-6 text-offWhite/80 text-sm">
          <span>By {article.author}</span>
          <span className="w-1 h-1 bg-mildRed rounded-full inline-block"></span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
        </div>
        <motion.img
          src={article.image}
          alt={article.title}
          className="w-full h-72 object-cover object-center rounded-xl mb-8 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
        <article className="prose prose-invert max-w-none text-offWhite text-lg leading-relaxed">
          {article.content}
        </article>
      </main>
    </div>
  );
};

export default ArticlePage;