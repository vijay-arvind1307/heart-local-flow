
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  id: number;
  title: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, author, category, tags, image }) => {
  return (
    <Link to={`/article/${id}`} className="block group">
      <motion.div
        className="bg-lightDarkBlue rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer border border-[#232b45]"
        whileHover={{ scale: 1.04, boxShadow: "0 0 16px 2px #ff4d5a55" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover object-center group-hover:opacity-90 transition duration-200"
        />
        <div className="p-5">
          <span className="text-xs font-bold uppercase text-mildRed tracking-wider">
            {category}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-offWhite group-hover:text-mildRed transition-colors">
            {title}
          </h3>
          <div className="mt-1 text-sm text-[#b0b8d1]">By {author}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#232b45] text-xs text-mildRed px-2 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ArticleCard;