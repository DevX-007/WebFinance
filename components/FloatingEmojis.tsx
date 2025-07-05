import React, { useEffect, useState } from 'react';

interface EmojiProps {
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}

const Emoji: React.FC<EmojiProps> = ({ emoji, delay, duration, size }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    // Generate random position
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    
    setPosition({ top, left });
  }, []);
  
  return (
    <div 
      className="absolute pointer-events-none select-none emoji-float"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        fontSize: `${size}px`,
        opacity: 0.2,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {emoji}
    </div>
  );
};

export default function FloatingEmojis() {
  const financialEmojis = [
    { emoji: '💰', size: 32 }, // money bag
    { emoji: '💵', size: 28 }, // dollar
    { emoji: '₹', size: 36 },  // rupee
    { emoji: '€', size: 34 },  // euro
    { emoji: '📈', size: 30 }, // stocks
    { emoji: '💎', size: 26 }, // diamond/investment
    { emoji: '🏦', size: 32 }, // bank
    { emoji: '💳', size: 28 }  // credit card
  ];

  return (
    <div className="fixed inset-0 overflow-hidden z-0 opacity-70">
      {financialEmojis.map((item, index) => (
        <React.Fragment key={index}>
          {/* Create multiple instances of each emoji with different animation delays */}
          <Emoji 
            emoji={item.emoji} 
            delay={Math.random() * 5} 
            duration={15 + Math.random() * 20}
            size={item.size}
          />
          <Emoji 
            emoji={item.emoji} 
            delay={Math.random() * 5} 
            duration={15 + Math.random() * 20}
            size={item.size}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
