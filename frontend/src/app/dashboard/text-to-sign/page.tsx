'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Type, Play, Save, Volume2, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

// ASL sign language image mapping using lifeprint.com (reliable ASL resource)
const getSignImageUrl = (letter: string): string => {
  const lowerLetter = letter.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Using ASL alphabet images from lifeprint.com
  const signImageMap: { [key: string]: string } = {
    'a': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif',
    'b': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/b.gif',
    'c': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/c.gif',
    'd': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/d.gif',
    'e': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/e.gif',
    'f': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/f.gif',
    'g': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/g.gif',
    'h': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/h.gif',
    'i': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/i.gif',
    'j': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/j.gif',
    'k': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/k.gif',
    'l': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/l.gif',
    'm': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/m.gif',
    'n': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/n.gif',
    'o': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/o.gif',
    'p': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/p.gif',
    'q': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/q.gif',
    'r': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/r.gif',
    's': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/s.gif',
    't': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/t.gif',
    'u': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/u.gif',
    'v': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/v.gif',
    'w': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/w.gif',
    'x': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/x.gif',
    'y': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/y.gif',
    'z': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/z.gif',
    // Numbers using letter-based fallback
    '0': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif',
    '1': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/b.gif',
    '2': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/c.gif',
    '3': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/d.gif',
    '4': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/e.gif',
    '5': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/f.gif',
    '6': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/g.gif',
    '7': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/h.gif',
    '8': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/i.gif',
    '9': 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/j.gif',
  };

  return signImageMap[lowerLetter] || '';
};

export default function TextToSignPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [signImages, setSignImages] = useState<{ letter: string; imageUrl: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  // Real-time conversion as user types
  useEffect(() => {
    if (text.trim()) {
      const letters = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split('');
      const images = letters.map(letter => ({
        letter: letter.toUpperCase(),
        imageUrl: getSignImageUrl(letter)
      })).filter(item => item.imageUrl);
      setSignImages(images);
      setImageLoadErrors(new Set());
    } else {
      setSignImages([]);
      setImageLoadErrors(new Set());
    }
  }, [text]);

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => new Set(prev).add(index));
  };

  const handleConvert = () => {
    if (!text.trim() || signImages.length === 0) return;
    
    setIsPlaying(true);
    setCurrentIndex(0);
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= signImages.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleReset = () => {
    setText('');
    setIsPlaying(false);
    setSignImages([]);
    setCurrentIndex(0);
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
      alert('Failed to save translation. Please make sure you are logged in.');
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
                <ImageIcon className="w-5 h-5" />
                Sign Language Display
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-8 min-h-[300px]">
                {signImages.length > 0 ? (
                  <div className="space-y-4">
                    {/* Current sign being played */}
                    {isPlaying && signImages[currentIndex] && (
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden bg-white shadow-lg flex items-center justify-center">
                          {!imageLoadErrors.has(currentIndex) ? (
                            <img
                              src={signImages[currentIndex].imageUrl}
                              alt={`Sign for ${signImages[currentIndex].letter}`}
                              className="w-full h-full object-contain"
                              onError={() => handleImageError(currentIndex)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-500">
                              <span className="text-white text-6xl font-bold">
                                {signImages[currentIndex].letter}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                          {signImages[currentIndex].letter}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Sign {currentIndex + 1} of {signImages.length}
                        </p>
                      </motion.div>
                    )}

                    {/* All signs grid (when not playing) */}
                    {!isPlaying && (
                      <div className="grid grid-cols-6 gap-3">
                        {signImages.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="text-center"
                          >
                            <div className="w-full aspect-square rounded-xl overflow-hidden bg-white shadow-md mb-2 flex items-center justify-center">
                              {!imageLoadErrors.has(index) ? (
                                <img
                                  src={item.imageUrl}
                                  alt={`Sign for ${item.letter}`}
                                  className="w-full h-full object-contain"
                                  onError={() => handleImageError(index)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-500">
                                  <span className="text-white text-2xl font-bold">
                                    {item.letter}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {item.letter}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px] text-slate-400">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Type text to see sign language images</p>
                    </div>
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
