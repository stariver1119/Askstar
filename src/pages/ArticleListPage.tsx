import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarryBackground from '../components/common/StarryBackground';

interface Article {
  id: string;
  title: string;
  url: string;
  createdTime: string;
  lastEditedTime: string;
  tags?: string[];
  excerpt?: string;
}

const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // First try to load from static JSON
        const response = await fetch('/data/articles.json');
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || data);
        } else {
          // Fallback to dynamic API
          const apiResponse = await fetch('/api/getNewArticles');
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            setArticles(apiData.articles || []);
          } else {
            throw new Error('Failed to fetch articles');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
            <p className="text-red-400 mb-4 text-lg">오류가 발생했습니다: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-bold hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              다시 시도
            </button>
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
              ← 홈으로
            </button>
          </div>
          <div className="text-center text-white text-lg font-medium">
            아티클
          </div>
          <div className="w-32"></div>
        </nav>

        {/* Main content */}
        <motion.div 
          className="container mx-auto px-4 pt-24 pb-16 text-white max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-200">
              아티클 목록
            </h1>
            <p className="text-center text-white/60 text-lg">
              점성술과 관련된 다양한 이야기들을 만나보세요
            </p>
          </motion.div>
          
          {articles.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="text-center text-white/60 bg-white/5 rounded-lg p-12 backdrop-blur-sm"
            >
              <p className="text-lg">아직 작성된 아티클이 없습니다.</p>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    to={`/article/${article.url}`}
                    className="block bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-white/10 hover:border-purple-500/30 group"
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-white/70 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                      <span>작성일: {new Date(article.createdTime).toLocaleDateString('ko-KR')}</span>
                      
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-2">
                          {article.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-white/60 text-sm">
          2024 Askstar. 별들이 들려주는 이야기.
        </footer>
      </div>
    </StarryBackground>
  );
};

export default ArticleListPage;
