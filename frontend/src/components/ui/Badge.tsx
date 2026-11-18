import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'teal' | 'amber' | 'blue' | 'indigo' | 'rose' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    neutral: 'bg-stone-100 text-ink-muted border-stone-200',
    teal: 'bg-teal-50 text-haor-800 border-teal-200/80',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    blue: 'bg-sky-50 text-sky-900 border-sky-200',
    indigo: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    warning: 'bg-orange-50 text-orange-800 border-orange-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-sans font-medium tracking-tight ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
