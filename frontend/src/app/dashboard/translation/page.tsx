'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Video, Mic, Maximize2, Minimize2, Save, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslationStore } from '@/store/translation-store';
import { useUIStore } from '@/store/ui-store';
import { api } from '@/lib/api';

export default function TranslationStudioPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [gestureHistory, setGestureHistory] = useState<string[]>([]);
  const [lastGesture, setLastGesture] = useState<string>('');
  const [gestureCooldown, setGestureCooldown] = useState(false);
  const { currentTranslation, isTranslating, setCurrentTranslation, setTranslating, setConfidenceScore } = useTranslationStore();
  const { fullscreenMode, setFullscreenMode } = useUIStore();
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const handsRef = useRef<any>(null);
  const landmarksRef = useRef<any[]>([]);

  useEffect(() => {
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

    return () => {
      if (handsRef.current) {
        handsRef.current.close();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

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
                  
                  // Set cooldown to prevent rapid repeated gestures
                  setGestureCooldown(true);
                  cooldownRef.current = setTimeout(() => {
                    setGestureCooldown(false);
                  }, 2000);
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

              <div className="flex gap-2">
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

      {/* Voice Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsListening(!isListening)}
                variant={isListening ? 'secondary' : 'outline'}
                className="flex-1"
              >
                <Mic className="w-4 h-4 mr-2" />
                {isListening ? 'Stop Listening' : 'Start Voice Input'}
              </Button>
            </div>
            {isListening && (
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-center">
                Listening... Speak now
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
