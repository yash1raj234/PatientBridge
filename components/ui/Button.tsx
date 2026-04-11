import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-body rounded-full transition-all duration-250 cursor-hover';
    
    const variants = {
      primary: 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-indigo)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-blue)] disabled:bg-[var(--border)] disabled:text-[var(--text-muted)] disabled:hover:translate-y-0 disabled:hover:shadow-none',
      secondary: 'bg-transparent border-[1.5px] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--accent-blue)]',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[13px] font-medium',
      md: 'px-6 py-3 text-[14px] font-semibold',
      lg: 'px-8 py-4 text-[16px] font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'cursor-not-allowed opacity-80',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {!loading && leftIcon && <span className="mr-2 shrink-0 flex items-center">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2 shrink-0 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
