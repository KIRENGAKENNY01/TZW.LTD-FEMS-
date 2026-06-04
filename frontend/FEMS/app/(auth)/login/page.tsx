'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/fems/auth/AuthLayout';
import { FormInput } from '@/components/fems/auth/FormInput';
import { PasswordInput } from '@/components/fems/auth/PasswordInput';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Invalid email or password. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Sign in to your FEMS account
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
            <p className="text-sm text-primary-700 dark:text-primary-400">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormInput
            id="login-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          {/* Remember me row */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="login-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-secondary-300 dark:border-secondary-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-700 active:scale-[0.98] text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
