import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'teal' | 'amber' | 'red' | 'slate';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'blue', children, ...props }, ref) => {
    const variants = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      teal: 'bg-[rgba(13,148,136,0.1)] text-[var(--accent-teal)] border-[rgba(13,148,136,0.2)]',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      slate: 'bg-slate-50 text-slate-500 border-slate-200',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
export { Badge };
