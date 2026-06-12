'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Hand, Mic, Type, ArrowRight, CheckCircle2, Brain, Camera, MessageSquare, TrendingUp, Users, Globe, Waves, Zap, Cpu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const rotate = useTransform(scrollY, [0, 500], [0, 5]);

  const features = [
    {
      icon: <Camera className="w-8 h-8 text-white" />,
      title: 'Sign to Text',
      description: 'Advanced computer vision captures hand movements with sub-millisecond precision, translating sign language instantly.',
      stats: '99.2% Accuracy',
      color: 'from-blue-600 via-cyan-500 to-blue-500',
      glow: 'shadow-blue-500/50',
    },
    {
      icon: <Type className="w-8 h-8 text-white" />,
      title: 'Text to Sign',
      description: 'Neural animation engine generates fluid, natural sign language demonstrations that mirror human expression.',
      stats: '15K+ Signs',
      color: 'from-emerald-600 via-teal-500 to-emerald-500',
      glow: 'shadow-emerald-500/50',
    },
    {
      icon: <Mic className="w-8 h-8 text-white" />,
      title: 'Voice to Sign',
      description: 'Real-time speech processing with adaptive noise cancellation for crystal-clear translation in any environment.',
      stats: '<150ms Latency',
      color: 'from-violet-600 via-purple-500 to-violet-500',
      glow: 'shadow-violet-500/50',
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: 'AI Learning',
      description: 'Self-evolving neural networks continuously improve accuracy through community feedback and usage patterns.',
      stats: 'Always Learning',
      color: 'from-orange-600 via-amber-500 to-orange-500',
      glow: 'shadow-orange-500/50',
    },
  ];

  const useCases = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Enterprise',
      description: 'Transform corporate communication with real-time translation for inclusive, productive meetings.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Education',
      description: 'Create inclusive learning environments where every student can fully participate and engage.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Healthcare',
      description: 'Ensure critical medical communication is accurate, fast, and accessible for all patients.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Public Sector',
      description: 'Make government services and public information accessible to every citizen equally.',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight">
              <span className="block">Breaking</span>
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                Communication Barriers
              </span>
              <span className="block mt-1 sm:mt-2">with AI</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
              Revolutionary sign language translation powered by neural networks. 
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> 99.2% accuracy</span> with 
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold"> sub-150ms latency</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center mb-10 sm:mb-12 md:mb-16 px-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 h-12 sm:h-14 md:h-16 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 hover:from-blue-700 hover:via-violet-700 hover:to-cyan-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group"
                >
                  Start Translating Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-800 mb-6"
            >
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Advanced Technology</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Powered by <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Neural Networks</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Cutting-edge AI technology delivering unprecedented accuracy and speed in sign language translation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${feature.glow}`} />
                  <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`} />
                    <CardHeader className="pb-4">
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{feature.stats}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGwxNS0xNU0zMCAzMGwxNSAxNU0zMCAzMGwtMTUgMTVNMzAgMzBsLTE1LTE1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] dark:invert" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800 mb-6"
            >
              <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Industry Solutions</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Transforming <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Every Industry</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Empowering organizations across sectors with accessible, real-time communication solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="relative group h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <Card className="relative h-full border-2 border-slate-200 dark:border-slate-700 hover:border-transparent transition-all duration-500 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${useCase.gradient}`} />
                    <CardHeader className="pb-4">
                      <motion.div 
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        {useCase.icon}
                      </motion.div>
                      <CardTitle className="text-xl font-bold">{useCase.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {useCase.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 rounded-full blur-3xl" 
          />
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 p-1 overflow-hidden shadow-2xl"
          >
            {/* Animated Border Effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 100%' }}
            />
            
            <div className="relative bg-slate-900 dark:bg-slate-950 rounded-[20px] p-12 sm:p-16 text-center overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
              
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 mb-8"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">Join the Revolution</span>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Ready to Transform
                  <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Communication Forever?
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Join 125,000+ users who are already breaking communication barriers with Am Able's revolutionary AI technology.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-5 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link href="/register">
                    <Button 
                      size="lg" 
                      className="text-lg px-10 h-16 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 hover:from-blue-600 hover:via-violet-600 hover:to-cyan-600 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group border-2 border-transparent hover:border-blue-400/50"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 h-16 border-2 border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800 text-white transition-all duration-300"
                  >
                    Contact Sales
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
