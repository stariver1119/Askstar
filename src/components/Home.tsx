import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const constellationRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const createConstellation = () => {
      if (!constellationRef.current) return;
      const svg = constellationRef.current;
      const points: { x: number; y: number }[] = [];
      
      // Create random points for stars
      for (let i = 0; i < 50; i++) {
        points.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });
      }

      // Clear previous lines
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      // Create constellation lines
      points.forEach((point, i) => {
        if (i === points.length - 1) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', point.x.toString());
        line.setAttribute('y1', point.y.toString());
        line.setAttribute('x2', points[i + 1].x.toString());
        line.setAttribute('y2', points[i + 1].y.toString());
        svg.appendChild(line);
      });
    };

    createConstellation();
    const interval = setInterval(createConstellation, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-space-blue flex flex-col">
      {/* Background stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Constellation SVG */}
      <svg ref={constellationRef} className="constellation" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 bg-space-blue/50 backdrop-blur-sm">
        <div className="w-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-extralight text-white/90 typing-animation logo-text"
          >
            Askstar
          </motion.div>
        </div>
        <div className="flex gap-6">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">About Service</a>
          <a href="#" className="nav-link">Get Started</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-light mb-6 text-center tracking-wider max-w-3xl leading-relaxed text-white/90"
        >
          Your story from the stars
        </motion.h1>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 bg-star-gold/20 hover:bg-star-gold/30 rounded-full transition-colors duration-300 text-white/90 border border-star-gold/30 hover:border-star-gold/50 text-lg mb-4"
        >
          Ask the Stars
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-1 text-white/25 font-extralight text-xs tracking-widest">
        <p>© 2025 askstar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
