'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-verde-conecta/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={clsx(
          'relative w-full bg-white rounded-[24px]',
          'border-3 border-verde-conecta shadow-hard-hover',
          'max-h-[90vh] flex flex-col',
          'animate-in fade-in zoom-in-95 duration-200',
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b-3 border-verde-conecta">
            <h2 className="font-display font-bold text-2xl text-verde-conecta">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-verde-conecta/10 transition-colors"
            >
              <X className="w-6 h-6 text-verde-conecta" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={clsx('flex-1 overflow-y-auto p-6', !title && 'pt-8')}>
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-verde-conecta/10 transition-colors"
            >
              <X className="w-6 h-6 text-verde-conecta" />
            </button>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t-3 border-verde-conecta bg-creme-papel rounded-b-[21px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Modal de confirmação
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false,
}: ConfirmModalProps) {
  const iconColors = {
    danger: 'text-vermelho-tomate',
    warning: 'text-laranja-cenoura',
    success: 'text-verde-brocolis',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="text-center">
        <div
          className={clsx(
            'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
            variant === 'danger' && 'bg-vermelho-tomate/20',
            variant === 'warning' && 'bg-laranja-cenoura/20',
            variant === 'success' && 'bg-verde-brocolis/20'
          )}
        >
          <span className={clsx('text-3xl', iconColors[variant])}>
            {variant === 'danger' ? '⚠️' : variant === 'warning' ? '❓' : '✅'}
          </span>
        </div>
        <h3 className="font-display font-bold text-xl text-verde-conecta mb-2">
          {title}
        </h3>
        <p className="font-body text-text-muted">{message}</p>
      </div>
    </Modal>
  );
}

export default Modal;
