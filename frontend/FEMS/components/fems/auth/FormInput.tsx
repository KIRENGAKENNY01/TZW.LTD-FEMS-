'use client';

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export function FormInput({ label, error, id, className = '', ...rest }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-secondary-600 dark:text-secondary-400"
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-10 w-full rounded-lg border px-3 text-sm transition-colors bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:ring-2 ${
          error
            ? 'border-primary-500 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800'
            : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800'
        } disabled:cursor-not-allowed disabled:bg-secondary-100 dark:disabled:bg-secondary-800 disabled:text-secondary-300 ${className}`}
        {...rest}
      />
      {error && (
        <p className="text-xs text-primary-600 dark:text-primary-400">{error}</p>
      )}
    </div>
  );
}

export default FormInput;
