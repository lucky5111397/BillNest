import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X, Send } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Pages',
    links: [
      { label: 'All Products', href: '/#features' },
      { label: 'Studio', href: '/#preview' },
      { label: 'Clients', href: '/#showcase' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Socials',
    links: [
      { label: 'Facebook', href: 'https://facebook.com', isExternal: true },
      { label: 'Instagram', href: 'https://instagram.com', isExternal: true },
      { label: 'Twitter', href: 'https://twitter.com', isExternal: true },
      { label: 'LinkedIn', href: 'https://linkedin.com', isExternal: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
  {
    title: 'Register',
    links: [
      { label: 'Sign Up', href: '/dashboard' },
      { label: 'Login', href: '/dashboard' },
      { label: 'Forgot Password', href: '/dashboard' },
    ],
  },
];

export const LandingFooter: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ fromUser: boolean; text: string }>>([
    { fromUser: false, text: 'Hi there! Have questions about Billit billing or custom setup?' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage.trim();
    setMessages((prev) => [...prev, { fromUser: true, text: userText }]);
    setChatMessage('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          fromUser: false,
          text: 'Thanks for reaching out! A product specialist will connect shortly. You can also explore our interactive workspace demo!',
        },
      ]);
    }, 800);
  };

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden select-none border-t border-white/[0.04]">
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 relative z-10">
        {/* Left: Brand Identity & Copyright */}
        <div className="space-y-4 max-w-sm">
          <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center text-black shadow-md group-hover:scale-105 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-black"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 3C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H11C12.1046 21 13 20.1046 13 19V14H16C18.7614 14 21 11.7614 21 9C21 5.68629 18.3137 3 15 3H7ZM8 8C8 6.89543 8.89543 6 10 6H14C15.6569 6 17 7.34315 17 9C17 10.6569 15.6569 12 14 12H8V8Z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-zinc-200 transition-colors">
              Billit Studio
            </span>
          </Link>

          <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed pt-1">
            © copyright Billit 2026. All rights reserved.
          </p>
        </div>

        {/* Right: 4 Column Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 md:gap-14 lg:gap-16">
          {FOOTER_COLUMNS.map((column, colIdx) => (
            <div key={colIdx} className="space-y-4">
              <h4 className="font-semibold text-sm sm:text-base text-white tracking-normal">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link, linkIdx) => {
                  const isAnchor = link.href.startsWith('#');
                  const isExternal = link.isExternal || link.href.startsWith('http');

                  if (isAnchor) {
                    return (
                      <li key={linkIdx}>
                        <a
                          href={link.href}
                          className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors block py-0.5"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }

                  if (isExternal) {
                    return (
                      <li key={linkIdx}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors block py-0.5"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={linkIdx}>
                      <Link
                        to={link.href}
                        className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors block py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Giant Typographic Brand Watermark at Bottom */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none flex items-center justify-center -mb-2 sm:-mb-4 md:-mb-8 lg:-mb-10"
        aria-hidden="true"
      >
        <span className="text-[13vw] sm:text-[15vw] md:text-[16.5vw] lg:text-[17.5vw] font-black tracking-tighter text-[#161616] leading-none whitespace-nowrap text-center block">
          BILLIT
        </span>
      </div>

      {/* Interactive Support Chat Modal Popover */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 sm:right-6 z-50 w-[310px] sm:w-[350px] p-4 rounded-2xl bg-zinc-950/95 border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-left space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">Billit Live Concierge</span>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl ${
                  msg.fromUser
                    ? 'bg-[#F05323] text-white ml-auto max-w-[85%]'
                    : 'bg-white/[0.06] text-zinc-300 border border-white/10 max-w-[90%]'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#F05323] hover:bg-[#E0481A] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action / Chat Button */}
      <button
        type="button"
        aria-label="Open support chat"
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {chatOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5 fill-current" />}
      </button>
    </footer>
  );
};

export default LandingFooter;

