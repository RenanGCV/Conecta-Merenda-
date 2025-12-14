'use client';

import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-display font-semibold text-verde-conecta mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-conecta">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full px-4 py-3 font-body text-base',
              'bg-white rounded-xl',
              'border-3 transition-all duration-200',
              error
                ? 'border-vermelho-tomate focus:border-vermelho-tomate'
                : 'border-verde-conecta focus:border-verde-brocolis',
              'focus:outline-none focus:ring-4 focus:ring-verde-brocolis/20',
              'placeholder:text-text-muted',
              icon && 'pl-12',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm font-body text-vermelho-tomate">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm font-body text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-display font-semibold text-verde-conecta mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'w-full px-4 py-3 font-body text-base',
            'bg-white rounded-xl',
            'border-3 transition-all duration-200',
            'resize-none',
            error
              ? 'border-vermelho-tomate focus:border-vermelho-tomate'
              : 'border-verde-conecta focus:border-verde-brocolis',
            'focus:outline-none focus:ring-4 focus:ring-verde-brocolis/20',
            'placeholder:text-text-muted',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm font-body text-vermelho-tomate">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-display font-semibold text-verde-conecta mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-4 py-3 font-body text-base',
            'bg-white rounded-xl',
            'border-3 transition-all duration-200',
            'cursor-pointer appearance-none',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230B4F35%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E")]',
            'bg-no-repeat bg-[right_12px_center] bg-[length:20px]',
            error
              ? 'border-vermelho-tomate focus:border-vermelho-tomate'
              : 'border-verde-conecta focus:border-verde-brocolis',
            'focus:outline-none focus:ring-4 focus:ring-verde-brocolis/20',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-sm font-body text-vermelho-tomate">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
