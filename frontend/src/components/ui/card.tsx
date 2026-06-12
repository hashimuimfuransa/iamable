import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card = ({ children, className, hover = false, glass = true }: CardProps) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  
  const glassStyles = glass
    ? 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl'
    : 'bg-white shadow-lg';
  
  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:scale-[1.02] hover:bg-white/80'
    : '';

  return (
    <motion.div
      className={cn(baseStyles, glassStyles, hoverStyles, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn('text-xl font-bold text-slate-900 dark:text-white', className)}>{children}</h3>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('text-slate-600 dark:text-slate-300', className)}>{children}</div>
);
