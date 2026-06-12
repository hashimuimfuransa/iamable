'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Activity, TrendingUp, FileText, Cpu, Server, HardDrive } from 'lucide-react';
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

interface ReportStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  reportTypeDistribution: { _id: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [dashboardData, reportData] = await Promise.all([
        api.admin.getDashboardStats(),
        api.admin.getStats(),
      ]);
      setDashboardStats(dashboardData);
      setReportStats(reportData);
    } catch (error) {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading dashboard...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: dashboardStats?.users.total || 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    },
    {
      title: 'Active Users',
      value: dashboardStats?.users.active || 0,
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    },
    {
      title: 'Pending Reports',
      value: reportStats?.pendingReports || 0,
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      color: 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30',
    },
    {
      title: 'Total Requests',
      value: dashboardStats?.system.totalRequests || 0,
      icon: <Activity className="w-6 h-6 text-teal-600" />,
      color: 'from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30',
    },
  ];

  const systemCards = [
    {
      title: 'CPU Usage',
      value: `${(dashboardStats?.system.cpuUsage || 0).toFixed(1)}%`,
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      color: 'from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30',
    },
    {
      title: 'Memory Usage',
      value: `${(dashboardStats?.system.memoryUsage || 0).toFixed(1)}%`,
      icon: <Server className="w-6 h-6 text-pink-600" />,
      color: 'from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30',
    },
    {
      title: 'Disk Usage',
      value: `${(dashboardStats?.system.diskUsage || 0).toFixed(1)}%`,
      icon: <HardDrive className="w-6 h-6 text-green-600" />,
      color: 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
    },
    {
      title: 'Avg Response Time',
      value: `${(dashboardStats?.system.averageResponseTime || 0).toFixed(2)}ms`,
      icon: <Activity className="w-6 h-6 text-yellow-600" />,
      color: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Overview of platform statistics and system health
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
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
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemCards.map((card, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {card.icon}
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {card.title}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Report Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Reports</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reportStats?.totalReports || 0}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reportStats?.pendingReports || 0}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Resolved</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reportStats?.resolvedReports || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
