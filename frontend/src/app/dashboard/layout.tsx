'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex pt-16 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300 w-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
