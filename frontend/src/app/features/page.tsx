'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Type, Mic, Brain, Zap, Shield, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function Features() {
  const features = [
    {
      icon: <Camera className="w-8 h-8 text-white" />,
      title: 'Sign to Text',
      description: 'Advanced computer vision captures hand movements with sub-millisecond precision, translating sign language instantly.',
      details: ['Real-time hand tracking', '99.2% accuracy rate', 'Supports 42 languages', 'Works with any camera'],
      color: 'from-blue-600 via-cyan-500 to-blue-500',
    },
    {
      icon: <Type className="w-8 h-8 text-white" />,
      title: 'Text to Sign',
      description: 'Neural animation engine generates fluid, natural sign language demonstrations that mirror human expression.',
      details: ['15K+ sign library', 'Natural animations', 'Customizable speed', 'Multiple signing styles'],
      color: 'from-emerald-600 via-teal-500 to-emerald-500',
    },
    {
      icon: <Mic className="w-8 h-8 text-white" />,
      title: 'Voice to Sign',
      description: 'Real-time speech processing with adaptive noise cancellation for crystal-clear translation in any environment.',
      details: ['<150ms latency', 'Noise cancellation', 'Multi-speaker support', 'Voice training'],
      color: 'from-violet-600 via-purple-500 to-violet-500',
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: 'AI Learning',
      description: 'Self-evolving neural networks continuously improve accuracy through community feedback and usage patterns.',
      details: ['Continuous learning', 'Community feedback', 'Pattern recognition', 'Adaptive algorithms'],
      color: 'from-orange-600 via-amber-500 to-orange-500',
    },
  ];

  const technicalFeatures = [
    { icon: <Zap className="w-6 h-6" />, title: 'Lightning Fast', desc: 'Sub-150ms response time' },
    { icon: <Shield className="w-6 h-6" />, title: 'Enterprise Security', desc: 'SOC 2 compliant' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Coverage', desc: '42 languages supported' },
    { icon: <Users className="w-6 h-6" />, title: 'Scalable', desc: '125K+ active users' },
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
              Powerful <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Features</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Everything you need for seamless sign language communication, powered by cutting-edge AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Technical Excellence</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Built with enterprise-grade technology for reliability and performance
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-cyan-500">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join 125,000+ users who are already transforming their communication experience.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
