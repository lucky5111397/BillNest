import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#08090D] text-[#F5F5F7] flex flex-col selection:bg-[#8B7CFF]/30 selection:text-white">
      {/* Minimal Navigation Header */}
      <LandingNavbar />

      {/* Main Hero Section with 3D Showcase */}
      <main className="flex-1 flex flex-col justify-center w-full overflow-x-hidden">
        <HeroSection />
      </main>
    </div>
  );
};

export default LandingPage;
