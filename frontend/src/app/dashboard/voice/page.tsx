'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, MicOff, Save, Volume2, RotateCcw, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

export default function VoiceToSignPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentSign, setCurrentSign] = useState('');
  const [signImages, setSignImages] = useState<{ letter: string; imageUrl: string }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [recognitionStatus, setRecognitionStatus] = useState<'idle' | 'starting' | 'listening' | 'error'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('rw-RW');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isHydrated]);

  const convertToSign = (text: string) => {
    console.log('convertToSign called with:', text);
    const words = text.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord) {
      setCurrentSign(lastWord);
    }
    
    // Generate sign images for the full text in real-time
    if (text.trim()) {
      const letters = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split('');
      console.log('Letters:', letters);
      const images = letters.map(letter => ({
        letter: letter.toUpperCase(),
        imageUrl: getSignImageUrl(letter)
      })).filter(item => item.imageUrl);
      console.log('Sign images generated:', images.length, 'images');
      setSignImages(images);
      setImageLoadErrors(new Set());
    } else {
      console.log('Text is empty, clearing sign images');
      setSignImages([]);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for browser support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('Speech recognition is not supported in this browser');
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setRecognitionStatus('listening');
      };

      recognition.onresult = (event: any) => {
        console.log('Speech recognition result received');
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log('Transcript:', transcript, 'isFinal:', event.results[i].isFinal);
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        // Convert to sign in real-time for both interim and final results
        const textToConvert = finalTranscript || interimTranscript;
        if (textToConvert) {
          convertToSign(textToConvert.trim());
        }
      };

      recognition.onerror = (event: any) => {
        // Ignore no-speech errors as they're normal when user isn't speaking
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing to listen...');
          return;
        }
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionStatus('error');
          alert('Microphone access denied. Please allow microphone access in your browser settings and refresh the page.');
        } else {
          setRecognitionStatus('error');
        }
        setIsListening(false);
        isListeningRef.current = false;
      };

      recognition.onend = () => {
        console.log('Speech recognition ended, isListeningRef.current:', isListeningRef.current);
        // Restart recognition if we're supposed to be listening
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            setIsListening(false);
            isListeningRef.current = false;
          }
        }
      };

      recognitionRef.current = recognition;
      console.log('Speech recognition initialized');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  if (!isHydrated) {
    return null;
  }

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      isListeningRef.current = false;
      setRecognitionStatus('idle');
      setAudioLevel(0);
      
      // Stop audio monitoring
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    } else {
      setRecognitionStatus('starting');
      
      // Request microphone permission first
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          console.log('Microphone access granted');
          
          // Set up audio level monitoring
          const audioContext = new AudioContext();
          audioContextRef.current = audioContext;
          const analyser = audioContext.createAnalyser();
          analyserRef.current = analyser;
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.fftSize = 256;
          
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          const updateAudioLevel = () => {
            if (!isListeningRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average);
            requestAnimationFrame(updateAudioLevel);
          };
          
          updateAudioLevel();
        }
      } catch (error) {
        console.error('Microphone access denied:', error);
        setRecognitionStatus('error');
        alert('Microphone access denied. Please allow microphone access in your browser settings and refresh the page.');
        return;
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
      } catch (error) {
        console.error('Error starting recognition:', error);
        setRecognitionStatus('error');
        alert('Failed to start speech recognition. Please check your microphone permissions and try again.');
      }
    }
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => new Set(prev).add(index));
  };

  const handleConvert = () => {
    if (!transcript.trim() || signImages.length === 0) return;
    
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
    setTranscript('');
    setCurrentSign('');
    setSignImages([]);
    setIsPlaying(false);
    setCurrentIndex(0);
    setImageLoadErrors(new Set());
    setIsListening(false);
    isListeningRef.current = false;
    setRecognitionStatus('idle');
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

              {recognitionStatus !== 'idle' && (
                <div className="text-center space-y-2">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    recognitionStatus === 'listening' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : recognitionStatus === 'starting'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      recognitionStatus === 'listening' ? 'bg-blue-600 animate-pulse' :
                      recognitionStatus === 'starting' ? 'bg-yellow-600 animate-pulse' :
                      'bg-red-600'
                    }`} />
                    <span className="text-sm font-medium">
                      {recognitionStatus === 'listening' ? 'Listening...' :
                       recognitionStatus === 'starting' ? 'Starting...' :
                       'Error - Check microphone permissions'}
                    </span>
                  </div>
                  
                  {recognitionStatus === 'listening' && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Mic Level:</span>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-100"
                          style={{ width: `${Math.min(audioLevel / 2, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-8">
                        {Math.round(audioLevel)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-slate-600 dark:text-slate-300">Language:</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rw-RW">Kinyarwanda</option>
                  <option value="en-US">English</option>
                  <option value="fr-FR">French</option>
                </select>
              </div>

              <div className="min-h-[120px] p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300">
                  {transcript || 'Start speaking to see your words converted to sign language...'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleConvert}
                  disabled={!transcript.trim() || isPlaying}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Playing...' : 'Play Signs'}
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
                  disabled={!transcript}
                  className="flex-1"
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
                      <p className="text-lg">Start speaking to see sign language images</p>
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
