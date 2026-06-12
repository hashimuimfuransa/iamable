'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Text, Zap, Keyboard, Monitor, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAccessibilityStore } from '@/store/accessibility-store';

export const AccessibilityToolbar = () => {
  const { preferences, togglePreference, resetPreferences } = useAccessibilityStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const settings = [
    {
      key: 'largeText' as const,
      icon: <Text className="w-5 h-5" />,
      label: 'Large Text',
      description: 'Increase text size for better readability',
    },
    {
      key: 'highContrast' as const,
      icon: <Eye className="w-5 h-5" />,
      label: 'High Contrast',
      description: 'Enhance contrast for better visibility',
    },
    {
      key: 'reducedMotion' as const,
      icon: <Zap className="w-5 h-5" />,
      label: 'Reduced Motion',
      description: 'Minimize animations for comfort',
    },
    {
      key: 'keyboardNavigation' as const,
      icon: <Keyboard className="w-5 h-5" />,
      label: 'Keyboard Navigation',
      description: 'Enable keyboard shortcuts',
    },
    {
      key: 'screenReader' as const,
      icon: <Monitor className="w-5 h-5" />,
      label: 'Screen Reader',
      description: 'Optimize for screen readers',
    },
  ];

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Accessibility Settings"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Accessibility Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => togglePreference(setting.key)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      preferences[setting.key]
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    }`}>
                      {setting.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {setting.label}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {setting.description}
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      preferences[setting.key]
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        preferences[setting.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetPreferences}
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
