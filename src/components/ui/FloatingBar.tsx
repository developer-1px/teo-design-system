/**
 * FloatingBar - Minimal dev tools bar
 */

import { useState } from 'react';
import { Layer } from './Layer';
import { cn } from '@/lib/utils';
import { useApp, APP_CONFIGS } from '@/lib/app-context';
import { Moon, Sun } from 'lucide-react';

export const FloatingBar = () => {
  const { currentApp, setApp } = useApp();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <Layer level={6} rounded="full" className="flex items-center gap-0.5 px-2 py-1">
        {/* App Types */}
        {Object.values(APP_CONFIGS).map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.type}
              onClick={() => setApp(app.type)}
              className={cn(
                "p-1.5 rounded-full transition-all",
                currentApp === app.type
                  ? "bg-accent text-white"
                  : "text-text-tertiary hover:text-text hover:bg-layer-5"
              )}
              title={app.name}
            >
              <Icon size={16} />
            </button>
          );
        })}

        <div className="w-px h-4 bg-border mx-0.5" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 hover:bg-layer-5 rounded-full transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-text-tertiary" />
          ) : (
            <Moon size={16} className="text-text-tertiary" />
          )}
        </button>
      </Layer>
    </div>
  );
};