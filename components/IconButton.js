"use client";
import React from 'react';

export default function IconButton({
  icon: Icon,
  label,
  onClick,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'secondary', // 'secondary' | 'ghost'
  className = '',
  iconClassName = '',
  disabled = false,
}) {
  const sizeClasses = {
    sm: 'w-10 h-10', // 40px
    md: 'w-12 h-12', // 48px
    lg: 'w-14 h-14', // 56px
  }[size] || 'w-12 h-12';

  const baseVariant = variant === 'ghost'
    ? 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
    : 'btn-secondary';

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center ${sizeClasses} ${baseVariant} transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-100 ${className}`}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      {Icon && (
        <Icon aria-hidden="true" focusable="false" className={`w-5 h-5 ${iconClassName}`} />
      )}
    </button>
  );
}