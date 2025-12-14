'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'action' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-display font-bold
    transition-all duration-200
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-verde-conecta text-white
      border-3 border-verde-conecta
      shadow-hard hover:shadow-hard-hover
      hover:-translate-x-0.5 hover:-translate-y-0.5
      active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
    `,
    secondary: `
      bg-white text-verde-conecta
      border-3 border-verde-conecta
      shadow-hard hover:shadow-hard-hover
      hover:bg-verde-brocolis
      hover:-translate-x-0.5 hover:-translate-y-0.5
    `,
    action: `
      bg-verde-brocolis text-verde-conecta
      border-3 border-verde-conecta
      shadow-hard hover:shadow-hard-hover
      hover:-translate-x-0.5 hover:-translate-y-0.5
    `,
    danger: `
      bg-vermelho-tomate text-white
      border-3 border-verde-conecta
      shadow-hard hover:shadow-hard-hover
      hover:-translate-x-0.5 hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent text-verde-conecta
      border-3 border-transparent
      hover:bg-verde-conecta/10
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-3 text-base rounded-full',
    lg: 'px-8 py-4 text-lg rounded-full',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}

export default Button;
