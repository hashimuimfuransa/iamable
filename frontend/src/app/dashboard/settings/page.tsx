'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Bell, Moon, Sun, Shield, LogOut, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: '',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [isAuthenticated, router, isHydrated, user]);

  if (!isHydrated) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.users.updateProfile(formData);
      updateUser(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  size="sm"
                >
                  {darkMode ? 'Disable' : 'Enable'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Notifications</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Manage notification preferences
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Privacy</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Manage your privacy settings
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
