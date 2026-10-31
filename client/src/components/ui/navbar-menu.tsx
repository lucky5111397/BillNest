import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({ setActive, children, className = '' }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={`relative flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-inner ${className}`}
    >
      {children}
    </nav>
  );
};

interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ setActive, active, item, children, href }) => {
  const isOpen = active === item;

  const content = (
    <>
      <span>{item}</span>
      {children && (
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 text-zinc-400 ${
            isOpen ? 'rotate-180 text-orange-400' : ''
          }`}
        />
      )}
    </>
  );

  return (
    <div onMouseEnter={() => setActive(item)} className="relative flex items-center">
      {href ? (
        href.startsWith('/') ? (
          <Link
            to={href}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
          >
            {content}
          </Link>
        ) : (
          <a
            href={href}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
          >
            {content}
          </a>
        )
      ) : (
        <button
          type="button"
          onClick={() => setActive(isOpen ? '' : item)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
        >
          {content}
        </button>
      )}

      {children && (
        <div
          className={`absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 transition-all duration-200 z-50 ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto visible'
              : 'opacity-0 translate-y-2 pointer-events-none invisible'
          }`}
        >
          <div className="w-[280px] sm:w-[340px] md:w-[400px] p-4 rounded-md bg-black/75 backdrop-blur-3xl border border-white/[0.14] shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)]">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface HoveredLinkProps {
  children: React.ReactNode;
  href: string;
  description?: string;
  icon?: React.ElementType;
  className?: string;
  onClick?: () => void;
}

export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  href,
  description,
  icon: Icon,
  className = '',
  onClick,
}) => {
  const isExternal = href.startsWith('http');
  const isAnchor = href.startsWith('#');

  const content = (
    <div
      className={`group flex items-start gap-3 p-2.5 rounded-md hover:bg-white/[0.08] transition-colors ${className}`}
    >
      {Icon && (
        <div className="w-8 h-8 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/10 transition-colors shrink-0 mt-0.5">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="space-y-0.5 text-left">
        <div className="text-xs sm:text-sm font-semibold text-[#F5F5F7] group-hover:text-white transition-colors flex items-center gap-1">
          {children}
        </div>
        {description && (
          <p className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (isAnchor) {
    return (
      <a href={href} onClick={onClick} className="block focus-visible:outline-none">
        {content}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="block focus-visible:outline-none"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} onClick={onClick} className="block focus-visible:outline-none">
      {content}
    </Link>
  );
};

interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  badge?: string;
  price?: string;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  badge,
  price,
}) => {
  return (
    <Link
      to={href}
      className="group block p-3 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all text-left"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-[#F5F5F7] group-hover:text-white">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] text-[#999EAB] mt-1 leading-snug">{description}</p>
      {price && <div className="text-xs font-mono font-bold text-zinc-300 mt-2">{price}</div>}
    </Link>
  );
};
