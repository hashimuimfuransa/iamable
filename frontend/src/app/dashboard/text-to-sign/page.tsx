'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Play, Save, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function TextToSignPage() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSign, setCurrentSign] = useState('');

  const handleConvert = () => {
    if (!text.trim()) return;
    
    // Simulate text-to-sign conversion
    const words = text.split(' ');
    let index = 0;
    
    setIsPlaying(true);
    
    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentSign('');
        return;
      }
      
      setCurrentSign(words[index]);
      index++;
    }, 1500);
  };

  const handleReset = () => {
    setText('');
    setCurrentSign('');
    setIsPlaying(false);
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    
    try {
      await api.translations.create({
        inputType: 'text-to-sign',
        inputContent: text,
        translatedText: 'Sign language representation',
        confidenceScore: 0.95,
      });
      alert('Translation saved!');
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Text to Sign Language
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Convert written text into sign language demonstrations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter text to convert
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-40 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleConvert}
                  disabled={!text.trim() || isPlaying}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Playing...' : 'Convert to Sign'}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSpeak}
                  variant="outline"
                  disabled={!text.trim()}
                  className="flex-1"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Speak Text
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!text.trim()}
                  variant="outline"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Sign Language Display
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
                {currentSign ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-6xl font-bold shadow-lg">
                      {currentSign.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {currentSign}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      Sign representation
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Type className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Enter text and click convert to see sign language</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
