'use client';

import { useState } from 'react';
import { FormInput } from './FormInput';

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  id: string;
}

export function PasswordInput({ label, error, id, ...rest }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-secondary-600 dark:text-secondary-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`h-10 w-full rounded-lg border px-3 pr-10 text-sm transition-colors bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 placeholder-secondary-400 focus:outline-none focus:ring-2 ${
            error
              ? 'border-primary-500 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800'
              : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800'
          } disabled:cursor-not-allowed disabled:bg-secondary-100 dark:disabled:bg-secondary-800 disabled:text-secondary-300`}
          {...rest}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-primary-600 dark:text-primary-400">{error}</p>
      )}
    </div>
  );
}

export default PasswordInput;
