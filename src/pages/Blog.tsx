import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Tag, Share2, ArrowRight, Heart, Flag } from 'lucide-react';
import Markdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { Blog as BlogType } from '../types';

export const Blog = () => {
  const [blogs, setBlogs] = React.useState<BlogType[]>([]);

  React.useEffect(() => {
    fetch('/api/blogs').then(res => res.json()).then(setBlogs);
  }, []);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": blogs.map((blog, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "url": `https://ya.tssmeemevents.com/blog/${blog.id}`,
        "name": blog.title,
        "description": blog.excerpt,
        "image": blog.image,
        "datePublished": blog.date,
        "author": {
          "@type": "Person",
          "name": blog.author
        }
      }
    }))
  };

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Wedding & Event Insights | YA Wedding Dubai</title>
        <meta name="description" content="Expert advice, trends, and inspiration from Dubai's leading luxury event planners. Discover the latest in luxury weddings, stage decoration, and event planning." />
        <meta name="keywords" content="wedding blog, dubai wedding, event planning tips, luxury wedding trends, wedding stage decoration" />
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">Wedding & <span className="font-script text-gradient-brand text-6xl lowercase animate-float inline-block">Event</span> Insights</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Expert advice, trends, and inspiration from Dubai's leading luxury event planners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group glass-card rounded-3xl overflow-hidden flex flex-col hover:border-brand/30 transition-all"
            >
              <Link to={`/blog/${blog.id}`} className="block h-64 overflow-hidden relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="relative overflow-hidden bg-brand text-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-border-glow">
                    <div className="absolute inset-0 shimmer-effect opacity-30" />
                    <span className="relative z-10">{blog.category}</span>
                  </span>
                </div>
              </Link>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(blog.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-brand transition-colors">
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h3>
                <p className="text-gray-400 text-sm mb-6 flex-1">{blog.excerpt}</p>
                {blog.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-md border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-brand font-bold text-sm flex items-center gap-2 group/link"
                >
                  Read More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = React.useState<BlogType | null>(null);
  const [likes, setLikes] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        const found = data.find((b: BlogType) => b.id === id);
        setBlog(found);
        // Simulate random initial likes based on blog id
        if (found) {
          setLikes(Math.floor(Math.random() * 100) + 10);
        }
      });
  }, [id]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleReport = () => {
    alert('Thank you for your report. Our team will review this post.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!blog) return <div className="pt-40 text-center">Loading...</div>;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.image],
    "datePublished": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "YA Wedding",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ya.tssmeemevents.com/logo.png"
      }
    },
    "description": blog.excerpt
  };

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>{blog.title} | YA Wedding Dubai</title>
        <meta name="description" content={blog.excerpt} />
        {blog.tags && <meta name="keywords" content={blog.tags.join(', ')} />}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <Link to="/blog" className="text-brand flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <ArrowRight className="rotate-180" size={16} /> Back to Blog
            </Link>
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} /> {likes}
              </button>
              <button onClick={handleShare} className="text-gray-400 hover:text-brand flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors">
                <Share2 size={18} /> Share
              </button>
              <button onClick={handleReport} className="text-gray-400 hover:text-yellow-500 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors" title="Report this post">
                <Flag size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <span className="bg-brand text-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </span>
            <h1 className="text-5xl font-bold leading-tight">{blog.title}</h1>
            <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-8">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-brand" /> {new Date(blog.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><User size={18} className="text-brand" /> {blog.author}</span>
            </div>
          </div>

          <div className="rounded-[40px] overflow-hidden shadow-2xl">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg prose-invert prose-brand max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-12 prose-headings:mb-6 prose-p:leading-relaxed prose-p:text-gray-300 prose-p:mb-6 prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-xl prose-li:text-gray-300 prose-ul:mb-6">
            <div className="markdown-body">
              <Markdown>{blog.content}</Markdown>
            </div>
          </div>

          <div className="flex items-center justify-between pt-12 border-t border-white/10 mt-12">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={20} className={isLiked ? 'fill-current' : ''} /> {likes} Likes
              </button>
              <button onClick={handleShare} className="text-gray-400 hover:text-brand flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors">
                <Share2 size={20} /> Share
              </button>
            </div>
            <button onClick={handleReport} className="text-gray-400 hover:text-yellow-500 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors" title="Report this post">
              <Flag size={20} /> Report
            </button>
          </div>

          {blog.tags && (
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag size={18} className="text-brand" />
                {blog.tags.map(tag => (
                  <span key={tag} className="bg-white/5 text-gray-400 px-4 py-1 rounded-full text-xs font-bold border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
