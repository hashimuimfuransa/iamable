'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-white/80 border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Am Able Logo" className="w-16 h-16" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-white border-slate-200"
        >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};