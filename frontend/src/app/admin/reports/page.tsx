'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Report {
  _id: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
  userId: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - in production, fetch from API
    setReports([
      { _id: '1', type: 'bug', description: 'Translation accuracy issue', status: 'pending', createdAt: '2024-01-25', userId: 'user1' },
      { _id: '2', type: 'feature', description: 'Add new sign language', status: 'resolved', createdAt: '2024-01-20', userId: 'user2' },
      { _id: '3', type: 'abuse', description: 'Inappropriate content', status: 'rejected', createdAt: '2024-01-18', userId: 'user3' },
    ]);
  }, []);

  const filteredReports = reports.filter(report =>
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Reports Management
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Review and manage user reports
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              All Reports
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search reports..."
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <span className="capitalize text-slate-900 dark:text-white">{report.type}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{report.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{report.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm">Resolve</Button>
                            <Button variant="outline" size="sm">Reject</Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
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
