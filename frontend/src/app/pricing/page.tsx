'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, HeadphonesIcon as Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individuals getting started',
      price: { monthly: 0, annual: 0 },
      features: [
        '100 translations per month',
        'Basic sign-to-text',
        'Standard accuracy',
        'Community support',
        'Web access only',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For professionals and small teams',
      price: { monthly: 29, annual: 24 },
      features: [
        'Unlimited translations',
        'All translation modes',
        '99.2% accuracy rate',
        'Priority support',
        'Desktop + Mobile apps',
        'Custom vocabulary',
        'API access (10K calls/mo)',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: { monthly: 99, annual: 79 },
      features: [
        'Everything in Pro',
        'Unlimited API calls',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment',
        'Advanced analytics',
        'White-label options',
      ],
      cta: 'Contact Sales',
      popular: false,
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
              Simple, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
            
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!annual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  animate={{ x: annual ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${annual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                Annual <span className="text-blue-600">(Save 20%)</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full border-2 ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-slate-500">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                      <Button
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600' : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800'}`}
                        variant={plan.popular ? 'primary' : 'outline'}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Compare Plans</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-8 h-8" />, title: 'Lightning Fast', desc: 'Sub-150ms response time across all plans' },
              { icon: <Shield className="w-8 h-8" />, title: 'Secure', desc: 'Enterprise-grade security and encryption' },
              { icon: <Headphones className="w-8 h-8" />, title: 'Support', desc: '24/7 support for Pro and Enterprise' },
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Have questions?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Check out our FAQ or contact our sales team for more information.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/faq">
              <Button variant="outline">View FAQ</Button>
            </Link>
            <Link href="/contact">
              <Button>Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
