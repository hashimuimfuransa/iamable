'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function Terms() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Terms of <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Service</span>
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                By accessing or using Am Able's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Description of Service</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Am Able provides AI-powered sign language translation services including sign-to-text, text-to-sign, and voice-to-sign translation. Our services are designed to facilitate communication between deaf, hard-of-hearing, and hearing individuals.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">User Responsibilities</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">As a user of Am Able, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to reverse engineer or circumvent security measures</li>
                <li>Not use the service to harass, abuse, or harm others</li>
                <li>Provide accurate information when creating an account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Intellectual Property</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                All content, features, and functionality of the Am Able platform are owned by Am Able and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, modify, or distribute our content without prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Payment Terms</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">Paid subscriptions are billed on a monthly or annual basis:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                <li>Fees are non-refundable except as required by law</li>
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
                <li>We reserve the right to modify pricing with 30 days notice</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Disclaimer of Warranties</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Am Able provides services on an "as is" basis without warranties of any kind, whether express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that translations will be 100% accurate.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Limitation of Liability</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                To the maximum extent permitted by law, Am Able shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Termination</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our sole discretion. Upon termination, your right to use the service will immediately cease.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Governing Law</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Am Able is headquartered, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Changes to Terms</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We reserve the right to modify these terms at any time. Continued use of the service after modifications constitutes acceptance of the updated terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 mt-8">Contact Information</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                For questions about these Terms of Service, please contact us at legal@amable.com.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
