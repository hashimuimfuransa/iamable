'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - in production, fetch from API
    setUsers([
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2024-01-15' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-01-20' },
      { _id: '3', name: 'Admin User', email: 'admin@amable.com', role: 'admin', createdAt: '2024-01-01' },
    ]);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage platform users and their roles
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{user.createdAt}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
