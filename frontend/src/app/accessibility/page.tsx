'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Keyboard, Volume2, Moon, Sun, Text, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function Accessibility() {
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'WCAG 2.1 AA Compliant',
      description: 'Our platform meets Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, ensuring equal access for all users.',
    },
    {
      icon: <Keyboard className="w-8 h-8" />,
      title: 'Keyboard Navigation',
      description: 'Full keyboard support with logical tab order and visible focus indicators for users who cannot use a mouse.',
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: 'Screen Reader Compatible',
      description: 'Optimized for popular screen readers including JAWS, NVDA, and VoiceOver with proper ARIA labels.',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'High Contrast Mode',
      description: 'Built-in high contrast themes and color-blind friendly palettes for users with visual impairments.',
    },
    {
      icon: <Text className="w-8 h-8" />,
      title: 'Resizable Text',
      description: 'Text scales up to 200% without breaking layout, accommodating users who need larger fonts.',
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: 'Dark Mode',
      description: 'Dark mode reduces eye strain and is essential for users with light sensitivity or photophobia.',
    },
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
              Accessibility at Our <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Core</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We believe technology should be accessible to everyone. Our platform is designed with inclusivity in mind from the ground up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              At Am Able, accessibility isn't an afterthought—it's fundamental to our mission. As a sign language translation platform, we understand the importance of removing barriers. That's why we've built our entire product with accessibility as a primary design principle, ensuring that deaf, hard-of-hearing, and hearing users alike can communicate seamlessly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Accessibility Features</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full border-0 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Commitment</h2>
          <p className="text-blue-100 text-lg mb-8">
            We continuously test and improve our accessibility features with feedback from the disability community. Our team includes accessibility experts and we regularly audit our platform to ensure we meet and exceed accessibility standards.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Give Feedback
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
