'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Accessibility, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.auth.register(formData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Am Able Logo" className="w-16 h-16" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Start your sign language translation journey
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                icon={<User className="w-5 h-5 text-slate-400" />}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                icon={<Mail className="w-5 h-5 text-slate-400" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                icon={<Lock className="w-5 h-5 text-slate-400" />}
              />

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 dark:text-slate-300">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
