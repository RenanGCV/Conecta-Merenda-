'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'success' | 'warning' | 'danger';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className,
  ...props
}: CardProps) {
  const baseStyles = `
    rounded-[24px]
    border-3 border-verde-conecta
    transition-all duration-200
  `;

  const variants = {
    default: 'bg-white shadow-hard',
    elevated: 'bg-white shadow-hard-hover',
    flat: 'bg-white shadow-none',
    success: 'bg-verde-brocolis/20',
    warning: 'bg-laranja-cenoura/20',
    danger: 'bg-vermelho-tomate/20',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-hover cursor-pointer'
    : '';

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Subcomponentes do Card
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardHeaderProps) {
  return (
    <h3 className={clsx('font-display font-bold text-xl text-verde-conecta', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardHeaderProps) {
  return (
    <p className={clsx('font-body text-sm text-text-muted mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={clsx('mt-4 pt-4 border-t-2 border-border-light', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
