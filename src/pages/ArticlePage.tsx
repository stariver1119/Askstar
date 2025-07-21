import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarryBackground from '../components/common/StarryBackground';

const ArticlePage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setError('아티클 URL이 제공되지 않았습니다.');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        // First try to load from static HTML
        const staticResponse = await fetch(`/articles/${url}.html`);
        if (staticResponse.ok) {
          const htmlContent = await staticResponse.text();
          setContent(htmlContent);
          
          // Extract title from HTML content
          const titleMatch = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/);
          if (titleMatch) {
            setTitle(titleMatch[1]);
          }
        } else {
          // Fallback to dynamic API
          const apiResponse = await fetch(`/api/getArticleContent?url=${encodeURIComponent(url)}`);
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            if (apiData.content) {
              setContent(apiData.content);
              setTitle(apiData.title || 'Article');
            } else {
              throw new Error('아티클 내용을 찾을 수 없습니다.');
            }
          } else {
            throw new Error('아티클을 불러올 수 없습니다.');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [url]);

  const handleBackClick = () => {
    navigate('/article');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <StarryBackground scrollable={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-lg">아티클을 불러오는 중...</p>
          </div>
        </div>
      </StarryBackground>
    );
  }

  if (error) {
    return (
      <StarryBackground scrollable={true}>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white bg-white/5 rounded-lg p-8 backdrop-blur-sm"
          >
            <p className="text-red-400 mb-6 text-lg">오류가 발생했습니다: {error}</p>
            <div className="space-x-4">
              <button 
                onClick={handleBackClick}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-bold hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                아티클 목록으로
              </button>
              <button 
                onClick={handleHomeClick}
                className="px-6 py-3 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                홈으로
              </button>
            </div>
          </motion.div>
        </div>
      </StarryBackground>
    );
  }

  return (
    <StarryBackground scrollable={true}>
      <div className="flex flex-col min-h-screen w-full overflow-auto">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 bg-black/20 backdrop-blur-sm">
          <div className="w-32">
            <button 
              onClick={handleBackClick}
              className="text-white hover:text-purple-300 transition-colors"
            >
              ← 목록으로
            </button>
          </div>
          <div className="text-center text-white text-lg font-medium truncate px-4">
            {title || '아티클'}
          </div>
          <div className="w-32 flex justify-end">
            <button 
              onClick={handleHomeClick}
              className="text-white hover:text-purple-300 transition-colors text-sm"
            >
              홈으로
            </button>
          </div>
        </nav>

        {/* Main content */}
        <motion.div 
          className="container mx-auto px-4 pt-24 pb-16 text-white max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="p-8"
          >
            <div 
              className="text-white prose-style-override"
              style={{
                color: 'rgb(255 255 255 / 0.9)',
                lineHeight: '1.7',
                background: 'transparent'
              }}
              dangerouslySetInnerHTML={{ 
                __html: content.replace(
                  /<h1([^>]*)>/g, 
                  '<h1$1 style="color: rgb(196 181 253); font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem; margin-top: 0;">'
                ).replace(
                  /<h2([^>]*)>/g, 
                  '<h2$1 style="color: rgb(196 181 253); font-size: 1.75rem; font-weight: bold; margin-bottom: 1.25rem; margin-top: 2rem;">'
                ).replace(
                  /<h3([^>]*)>/g, 
                  '<h3$1 style="color: rgb(167 139 250); font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; margin-top: 1.5rem;">'
                ).replace(
                  /<p([^>]*)>/g, 
                  '<p$1 style="color: rgb(255 255 255 / 0.8); margin-bottom: 1rem; font-size: 1.1rem;">'
                ).replace(
                  /<strong([^>]*)>/g, 
                  '<strong$1 style="color: rgb(255 255 255 / 0.95); font-weight: 600;">'
                ).replace(
                  /<em([^>]*)>/g, 
                  '<em$1 style="color: rgb(255 255 255 / 0.85);">'
                ).replace(
                  /<ul([^>]*)>/g, 
                  '<ul$1 style="color: rgb(255 255 255 / 0.8); margin-bottom: 1rem;">'
                ).replace(
                  /<ol([^>]*)>/g, 
                  '<ol$1 style="color: rgb(255 255 255 / 0.8); margin-bottom: 1rem;">'
                ).replace(
                  /<li([^>]*)>/g, 
                  '<li$1 style="color: rgb(255 255 255 / 0.8); margin-bottom: 0.5rem;">'
                ).replace(
                  /<a([^>]*)>/g, 
                  '<a$1 style="color: rgb(167 139 250); text-decoration: underline;">'
                ).replace(
                  /<blockquote([^>]*)>/g, 
                  '<blockquote$1 style="color: rgb(255 255 255 / 0.8); border-left: 4px solid rgb(167 139 250); padding-left: 1rem; margin: 1.5rem 0; font-style: italic;">'
                )
              }}
            />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-white/60 text-sm">
          © 2025 askstar. All rights reserved.
        </footer>
      </div>
    </StarryBackground>
  );
};

export default ArticlePage;
