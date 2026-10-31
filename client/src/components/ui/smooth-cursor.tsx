import React, { useEffect, useRef, useState } from 'react';

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  restDelta?: number;
}

export interface SmoothCursorProps {
  cursor?: React.ReactNode;
  springConfig?: SpringConfig;
  className?: string;
}

const DefaultCursorSVG: React.FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_4px_12px_rgba(240,83,35,0.45)]"
  >
    <path
      d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
      fill="#F05323"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const SmoothCursor: React.FC<SmoothCursorProps> = ({
  cursor = <DefaultCursorSVG />,
  springConfig = {},
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);

  const {
    damping = 0.72,
    stiffness = 0.18,
  } = springConfig;

  useEffect(() => {
    // Only activate for non-touch / mouse-enabled devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable/interactive elements
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest('button, a, input, select, textarea, [role="button"], label');
      setIsPointer(isInteractive);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let rafId: number;

    const animate = () => {
      // Spring physics toward target position
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;

      velocityRef.current.x = (velocityRef.current.x + dx * stiffness) * damping;
      velocityRef.current.y = (velocityRef.current.y + dy * stiffness) * damping;

      posRef.current.x += velocityRef.current.x;
      posRef.current.y += velocityRef.current.y;

      // Directional rotation based on movement vector
      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
      if (speed > 1.2) {
        // Compute travel angle in degrees, aligned with pointer arrow direction
        const rawAngle = (Math.atan2(velocityRef.current.y, velocityRef.current.x) * 180) / Math.PI;
        targetAngleRef.current = rawAngle + 45; // 45deg offset matches default top-left arrow geometry
      }

      // Smooth angle interpolation
      let angleDiff = targetAngleRef.current - angleRef.current;
      while (angleDiff < -180) angleDiff += 360;
      while (angleDiff > 180) angleDiff -= 360;
      angleRef.current += angleDiff * 0.15;

      if (cursorRef.current) {
        const scale = isClicked ? 0.85 : isPointer ? 1.25 : 1;
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) rotate(${angleRef.current}deg) scale(${scale})`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [damping, stiffness, isVisible, isClicked, isPointer]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform -translate-x-1.5 -translate-y-1.5 transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {cursor}
    </div>
  );
};

export default SmoothCursor;

