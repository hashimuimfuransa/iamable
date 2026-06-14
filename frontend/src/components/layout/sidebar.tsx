'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Mic,
  Type,
  Hand,
  History,
  Bookmark,
  Settings,
  Bell,
  Users,
  BarChart3,
  FileText,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const isAdmin = user?.role === 'admin';
  const [isMobile, setIsMobile] = React.useState(false);
  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close sidebar on mount if on mobile
      if (!hasMounted.current && mobile && sidebarOpen) {
        hasMounted.current = true;
        toggleSidebar();
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { href: '/dashboard/translation', label: 'Sign to Text', icon: <Hand className="w-5 h-5" /> },
    { href: '/dashboard/voice', label: 'Voice to Sign', icon: <Mic className="w-5 h-5" /> },
    { href: '/dashboard/text-to-sign', label: 'Text to Sign', icon: <Type className="w-5 h-5" /> },
    { href: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const adminNavItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { href: '/admin/ai-training', label: 'AI Training', icon: <Shield className="w-5 h-5" /> },
    { href: '/admin/ai-performance', label: 'AI Performance', icon: <Activity className="w-5 h-5" /> },
    { href: '/admin/system', label: 'System Monitor', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const navItems = pathname?.startsWith('/admin') && isAdmin ? adminNavItems : userNavItems;

  return (
    <>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={cn(
          'fixed left-0 top-16 bottom-0 z-40 border-r transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0',
          'bg-white/80 backdrop-blur-xl border-slate-200 dark:bg-slate-900/80 dark:border-slate-800'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={isMobile ? toggleSidebar : undefined}
                    className={cn(
                      'flex items-center px-3 py-3 rounded-xl transition-all duration-200',
                      'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                      isActive
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 font-medium text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Collapse Toggle - Desktop Only */}
          <div className="hidden md:block p-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
