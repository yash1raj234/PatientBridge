import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, active = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-[14px] py-[6px] rounded-full font-body text-[13px] border transition-colors',
          active
            ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white'
            : 'bg-[var(--bg-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:bg-[rgba(27,79,216,0.04)]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Chip.displayName = 'Chip';
export { Chip };
