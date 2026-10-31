import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { SAMPLE_SUBSCRIPTIONS } from '../data/subscriptions';
import { SubscriptionCard } from './SubscriptionCard';

export const SubscriptionCarousel: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const rotationAngleRef = useRef(0);

  // Sync ref with state
  rotationAngleRef.current = rotationAngle;

  // Responsive dimensions tuned for clean 3D depth without collision
  const getDimensions = useCallback((width: number) => {
    if (width < 480) {
      return { cardWidth: 235, cardHeight: 345, radius: 285, perspective: 850 };
    }
    if (width < 768) {
      return { cardWidth: 255, cardHeight: 355, radius: 320, perspective: 950 };
    }
    if (width < 1024) {
      return { cardWidth: 275, cardHeight: 370, radius: 360, perspective: 1100 };
    }
    return { cardWidth: 295, cardHeight: 385, radius: 410, perspective: 1250 };
  }, []);

  const dimensions = getDimensions(viewportWidth);
  const isMobile = viewportWidth < 640;

  // Monitor screen resize
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  // Smooth continuous rotation loop (approx 42 seconds for full 360 deg: ~8.57 deg/sec)
  useEffect(() => {
    if (reducedMotion || isPaused || isHovered || isFocused) {
      lastTimeRef.current = null;
      return;
    }

    const degreesPerSecond = 360 / 42; // ~8.57 deg/s

    const step = (time: number) => {
      if (lastTimeRef.current !== null && !isDraggingRef.current) {
        const deltaSeconds = (time - lastTimeRef.current) / 1000;
        // Negative rotation so cards rotate from right to left smoothly
        const newAngle = (rotationAngleRef.current - degreesPerSecond * deltaSeconds) % 360;
        rotationAngleRef.current = newAngle;
        setRotationAngle(newAngle);
      }
      lastTimeRef.current = time;
      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [reducedMotion, isPaused, isHovered, isFocused]);

  // Determine current front-most card
  const totalCards = SAMPLE_SUBSCRIPTIONS.length; // 8
  const stepAngle = 360 / totalCards; // 45 deg

  // Current active index facing front: (cardAngle + rotationAngle) closest to 0 (mod 360)
  const normalizedRotation = ((-rotationAngle % 360) + 360) % 360;
  const activeIndex = Math.round(normalizedRotation / stepAngle) % totalCards;

  // Manual navigation handlers
  const rotateToCard = (index: number) => {
    const targetAngle = -index * stepAngle;
    rotationAngleRef.current = targetAngle;
    setRotationAngle(targetAngle);
  };

  const handlePrev = () => {
    const newAngle = rotationAngleRef.current + stepAngle;
    rotationAngleRef.current = newAngle;
    setRotationAngle(newAngle);
  };

  const handleNext = () => {
    const newAngle = rotationAngleRef.current - stepAngle;
    rotationAngleRef.current = newAngle;
    setRotationAngle(newAngle);
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Drag / Pointer Scrubbing Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startAngleRef.current = rotationAngleRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    // Smooth responsive scrubbing sensitivity
    const newAngle = startAngleRef.current + deltaX * 0.35;
    rotationAngleRef.current = newAngle;
    setRotationAngle(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    }
  };

  return (
    <section
      id="showcase"
      aria-label="Interactive 3D Subscription Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full max-w-6xl mx-auto flex flex-col items-center select-none pt-2 pb-8 overflow-x-hidden scroll-mt-24 focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Subtle radial depth lighting behind carousel */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[440px] bg-gradient-to-tr from-[#8B7CFF]/15 via-[#6355E6]/10 to-transparent rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Mode & Active Card Indicator Header */}
      <div className="flex items-center gap-2 mb-6 sm:mb-8 z-20 px-3.5 py-1.5 rounded-full bg-[#131620]/90 border border-white/[0.08] backdrop-blur-md text-xs text-[#999EAB] shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
        <span>Live 3D Subscription Gallery</span>
        <span className="text-white/20">•</span>
        <span className="text-[#F5F5F7] font-medium">
          {SAMPLE_SUBSCRIPTIONS[activeIndex].name} ({activeIndex + 1}/{totalCards})
        </span>
      </div>

      {/* 3D VIEWPORT CONTAINER */}
      <div
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          height: `${dimensions.cardHeight + 40}px`,
          perspective: `${dimensions.perspective}px`,
          perspectiveOrigin: '50% 50%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* 3D ROTATING CYLINDER STAGE (Offset in Z so front card stays at screen plane Z=0) */}
        <div
          className="relative preserve-3d"
          style={{
            width: `${dimensions.cardWidth}px`,
            height: `${dimensions.cardHeight}px`,
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${dimensions.radius}px) rotateY(${rotationAngle}deg)`,
            transition: isDraggingRef.current ? 'none' : 'transform 0.05s linear',
            willChange: 'transform',
          }}
        >
          {SAMPLE_SUBSCRIPTIONS.map((sub, idx) => {
            const cardAngle = idx * stepAngle;
            const isFront = idx === activeIndex;

            // Angle difference to viewer (0 is center front)
            const angleDiff = Math.abs(((((cardAngle + rotationAngle) % 360) + 540) % 360) - 180);

            // Dynamic opacity: center card is 1.0, flanks gracefully fade back
            let opacity = 1;
            if (angleDiff > 90) {
              opacity = 0; // Behind the camera plane
            } else if (angleDiff > 65) {
              opacity = isMobile ? 0.08 : 0.35;
            } else if (angleDiff > 25) {
              opacity = isMobile ? 0.35 : 0.75;
            }

            return (
              <div
                key={sub.id}
                className="absolute top-0 left-0 backface-hidden"
                style={{
                  width: `${dimensions.cardWidth}px`,
                  height: `${dimensions.cardHeight}px`,
                  transform: `rotateY(${cardAngle}deg) translateZ(${dimensions.radius}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  opacity,
                  transition: 'opacity 0.25s ease',
                  pointerEvents: isFront ? 'auto' : 'none',
                }}
              >
                <SubscriptionCard subscription={sub} isFront={isFront} />
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-lg px-4 z-20">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous subscription"
            className="p-2.5 rounded-xl bg-[#131620] border border-white/[0.08] text-[#999EAB] hover:text-[#F5F5F7] hover:border-white/20 hover:bg-[#191D29] focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none transition-all active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next subscription"
            className="p-2.5 rounded-xl bg-[#131620] border border-white/[0.08] text-[#999EAB] hover:text-[#F5F5F7] hover:border-white/20 hover:bg-[#191D29] focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none transition-all active:scale-95 shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subscription Dots Navigation */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131620]/80 border border-white/[0.08] backdrop-blur-sm"
          role="tablist"
          aria-label="Subscription gallery dots"
        >
          {SAMPLE_SUBSCRIPTIONS.map((sub, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={sub.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show ${sub.name}`}
                onClick={() => rotateToCard(idx)}
                className={`
                  transition-all duration-300 rounded-full
                  ${
                    isActive
                      ? 'w-5 sm:w-6 h-2 bg-[#8B7CFF] shadow-[0_0_10px_rgba(139,124,255,0.6)]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }
                  focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none
                `}
              />
            );
          })}
        </div>

        {/* Accessible Auto-rotation Pause/Resume Toggle */}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={
            isPaused ? 'Resume 3D carousel auto-rotation' : 'Pause 3D carousel auto-rotation'
          }
          aria-pressed={isPaused}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131620] border border-white/[0.08] text-xs font-medium text-[#999EAB] hover:text-[#F5F5F7] hover:border-white/20 hover:bg-[#191D29] focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:outline-none transition-all active:scale-95 shadow-md"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-[#8B7CFF]" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>

      {/* Tactile drag hint */}
      <p className="text-[11px] text-[#999EAB]/60 mt-4 tracking-wide font-mono text-center">
        DRAG OR USE ARROW KEYS TO EXPLORE • PAUSES ON HOVER
      </p>
    </section>
  );
};
