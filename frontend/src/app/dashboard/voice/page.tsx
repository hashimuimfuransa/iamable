'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Save, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function VoiceToSignPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentSign, setCurrentSign] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          convertToSign(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const convertToSign = (text: string) => {
    const words = text.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord) {
      setCurrentSign(lastWord);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setCurrentSign('');
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSave = async () => {
    if (!transcript.trim()) return;
    
    try {
      await api.translations.create({
        inputType: 'voice-to-sign',
        inputContent: transcript,
        translatedText: 'Sign language representation',
        confidenceScore: 0.92,
      });
      alert('Translation saved!');
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
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
          Voice to Sign Language
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Convert spoken words into sign language using speech recognition
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
                <motion.button
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 text-white scale-110'
                      : 'bg-blue-600 text-white hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                </motion.button>
              </div>

              {isListening && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                </div>
              )}

              <div className="min-h-[120px] p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300">
                  {transcript || 'Start speaking to see your words converted to sign language...'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleSpeak}
                  variant="outline"
                  disabled={!transcript}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Speak
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!transcript}
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
                <Mic className="w-5 h-5" />
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
                    <Mic className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Start speaking to see sign language</p>
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
