'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchNotifications();
    }
  }, [isAuthenticated, router, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.notifications.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.notifications.delete(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      await api.notifications.clearAll();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear all:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Notifications
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </motion.div>

      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
        {notifications.length > 0 && (
          <Button onClick={clearAll} variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-slate-400">
              <Bell className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No notifications</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card
                className={`transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(
                        notification.type
                      )}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={`font-semibold ${
                              !notification.read
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              !notification.read
                                ? 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-500 dark:text-slate-500'
                            }`}
                          >
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification._id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification._id)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
