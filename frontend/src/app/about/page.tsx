'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function About() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Empathy First',
      description: 'We design with deep understanding of the challenges faced by the deaf and hard-of-hearing community.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Pushing the boundaries of AI to create solutions that were previously impossible.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Inclusivity',
      description: 'Building technology that brings people together, regardless of their abilities.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Impact',
      description: 'Breaking communication barriers across 42 languages and counting.',
    },
  ];

  const stats = [
    { value: '125K+', label: 'Active Users', icon: <Users className="w-5 h-5" /> },
    { value: '42', label: 'Languages', icon: <Globe className="w-5 h-5" /> },
    { value: '99.2%', label: 'Accuracy', icon: <Award className="w-5 h-5" /> },
    { value: '<150ms', label: 'Latency', icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Am Able</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We're on a mission to break communication barriers and make the world more accessible for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Am Able was founded with a simple but powerful vision: to eliminate communication barriers between deaf and hearing communities. We believe that everyone deserves equal access to information, opportunities, and human connection.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              By leveraging cutting-edge artificial intelligence, we've created a platform that translates sign language in real-time with unprecedented accuracy. Our technology doesn't just translate words—it captures nuance, emotion, and context, making communication truly natural and inclusive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-lg"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full border-0 shadow-lg bg-slate-50 dark:bg-slate-800">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 text-white">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-cyan-500">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Be part of the movement to make communication accessible for everyone.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
