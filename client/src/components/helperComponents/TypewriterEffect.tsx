import React, { useEffect, useState } from 'react';

interface TypewriterEffectProps {
  text: string;
  period?: number; // time in milliseconds for each character, and pause period after typing or deleting
}

/** TypewriterEffect: creates the 'typewriter' effect in the landing page */
const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, period = 2000 }) => {
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const typingDelay = 250 - Math.random() * 100;
    const endDelay = period; 

    let timer: NodeJS.Timer;

    if (isTyping) {
      if (index < text.length) {
        timer = setTimeout(() => {
          setTypedText(text.slice(0, index + 1));
          setIndex(index + 1);
        }, typingDelay);
      } else {
        timer = setTimeout(() => setIsTyping(false), endDelay);
      }
    } else {
      if (index > 0) {
        timer = setTimeout(() => {
          setTypedText(text.slice(0, index - 1));
          setIndex(index - 1);
        }, typingDelay / 3);
      } else {
        timer = setTimeout(() => setIsTyping(true), endDelay / 3);
      }
    }

    return () => clearTimeout(timer);
  }, [index, isTyping, text, period]);

  return <span className="wrap">
            {typedText || '\u200B'}
            <span className="cursor-blinking">|</span>
        </span>;
};

export default TypewriterEffect;

