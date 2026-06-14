'use client';

import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const DashboardHeader = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, darkMode } = useUIStore();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl h-16',
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
      )}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Logo and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <img src="/logo.png" alt="Am Able Logo" className="w-8 h-8" />
            <span className="ml-2 font-bold text-lg text-slate-900 dark:text-white">
              Am Able
            </span>
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </Link>
          
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.name || 'User'}
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
