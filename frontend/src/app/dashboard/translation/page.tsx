'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Video, Mic, Maximize2, Minimize2, Save, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslationStore } from '@/store/translation-store';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';

export default function TranslationStudioPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [gestureHistory, setGestureHistory] = useState<string[]>([]);
  const [lastGesture, setLastGesture] = useState<string>('');
  const [gestureCooldown, setGestureCooldown] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [manualInputText, setManualInputText] = useState('');
  const [signGestures, setSignGestures] = useState<string[]>([]);
  const { currentTranslation, isTranslating, setCurrentTranslation, setTranslating, setConfidenceScore } = useTranslationStore();
  const { fullscreenMode, setFullscreenMode } = useUIStore();
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const handsRef = useRef<any>(null);
  const landmarksRef = useRef<any[]>([]);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    // Load MediaPipe Hands via CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.Hands) {
        // @ts-ignore
        handsRef.current = new window.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        handsRef.current.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        handsRef.current.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            landmarksRef.current = results.multiHandLandmarks[0];
          }
        });
      }
    };
    document.body.appendChild(script);

    // Load voices for speech synthesis
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        voicesRef.current = window.speechSynthesis.getVoices();
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (handsRef.current) {
        handsRef.current.close();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isCameraOn && videoRef.current) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOn, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setVoiceInputText(finalTranscript);
          convertTextToSign(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  const convertTextToSign = (text: string) => {
    // Word to gesture mapping
    const wordToGesture: { [key: string]: string } = {
      'hello': 'hello',
      'hi': 'hello',
      'thank': 'thank you',
      'thanks': 'thank you',
      'please': 'please',
      'yes': 'yes',
      'yeah': 'yes',
      'no': 'no',
      'help': 'help',
      'sorry': 'sorry',
      'good': 'good',
      'bad': 'bad',
      'love': 'love',
      'buy': 'buy',
      'sell': 'sell',
      'shop': 'shop',
      'work': 'work',
      'home': 'home',
      'school': 'school',
      'family': 'family',
      'friend': 'friend',
      'happy': 'happy',
      'sad': 'sad',
      'angry': 'angry',
      'tired': 'tired',
      'hungry': 'hungry',
      'thirsty': 'thirsty',
      'cold': 'cold',
      'hot': 'hot',
      'phone': 'phone',
      'email': 'email',
      'internet': 'internet',
      'computer': 'computer',
      'car': 'car',
      'bus': 'bus',
      'train': 'train',
      'airplane': 'airplane',
      'doctor': 'doctor',
      'hospital': 'hospital',
      'medicine': 'medicine',
      'pain': 'pain',
      'better': 'better',
      'worse': 'worse',
      'one': 'one',
      'two': 'two',
      'three': 'three',
      'four': 'four',
      'five': 'five',
      'six': 'six',
      'seven': 'seven',
      'eight': 'eight',
      'nine': 'nine',
      'ten': 'ten',
      'stop': 'stop',
      'go': 'go away',
      'come': 'come here',
      'eat': 'eat',
      'drink': 'drink',
      'sleep': 'sleep',
      'listen': 'listen',
      'look': 'look',
      'walk': 'walk',
      'run': 'run',
      'sit': 'sit',
      'stand': 'stand',
      'time': 'time',
      'money': 'money',
      'quiet': 'quiet',
      'wave': 'wave',
      'clap': 'clap',
      'rock': 'rock',
      'call': 'call me',
    };

    // Split text into words and convert to gestures
    const words = text.toLowerCase().split(/\s+/);
    const gestures = words.map(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
      return wordToGesture[cleanWord] || cleanWord; // Return gesture or original word if not found
    }).filter(gesture => gesture);

    setSignGestures(gestures);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setManualInputText(text);
    if (text.trim()) {
      convertTextToSign(text);
    } else {
      setSignGestures([]);
    }
  };

  const clearManualInput = () => {
    setManualInputText('');
    setSignGestures([]);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setTranslating(true);
        
        // Process frames with MediaPipe
        const processFrame = async () => {
          if (videoRef.current && handsRef.current && isCameraOn) {
            await handsRef.current.send({ image: videoRef.current });
            requestAnimationFrame(processFrame);
          }
        };
        processFrame();
        
        // Call backend API for gesture prediction with actual landmarks
        intervalRef.current = setInterval(async () => {
          try {
            if (landmarksRef.current.length > 0 && !gestureCooldown) {
              const response = await api.ai.predict({ landmarks: landmarksRef.current });
              if (response.confidence > 0.7) {
                // Only update if gesture changed (avoid repeating same gesture)
                if (response.gesture !== lastGesture) {
                  setLastGesture(response.gesture);
                  setGestureHistory(prev => [...prev, response.gesture]);
                  setCurrentTranslation(response.gesture);
                  setConfidenceScore(response.confidence);
                  setConfidence(response.confidence);

                  // Auto-speak if enabled
                  if (autoSpeak) {
                    speakText(response.gesture);
                  }

                  // Set cooldown to prevent rapid repeated gestures (reduced for faster response)
                  setGestureCooldown(true);
                  cooldownRef.current = setTimeout(() => {
                    setGestureCooldown(false);
                  }, 1000);
                }
              } else {
                // Clear lastGesture when confidence drops, allowing gesture to be detected again
                if (lastGesture) {
                  setLastGesture('');
                }
              }
            }
          } catch (error) {
            console.error('Error predicting gesture:', error);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setTranslating(false);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
      cooldownRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
    landmarksRef.current = [];
    setGestureHistory([]);
    setLastGesture('');
    setCurrentTranslation('');
    setConfidence(0);
    setGestureCooldown(false);
    setTranslating(false);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleFullscreen = () => {
    setFullscreenMode(!fullscreenMode);
    if (!fullscreenMode) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const saveTranslation = async () => {
    try {
      await api.translations.create({
        inputType: 'sign-to-text',
        inputContent: 'Hand gesture',
        translatedText: currentTranslation,
        confidenceScore: confidence,
      });
      alert('Translation saved!');
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const preprocessText = (text: string): string => {
    // Capitalize first letter for better pronunciation
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    const processedText = preprocessText(text);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(processedText);
    
    // Optimize speech parameters for natural real-time speech
    utterance.rate = 1.0; // Normal speed for real-time
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1.0; // Full volume
    
    // Select best available voice
    const voices = voicesRef.current;
    let preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
    );
    
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => voice.lang.startsWith('en-US'));
    }
    
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => voice.lang.startsWith('en'));
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Track speaking state
    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    if (currentTranslation) {
      speakText(currentTranslation);
    }
  };

  return (
    <div className={fullscreenMode ? 'fixed inset-0 z-50 bg-slate-900 p-6' : 'space-y-6'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Translation Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Real-time sign language to text translation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFullscreen}>
            {fullscreenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <div className="text-center text-white">
                      <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera is off</p>
                      <p className="text-sm text-slate-400">Click to start translation</p>
                    </div>
                  </div>
                )}
                {isTranslating && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Live
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={toggleCamera}
                  className="flex-1"
                  variant={isCameraOn ? 'secondary' : 'primary'}
                >
                  {isCameraOn ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                  {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Translation Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Translation Output
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 min-h-[200px]">
                {currentTranslation ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                      {currentTranslation}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence * 100}%` }}
                          className="bg-blue-600 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {Math.round(confidence * 100)}%
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <p className="text-lg">Start the camera to begin translation</p>
                  </div>
                )}
              </div>

              {/* Gesture History */}
              {gestureHistory.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Gesture Sequence:</p>
                  <div className="flex flex-wrap gap-2">
                    {gestureHistory.map((gesture, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                      >
                        {gesture}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setGestureHistory([]);
                      setLastGesture('');
                    }}
                    className="mt-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Clear history
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Auto-speak translations
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSpeak}
                  disabled={!currentTranslation}
                  variant="outline"
                  className="flex-1"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Speak Translation
                </Button>
                <Button
                  onClick={saveTranslation}
                  disabled={!currentTranslation}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Translation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Text to Sign Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Text to Sign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Input */}
            <div className="flex gap-2">
              <Button
                onClick={toggleVoiceInput}
                variant={isListening ? 'secondary' : 'outline'}
                className="flex-1"
              >
                <Mic className="w-4 h-4 mr-2" />
                {isListening ? 'Stop Voice Input' : 'Start Voice Input'}
              </Button>
            </div>
            {isListening && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <p className="text-slate-600 dark:text-slate-300">Listening... Speak now</p>
              </div>
            )}
            
            {voiceInputText && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Recognized Text:</p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">{voiceInputText}</p>
              </div>
            )}

            {/* Manual Text Input */}
            <div className="space-y-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Or type text manually:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInputText}
                  onChange={handleManualInputChange}
                  placeholder="Type text to convert to sign language..."
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {manualInputText && (
                  <Button
                    onClick={clearManualInput}
                    variant="outline"
                    size="sm"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>

            {/* Sign Gestures Display */}
            {signGestures.length > 0 && (
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Sign Language Gestures:</p>
                <div className="flex flex-wrap gap-2">
                  {signGestures.map((gesture, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-lg text-lg font-bold"
                    >
                      {gesture}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
