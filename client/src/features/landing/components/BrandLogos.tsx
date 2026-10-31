import React from 'react';

interface BrandIconProps {
  id: string;
  className?: string;
}

/**
 * Authentic vector brand logos for subscription cards
 */
export const BrandIcon: React.FC<BrandIconProps> = ({ id, className = 'w-7 h-7' }) => {
  switch (id) {
    case 'netflix':
      return (
        <svg
          viewBox="0 0 24 32"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Netflix logo"
        >
          {/* Left vertical bar with depth */}
          <path d="M0 0H7V32H0V0Z" fill="#B81D24" />
          {/* Right vertical bar */}
          <path d="M17 0H24V32H17V0Z" fill="#B81D24" />
          {/* Diagonal ribbon bar */}
          <path d="M0 0H7L24 32H17L0 0Z" fill="#E50914" />
        </svg>
      );

    case 'amazon-prime':
      return (
        <svg
          viewBox="0 0 44 28"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Amazon Prime logo"
        >
          {/* prime text */}
          <text
            x="2"
            y="14"
            fill="#FFFFFF"
            fontSize="13"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            prime
          </text>
          {/* Iconic Prime smile arrow */}
          <path
            d="M4 19.5C13 25 27 25 36 17"
            stroke="#FF9900"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M33.5 15.5L37.5 17L35 21"
            fill="#FF9900"
            stroke="#FF9900"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'spotify':
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Spotify logo"
        >
          <circle cx="12" cy="12" r="11" fill="#1DB954" />
          {/* 3 curved soundwaves */}
          <path
            d="M5.8 8.8C10.2 7.5 15.8 7.7 18.5 9.3"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M6.8 12C10.5 10.9 15.2 11.2 17.5 12.6"
            stroke="#121212"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M7.7 15C10.6 14.1 14.3 14.4 16.2 15.6"
            stroke="#121212"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'youtube-premium':
      return (
        <svg
          viewBox="0 0 32 24"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="YouTube logo"
        >
          {/* Red YouTube screen container */}
          <path
            d="M30.5 5.5C30.2 4.2 29.1 3.2 27.8 2.8C25.4 2.2 16 2.2 16 2.2C16 2.2 6.6 2.2 4.2 2.8C2.9 3.2 1.8 4.2 1.5 5.5C0.8 8 0.6 12 0.6 12C0.6 12 0.8 16 1.5 18.5C1.8 19.8 2.9 20.8 4.2 21.2C6.6 21.8 16 21.8 16 21.8C16 21.8 25.4 21.8 27.8 21.2C29.1 20.8 30.2 19.8 30.5 18.5C31.2 16 31.4 12 31.4 12C31.4 12 31.2 8 30.5 5.5Z"
            fill="#FF0000"
          />
          {/* White play triangle */}
          <path d="M12.8 16.5L21 12L12.8 7.5V16.5Z" fill="#FFFFFF" />
        </svg>
      );

    case 'disney-plus':
      return (
        <svg
          viewBox="0 0 38 24"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Disney+ logo"
        >
          {/* Curved swoosh arch */}
          <path
            d="M3 18.5C10 6 23 4 34.5 8.5"
            stroke="#00D6FF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Sparkle star */}
          <path
            d="M34.5 8.5L35.5 5.5L36.5 8.5L39.5 9.5L36.5 10.5L35.5 13.5L34.5 10.5L31.5 9.5L34.5 8.5Z"
            fill="#FFFFFF"
          />
          {/* Disney+ text */}
          <text
            x="3"
            y="17"
            fill="#FFFFFF"
            fontSize="13"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            Disney+
          </text>
        </svg>
      );

    case 'microsoft-365':
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Microsoft logo"
        >
          {/* Official 4-color Microsoft squares */}
          <rect x="2" y="2" width="9.2" height="9.2" fill="#F25022" rx="1" />
          <rect x="12.8" y="2" width="9.2" height="9.2" fill="#7FBA00" rx="1" />
          <rect x="2" y="12.8" width="9.2" height="9.2" fill="#00A4EF" rx="1" />
          <rect x="12.8" y="12.8" width="9.2" height="9.2" fill="#FFB900" rx="1" />
        </svg>
      );

    case 'adobe-cc':
      return (
        <svg
          viewBox="0 0 26 26"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Adobe logo"
        >
          {/* Red Adobe container */}
          <rect width="26" height="26" rx="6" fill="#DA1F26" />
          {/* Official Adobe 'A' silhouette */}
          <path d="M16 4.5H21.5V21.5L16 4.5Z" fill="#FFFFFF" />
          <path d="M10 4.5H4.5V21.5L10 4.5Z" fill="#FFFFFF" />
          <path d="M13 12.2L16.2 19.8H13.6L12.4 16.6H10.4L13 12.2Z" fill="#FFFFFF" />
        </svg>
      );

    case 'google-one':
      return (
        <svg
          viewBox="0 0 26 26"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Google One logo"
        >
          {/* Google 4-color ring */}
          <path
            d="M13 3C7.5 3 3 7.5 3 13C3 14.8 3.5 16.4 4.4 17.8L7.4 15.6C6.8 14.8 6.5 13.9 6.5 13C6.5 9.4 9.4 6.5 13 6.5C14.8 6.5 16.4 7.2 17.6 8.4L20.2 5.8C18.3 4.1 15.8 3 13 3Z"
            fill="#EA4335"
          />
          <path
            d="M23 13C23 11.2 22.5 9.6 21.6 8.2L18.6 10.4C19.2 11.2 19.5 12.1 19.5 13C19.5 16.6 16.6 19.5 13 19.5C11.2 19.5 9.6 18.8 8.4 17.6L5.8 20.2C7.7 21.9 10.2 23 13 23C18.5 23 23 18.5 23 13Z"
            fill="#34A853"
          />
          <path
            d="M3 13C3 15.4 3.9 17.6 5.4 19.4L8.4 16.8C7.7 15.7 7.3 14.4 7.3 13C7.3 11.6 7.7 10.3 8.4 9.2L5.4 6.6C3.9 8.4 3 10.6 3 13Z"
            fill="#FBBC05"
          />
          <path
            d="M23 13C23 10.6 22.1 8.4 20.6 6.6L17.6 9.2C18.3 10.3 18.7 11.6 18.7 13C18.7 14.4 18.3 15.7 17.6 16.8L20.6 19.4C22.1 17.6 23 15.4 23 13Z"
            fill="#4285F4"
          />
          {/* Centered Google 1 numeral */}
          <path
            d="M12 9.5L14 8.2V17H12V9.5Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    default:
      return null;
  }
};

