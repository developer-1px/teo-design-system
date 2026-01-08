/**
 * App Context - 앱 타입 전환 및 관리
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Code, Presentation, FileText, Palette, Target, Calendar } from 'lucide-react';

export type AppType = 'ide' | 'ppt' | 'notion' | 'figma' | 'linear' | 'calendar';

import type { LucideIcon } from 'lucide-react';

export interface AppConfig {
  type: AppType;
  name: string;
  icon: LucideIcon;
  description: string;
  accentColor: string;
  colorScheme: 'emerald' | 'blue' | 'purple' | 'red' | 'orange' | 'pink';
}

export const APP_CONFIGS: Record<AppType, AppConfig> = {
  ide: {
    type: 'ide',
    name: 'IDE',
    icon: Code,
    description: 'Code Editor & Development',
    accentColor: '#059669',
    colorScheme: 'emerald',
  },
  ppt: {
    type: 'ppt',
    name: 'PPT',
    icon: Presentation,
    description: 'Slide Deck & Presentations',
    accentColor: '#3b82f6',
    colorScheme: 'blue',
  },
  notion: {
    type: 'notion',
    name: 'Notion',
    icon: FileText,
    description: 'Notes & Documentation',
    accentColor: '#000000',
    colorScheme: 'purple',
  },
  figma: {
    type: 'figma',
    name: 'Design',
    icon: Palette,
    description: 'Design & Prototyping',
    accentColor: '#a855f7',
    colorScheme: 'purple',
  },
  linear: {
    type: 'linear',
    name: 'Linear',
    icon: Target,
    description: 'Issue Tracking',
    accentColor: '#3b82f6',
    colorScheme: 'blue',
  },
  calendar: {
    type: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    description: 'Schedule & Events',
    accentColor: '#ef4444',
    colorScheme: 'red',
  },
};

interface AppContextType {
  currentApp: AppType;
  config: AppConfig;
  setApp: (app: AppType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentApp, setCurrentApp] = useState<AppType>('ide');

  const config = APP_CONFIGS[currentApp];

  const setApp = (app: AppType) => {
    setCurrentApp(app);

    // Update document attributes for theming
    document.documentElement.setAttribute('data-app-type', app);
    document.documentElement.setAttribute('data-color-scheme', config.colorScheme);

    // Save to localStorage
    localStorage.setItem('app-type', app);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('app-type') as AppType;
    if (saved && APP_CONFIGS[saved]) {
      setApp(saved);
    }
  }, []);

  return (
    <AppContext.Provider value={{ currentApp, config, setApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};