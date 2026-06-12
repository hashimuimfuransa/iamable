'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { Hand, Mic, Type, Activity, Bookmark, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = React.useState({
    totalTranslations: 0,
    savedTranslations: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchStats();
    }
  }, [isAuthenticated, router]);

  const fetchStats = async () => {
    try {
      const data = await api.translations.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const translationModes = [
    {
      icon: Hand,
      title: 'Sign to Text',
      description: 'Real-time sign language translation',
      href: '/dashboard/translation',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      icon: Mic,
      title: 'Voice to Sign',
      description: 'Convert voice to sign language',
      href: '/dashboard/voice',
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
    },
    {
      icon: Type,
      title: 'Text to Sign',
      description: 'Transform text to animations',
      href: '/dashboard/text-to-sign',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Choose a translation mode to get started
        </p>
      </div>

      {/* Translation Modes - Primary Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {translationModes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${mode.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
            <mode.icon className={`w-10 h-10 ${mode.color} rounded-xl p-2 mb-4`} />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {mode.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {mode.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Stats - Simplified */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <Activity className="w-4 h-4" />
            <span>Translations</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalTranslations}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.savedTranslations}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(stats.avgConfidence * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
