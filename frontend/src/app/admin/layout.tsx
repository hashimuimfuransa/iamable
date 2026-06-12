'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex pt-16">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
