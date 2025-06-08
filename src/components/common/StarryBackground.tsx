import { useEffect, useRef } from 'react';

interface StarryBackgroundProps {
  children: React.ReactNode;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ children }) => {
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
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
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

      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>

      {/* Constellation SVG */}
      <svg ref={constellationRef} className="constellation" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default StarryBackground;
