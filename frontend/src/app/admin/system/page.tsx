'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Users, Activity, Clock, AlertTriangle, CheckCircle, Server } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    admins: number;
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    activeUsers: number;
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

export default function SystemMonitorPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.admin.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch system stats');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
    if (value >= thresholds.warning) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    return { status: 'healthy', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading system metrics...</div>;
  }

  const cpuHealth = getHealthStatus(stats?.system.cpuUsage || 0, { warning: 70, critical: 90 });
  const memoryHealth = getHealthStatus(stats?.system.memoryUsage || 0, { warning: 70, critical: 90 });
  const diskHealth = getHealthStatus(stats?.system.diskUsage || 0, { warning: 80, critical: 95 });

  const systemCards = [
    {
      title: 'CPU Usage',
      value: `${(stats?.system.cpuUsage || 0).toFixed(1)}%`,
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
      health: cpuHealth,
    },
    {
      title: 'Memory Usage',
      value: `${(stats?.system.memoryUsage || 0).toFixed(1)}%`,
      icon: <Server className="w-6 h-6 text-purple-600" />,
      color: 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
      health: memoryHealth,
    },
    {
      title: 'Disk Usage',
      value: `${(stats?.system.diskUsage || 0).toFixed(1)}%`,
      icon: <HardDrive className="w-6 h-6 text-green-600" />,
      color: 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
      health: diskHealth,
    },
    {
      title: 'System Uptime',
      value: formatUptime(stats?.system.uptime || 0),
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      color: 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30',
      health: { status: 'healthy', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    },
  ];

  const performanceCards = [
    {
      title: 'Active Users',
      value: stats?.system.activeUsers || 0,
      icon: <Users className="w-6 h-6 text-teal-600" />,
      color: 'from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30',
    },
    {
      title: 'Total Requests',
      value: stats?.system.totalRequests || 0,
      icon: <Activity className="w-6 h-6 text-indigo-600" />,
      color: 'from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30',
    },
    {
      title: 'Avg Response Time',
      value: `${(stats?.system.averageResponseTime || 0).toFixed(2)}ms`,
      icon: <Clock className="w-6 h-6 text-pink-600" />,
      color: 'from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30',
    },
    {
      title: 'Error Rate',
      value: `${((stats?.system.errorRate || 0) * 100).toFixed(2)}%`,
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      color: 'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          System Monitor
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Real-time system health and performance metrics
        </p>
      </motion.div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {card.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${card.health.bg} ${card.health.color}`}>
                    {card.health.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {card.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Users</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats?.users.total || 0}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Users</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats?.users.active || 0}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Admin Users</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats?.users.admins || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resource Usage Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">CPU Usage</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{(stats?.system.cpuUsage || 0).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.system.cpuUsage || 0}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      (stats?.system.cpuUsage || 0) > 90 ? 'bg-red-500' :
                      (stats?.system.cpuUsage || 0) > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Memory Usage</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{(stats?.system.memoryUsage || 0).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.system.memoryUsage || 0}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      (stats?.system.memoryUsage || 0) > 90 ? 'bg-red-500' :
                      (stats?.system.memoryUsage || 0) > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Disk Usage</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{(stats?.system.diskUsage || 0).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.system.diskUsage || 0}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      (stats?.system.diskUsage || 0) > 95 ? 'bg-red-500' :
                      (stats?.system.diskUsage || 0) > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
