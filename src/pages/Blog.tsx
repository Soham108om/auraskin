import React, { useState } from 'react';
import { blogPosts } from '../data/blog';
import { BlogPost } from '../types';
import { trackEvent } from '../utils/analytics';
import { BookOpen, X, ArrowLeft } from 'lucide-react';

export const Blog: React.FC = () => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const handleReadPost = (post: BlogPost) => {
    setActivePost(post);
    trackEvent({
      name: 'cta_click',
      params: { cta_label: `Read Blog - ${post.title}`, section_name: 'Blog List' },
    });
  };

  const handleClosePost = () => {
    setActivePost(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      {activePost ? (
        /* Blog Detail View */
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <button 
            onClick={handleClosePost}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#222222]/60 hover:text-[#222222] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Journal</span>
          </button>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans">{activePost.category}</span>
            <h1 className="text-3xl md:text-5xl font-serif text-[#222222] leading-tight font-light">{activePost.title}</h1>
            <div className="flex items-center space-x-3 text-xs text-[#222222]/55 font-sans">
              <span>By {activePost.author}</span>
              <span>•</span>
              <span>{activePost.date}</span>
              <span>•</span>
              <span>{activePost.readTime}</span>
            </div>
          </div>

          <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100">
            <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
          </div>

          {/* Render markdown style spacing */}
          <div className="text-sm md:text-base text-[#222222]/85 leading-relaxed font-sans font-light space-y-6 whitespace-pre-line pt-4">
            {activePost.content}
          </div>
        </div>
      ) : (
        /* Blog List View */
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Scientific Journal</span>
            <h1 className="text-4xl font-serif text-[#222222]">The Aura Journal</h1>
            <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
              Delve into research notes, ingredient chemistry spotlights, and balanced lifestyle routine philosophies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-[#FAF9F6] border border-[#E8DEC9]/20 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 space-y-4">
                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-sans font-bold">{post.category}</span>
                    <h3 className="text-lg font-serif text-[#222222] font-semibold line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-[#222222]/70 leading-relaxed line-clamp-3 font-sans font-light">{post.summary}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#E8DEC9]/10 mt-auto flex items-center justify-between">
                  <span className="text-[10px] text-[#222222]/40 font-sans">{post.readTime}</span>
                  <button
                    onClick={() => handleReadPost(post)}
                    className="inline-flex items-center space-x-1 text-xs uppercase tracking-wider font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors"
                  >
                    <span>Read Article</span>
                    <BookOpen size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
