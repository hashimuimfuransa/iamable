'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Accessibility, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.auth.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We've sent a password reset link to {email}
              </p>
              <Button onClick={() => router.push('/login')} className="w-full">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
            Reset Password
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Enter your email to receive a reset link
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-5 h-5 text-slate-400" />}
              />

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
