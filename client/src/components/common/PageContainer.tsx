import React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  fullWidth = false,
}) => {
  return (
    <div
      className={cn(
        'w-full mx-auto space-y-6',
        fullWidth ? 'max-w-none' : 'max-w-[1600px]',
        className,
      )}
    >
      {children}
    </div>
  );
};
