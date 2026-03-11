import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselStyle = 'slider' | 'infinity' | 'trigger';

interface CarouselItem {
  id: string;
  url: string;
  size?: 'auto' | string;
  content?: React.ReactNode;
}

interface CarouselProps {
  style?: CarouselStyle;
  items: CarouselItem[];
  iconPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center';
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  style = 'slider',
  items = [],
  iconPosition = 'bottom-center',
  className = '',
  autoPlay = true,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  React.useEffect(() => {
    if (autoPlay && style === 'slider') {
      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, style, interval]);

  const renderSlider = () => (
    <div className="relative overflow-hidden rounded-3xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full min-h-[400px] flex items-center justify-center bg-white/5"
        >
          {items[currentIndex]?.content || (
            <img 
              src={items[currentIndex]?.url} 
              alt={`Slide ${currentIndex}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className={`absolute flex gap-2 p-4 z-10 ${
        iconPosition === 'bottom-left' ? 'bottom-4 left-4' :
        iconPosition === 'bottom-right' ? 'bottom-4 right-4' :
        iconPosition === 'bottom-center' ? 'bottom-4 left-1/2 -translate-x-1/2' :
        iconPosition === 'top-left' ? 'top-4 left-4' :
        iconPosition === 'top-right' ? 'top-4 right-4' :
        'top-4 left-1/2 -translate-x-1/2'
      }`}>
        <button onClick={prev} className="p-2 bg-dark/50 backdrop-blur-md rounded-full hover:bg-brand hover:text-dark transition-all">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="p-2 bg-dark/50 backdrop-blur-md rounded-full hover:bg-brand hover:text-dark transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderInfinity = () => (
    <div className="relative overflow-hidden whitespace-nowrap py-8">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 items-center"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div key={`${item.id}-${i}`} className="shrink-0">
            {item.content || (
              <img 
                src={item.url} 
                alt={`Item ${i}`} 
                className="h-12 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {style === 'slider' && renderSlider()}
      {style === 'infinity' && renderInfinity()}
      {style === 'trigger' && renderSlider()} {/* Trigger is similar to slider but with custom icons */}
    </div>
  );
};
