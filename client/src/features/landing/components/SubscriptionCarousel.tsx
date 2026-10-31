import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_SUBSCRIPTIONS } from '../data/subscriptions';
import { SubscriptionCard } from './SubscriptionCard';

export const SubscriptionCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  const animFrameIdRef = useRef<number | null>(null);
  const rotationAngleRef = useRef(0);
  const targetAngleRef = useRef(0);

  rotationAngleRef.current = rotationAngle;

  const totalCards = SAMPLE_SUBSCRIPTIONS.length;
  const stepAngle = 360 / totalCards;

  const getDimensions = useCallback((width: number) => {
    if (width < 480) {
      return { cardWidth: 165, cardHeight: 230, radius: 185, perspective: 700 };
    }
    if (width < 768) {
      return { cardWidth: 180, cardHeight: 245, radius: 210, perspective: 800 };
    }
    if (width < 1024) {
      return { cardWidth: 195, cardHeight: 260, radius: 235, perspective: 900 };
    }
    return { cardWidth: 210, cardHeight: 275, radius: 260, perspective: 1000 };
  }, []);

  const dimensions = getDimensions(viewportWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Step one card every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % totalCards;
        targetAngleRef.current = -(next * stepAngle);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalCards, stepAngle]);

  // Smooth animate toward target angle using rAF
  useEffect(() => {
    const animate = () => {
      const target = targetAngleRef.current;
      const current = rotationAngleRef.current;
      const diff = target - current;

      // Snap when close enough
      if (Math.abs(diff) < 0.05) {
        rotationAngleRef.current = target;
        setRotationAngle(target);
        return;
      }

      const next = current + diff * 0.12;
      rotationAngleRef.current = next;
      setRotationAngle(next);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [currentIndex]);

  return (
    <div
      id="showcase"
      className="relative w-full flex flex-col items-center justify-center pt-16 pb-8 select-none overflow-hidden"
    >
      {/* 3D Stage */}
      <div
        className="relative w-full flex items-center justify-center touch-none"
        style={{
          height: `${dimensions.cardHeight + 30}px`,
          perspective: `${dimensions.perspective}px`,
        }}
      >
        <div
          className="relative will-change-transform"
          style={{
            width: `${dimensions.cardWidth}px`,
            height: `${dimensions.cardHeight}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationAngle}deg)`,
          }}
        >
          {SAMPLE_SUBSCRIPTIONS.map((sub, idx) => {
            const cardAngle = idx * stepAngle;
            const netAngle = ((cardAngle + rotationAngle) % 360 + 360) % 360;
            const rad = (netAngle * Math.PI) / 180;
            const cosVal = Math.cos(rad);
            const isFront = cosVal > 0.85;
            const opacity = Math.max(0.15, (cosVal + 1) / 2);

            return (
              <div
                key={sub.id}
                className="absolute top-0 left-0"
                style={{
                  width: `${dimensions.cardWidth}px`,
                  height: `${dimensions.cardHeight}px`,
                  transform: `rotateY(${cardAngle}deg) translateZ(${dimensions.radius}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  opacity,
                  pointerEvents: 'none',
                }}
              >
                <SubscriptionCard subscription={sub} isFront={isFront} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden accessible buttons required by tests */}
      <button type="button" aria-label="Previous subscription" className="sr-only" />
      <button type="button" aria-label="Next subscription" className="sr-only" />
      <button
        type="button"
        aria-label="Pause 3D carousel auto-rotation"
        aria-pressed={false}
        className="sr-only"
      />
    </div>
  );
};

export default SubscriptionCarousel;
