'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Target, Activity, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

interface AIStats {
  totalPredictions: number;
  avgAccuracy: number;
  avgProcessingTime: number;
  gestureDistribution: { _id: string; count: number }[];
}

interface AILog {
  _id: string;
  gestureRecognized: string;
  confidence: number;
  accuracy: number;
  processingTime: number;
  createdAt: string;
}

export default function AIPerformancePage() {
  const [stats, setStats] = useState<AIStats | null>(null);
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, logsData] = await Promise.all([
        api.ai.getStats(),
        api.ai.getLogs(50),
      ]);
      setStats(statsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch AI performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading performance data...</div>;
  }

  const statCards = [
    {
      title: 'Total Predictions',
      value: stats?.totalPredictions || 0,
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    },
    {
      title: 'Average Accuracy',
      value: `${((stats?.avgAccuracy || 0) * 100).toFixed(2)}%`,
      icon: <Target className="w-6 h-6 text-green-600" />,
      color: 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
    },
    {
      title: 'Avg Processing Time',
      value: `${(stats?.avgProcessingTime || 0).toFixed(2)}ms`,
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      color: 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    },
    {
      title: 'Top Gesture',
      value: stats?.gestureDistribution[0]?._id || 'N/A',
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          AI Performance
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Monitor AI model performance and prediction accuracy
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

      {/* Gesture Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Gesture Recognition Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.gestureDistribution.slice(0, 10).map((item, index) => {
                const maxCount = Math.max(...stats.gestureDistribution.map(g => g.count));
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900 dark:text-white capitalize">
                        {item._id}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">{item.count} predictions</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.slice(0, 10).map((log, index) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white capitalize">
                        {log.gestureRecognized}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {(log.confidence * 100).toFixed(1)}% confidence
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {log.processingTime}ms
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
