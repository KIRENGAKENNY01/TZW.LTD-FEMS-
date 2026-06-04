'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/fems/auth/AuthLayout';
import { FormInput } from '@/components/fems/auth/FormInput';
import { PasswordInput } from '@/components/fems/auth/PasswordInput';
import { register as apiRegister } from '@/lib/api/auth';
import { useAuth } from '@/lib/context/AuthContext';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as 'USER' | 'INSPECTOR',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
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
      await apiRegister({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email,
        password: form.password,
        role: form.role,
      });
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            Create Your Account
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Sign up for your FEMS account
          </p>
        </div>

        {errors.general && (
          <div className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
            <p className="text-sm text-primary-700 dark:text-primary-400">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              id="reg-first-name"
              label="First name"
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <FormInput
              id="reg-last-name"
              label="Last name"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              error={errors.lastName}
              autoComplete="family-name"
            />
          </div>

          <FormInput
            id="reg-email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <PasswordInput
            id="reg-password"
            label="Password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />

          <PasswordInput
            id="reg-confirm-password"
            label="Confirm password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-role"
              className="text-xs font-medium text-secondary-600 dark:text-secondary-400"
            >
              Role
            </label>
            <select
              id="reg-role"
              value={form.role}
              onChange={(e) => set('role', e.target.value as 'USER' | 'INSPECTOR')}
              className="h-10 w-full rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-3 text-sm text-secondary-900 dark:text-secondary-50 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
            >
              <option value="USER">User</option>
              <option value="INSPECTOR">Inspector</option>
            </select>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-700 active:scale-[0.98] text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
