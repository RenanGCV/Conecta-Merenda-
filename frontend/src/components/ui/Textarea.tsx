import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block font-display font-semibold text-verde-conecta mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 font-body',
            'border-3 border-verde-conecta rounded-xl',
            'bg-creme-papel text-text-main',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-verde-brocolis focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-y min-h-[100px]',
            error && 'border-vermelho-tomate focus:ring-vermelho-tomate',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 font-body text-sm text-vermelho-tomate">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 font-body text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
