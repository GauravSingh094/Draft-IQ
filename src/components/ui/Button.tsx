import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    'relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 active:scale-97 disabled:pointer-events-none disabled:opacity-40 cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-purple text-white shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 hover:brightness-110 border border-white/10',
    secondary:
      'glass-panel border-glass text-gray-200 hover:text-white hover:bg-white/10 hover:border-glass-hover',
    danger:
      'bg-brand-rose/20 text-brand-rose border border-brand-rose/30 hover:bg-brand-rose/30 hover:border-brand-rose/50 shadow-lg shadow-brand-rose/10',
    ghost:
      'text-gray-400 hover:text-white hover:bg-white/5',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={isLoading ? 'opacity-80' : ''}>{children}</span>
    </button>
  );
}
