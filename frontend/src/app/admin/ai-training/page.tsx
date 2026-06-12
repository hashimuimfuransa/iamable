'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Upload, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

interface Training {
  _id: string;
  trainingName: string;
  modelVersion: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  datasetSize?: number;
  epochs?: number;
  accuracy?: number;
  loss?: number;
  trainingTime?: number;
  errorMessage?: string;
  createdAt: string;
}

export default function AITrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    trainingName: '',
    modelVersion: '',
    datasetSize: 0,
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await api.ai.getTrainingHistory();
      setTrainings(data);
    } catch (error) {
      console.error('Failed to fetch training history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.ai.createTraining(formData);
      setShowForm(false);
      setFormData({
        trainingName: '',
        modelVersion: '',
        datasetSize: 0,
        epochs: 10,
        batchSize: 32,
        learningRate: 0.001,
      });
      fetchTrainings();
    } catch (error) {
      console.error('Failed to create training');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'training':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'training':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            AI Training
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage and monitor AI model training sessions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Training
        </button>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Training Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Training Name
                  </label>
                  <input
                    type="text"
                    value={formData.trainingName}
                    onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Model Version
                  </label>
                  <input
                    type="text"
                    value={formData.modelVersion}
                    onChange={(e) => setFormData({ ...formData, modelVersion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Dataset Size
                    </label>
                    <input
                      type="number"
                      value={formData.datasetSize}
                      onChange={(e) => setFormData({ ...formData, datasetSize: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Epochs
                    </label>
                    <input
                      type="number"
                      value={formData.epochs}
                      onChange={(e) => setFormData({ ...formData, epochs: parseInt(e.target.value) || 10 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Batch Size
                    </label>
                    <input
                      type="number"
                      value={formData.batchSize}
                      onChange={(e) => setFormData({ ...formData, batchSize: parseInt(e.target.value) || 32 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Learning Rate
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.learningRate}
                      onChange={(e) => setFormData({ ...formData, learningRate: parseFloat(e.target.value) || 0.001 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Training
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading training history...</div>
        ) : trainings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p>No training sessions found. Create your first training session.</p>
            </CardContent>
          </Card>
        ) : (
          trainings.map((training, index) => (
            <motion.div
              key={training._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {training.trainingName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                          {training.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Version: {training.modelVersion}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {training.datasetSize && (
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Dataset:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">{training.datasetSize}</span>
                          </div>
                        )}
                        {training.epochs && (
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Epochs:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">{training.epochs}</span>
                          </div>
                        )}
                        {training.accuracy !== undefined && (
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Accuracy:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">{(training.accuracy * 100).toFixed(2)}%</span>
                          </div>
                        )}
                        {training.loss !== undefined && (
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Loss:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">{training.loss.toFixed(4)}</span>
                          </div>
                        )}
                      </div>
                      {training.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{training.errorMessage}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusIcon(training.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
