'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';

export default function Contact() {
  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-cyan-950/20" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Get in <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Email</h3>
                        <p className="text-slate-600 dark:text-slate-300">hello@amable.com</p>
                        <p className="text-slate-600 dark:text-slate-300">support@amable.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Phone</h3>
                        <p className="text-slate-600 dark:text-slate-300">+1 (555) 123-4567</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Mon-Fri 9am-6pm EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Office</h3>
                        <p className="text-slate-600 dark:text-slate-300">123 Innovation Drive</p>
                        <p className="text-slate-600 dark:text-slate-300">San Francisco, CA 94102</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Need Help?</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Check our FAQ section for quick answers to common questions.
                </p>
                <Link href="/faq">
                  <Button variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    Visit FAQ
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Subject
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg font-semibold shadow-lg shadow-blue-500/30"
                    >
                      <Send className="mr-2 w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
