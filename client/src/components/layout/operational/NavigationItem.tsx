import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface NavigationItemProps {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  exact?: boolean;
  onClick?: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  title,
  href,
  icon: Icon,
  badge,
  exact = false,
  onClick,
}) => {
  return (
    <NavLink
      to={href}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center justify-between px-3 py-1.5 rounded text-xs font-sans transition-all group select-none',
          isActive
            ? 'bg-surface-variant text-text-primary font-semibold border-l-2 border-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
            : 'text-text-secondary hover:bg-surface-variant/70 hover:text-text-primary',
        )
      }
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-text-primary" />
        <span className="truncate">{title}</span>
      </div>
      {badge && (
        <span className="px-1.5 py-0.5 rounded bg-surface-bright text-text-secondary text-[10px] font-mono leading-none">
          {badge}
        </span>
      )}
    </NavLink>
  );
};
