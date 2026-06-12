'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How accurate is the sign language translation?',
      answer: 'Our AI-powered translation achieves 99.2% accuracy, making it one of the most reliable sign language translation systems available. The accuracy is continuously improving through our self-learning neural networks.',
    },
    {
      question: 'What languages do you support?',
      answer: 'We currently support 42 sign languages including American Sign Language (ASL), British Sign Language (BSL), and many others. We regularly add new languages based on user demand and community feedback.',
    },
    {
      question: 'How fast is the translation?',
      answer: 'Our system delivers sub-150ms latency, meaning the translation appears almost instantaneously. This real-time performance makes natural conversation possible without noticeable delays.',
    },
    {
      question: 'Do I need special equipment?',
      answer: 'No special equipment is required. Our platform works with any standard webcam or smartphone camera. For best results, we recommend good lighting and a clear view of your hands.',
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes, we take privacy seriously. All translations are processed securely, and we never store or share your video data. We are SOC 2 compliant and follow industry-standard security practices.',
    },
    {
      question: 'Can I use Am Able for business purposes?',
      answer: 'Absolutely! Our Pro and Enterprise plans are designed for business use. They include features like API access, custom vocabulary, priority support, and team management tools.',
    },
    {
      question: 'What happens if the translation is incorrect?',
      answer: 'Our system includes a feedback mechanism that allows you to report incorrect translations. This feedback is used to train and improve our AI models, making the system more accurate over time.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a free forever plan with 100 translations per month, perfect for personal use. We also offer a 14-day free trial of our Pro plan with no credit card required.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your account settings. There are no cancellation fees, and you will continue to have access until the end of your billing period.',
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Yes, all paid plans include technical support. Free plan users have access to community support, while Pro and Enterprise users receive priority email support with faster response times.',
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
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Find answers to common questions about Am Able. Can't find what you're looking for? Contact our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="px-6 pb-5 pt-0">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Our support team is here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Contact Support</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">View Pricing</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
