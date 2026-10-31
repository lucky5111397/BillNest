import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { LandingFooter } from './components/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-[#F5F5F7] flex flex-col selection:bg-orange-500/30 selection:text-white scroll-smooth relative">
      {/* 1. Floating Glassmorphism Navbar */}
      <LandingNavbar />

      {/* 2. Main Platform Showcase Sections */}
      <main className="flex-1 flex flex-col w-full overflow-x-hidden relative z-10">
        {/* Hero Section with Interactive 3D Showcase */}
        <HeroSection />


        {/* Transparent Pricing Plans */}
        <PricingSection />

        {/* Customer Trust & FinOps Testimonials */}
        <TestimonialsSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Final High-Impact Call to Action */}
        <CtaSection />
      </main>

      {/* Comprehensive Modern Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
