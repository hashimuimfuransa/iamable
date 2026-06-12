'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function Privacy() {
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
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Privacy <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Last updated: January 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 sm:p-12"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Introduction</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                At Am Able, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our sign language translation services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Information We Collect</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                <li>Account information (name, email, password)</li>
                <li>Usage data (translation history, feature usage)</li>
                <li>Device information (browser type, operating system)</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">How We Use Your Information</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                <li>Provide and improve our translation services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important updates and security notifications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Train and improve our AI models (using anonymized data only)</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Video Data Privacy</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Your video data is processed in real-time for translation purposes. We do not store or transmit your video feed to our servers unless you explicitly choose to save translations. All video processing happens locally on your device whenever possible.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Data Security</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We implement industry-standard security measures including encryption, secure authentication, and regular security audits. We are SOC 2 Type II compliant and follow GDPR guidelines for data protection.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Your Rights</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Contact Us</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                If you have questions about this Privacy Policy or our data practices, please contact us at privacy@amable.com.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
