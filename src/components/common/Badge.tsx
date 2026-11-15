import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'sale' | 'gold' | 'outline' | 'violet';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-violet-100 text-violet-800 border-violet-200',
    secondary: 'bg-pink-100 text-pink-800 border-pink-200',
    accent: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    sale: 'bg-rose-100 text-rose-800 border-rose-200',
    gold: 'bg-amber-100 text-amber-800 border-amber-200',
    violet: 'bg-purple-100 text-purple-800 border-purple-200',
    outline: 'bg-white text-slate-800 border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase border shadow-xs ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
