/**
 * App Context - 앱 타입 전환 및 관리 (Wouter 기반)
 */

import {
  Beaker,
  Blocks,
  BookOpen,
  Code,
  FileText,
  LayoutGrid,
  Palette,
  Presentation,
  Smile,
} from 'lucide-react';
import { createContext, type ReactNode, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';

export type AppType =
  | 'ide'
  | 'ppt'
  | 'notion'
  | 'emoji'
  | 'design'
  | 'builder'
  | 'showcase'
  | 'tokens'
  | 'layout';

import type { LucideIcon } from 'lucide-react';

export interface AppConfig {
  type: AppType;
  name: string;
  icon: LucideIcon;
  iconName: string; // For IDDL Action component
  description: string;
  accentColor: string;
  colorScheme: 'emerald' | 'blue' | 'purple' | 'red' | 'orange' | 'pink';
}

export const APP_CONFIGS: Record<AppType, AppConfig> = {
  ide: {
    type: 'ide',
    name: 'IDE',
    icon: Code,
    iconName: 'Code',
    description: 'Code Editor & Development',
    accentColor: '#059669',
    colorScheme: 'emerald',
  },
  ppt: {
    type: 'ppt',
    name: 'PPT',
    icon: Presentation,
    iconName: 'Presentation',
    description: 'Slide Deck & Presentations',
    accentColor: '#3b82f6',
    colorScheme: 'blue',
  },
  notion: {
    type: 'notion',
    name: 'Notion',
    icon: FileText,
    iconName: 'FileText',
    description: 'Notes & Documentation',
    accentColor: '#000000',
    colorScheme: 'purple',
  },
  emoji: {
    type: 'emoji',
    name: 'Emoji',
    icon: Smile,
    iconName: 'Smile',
    description: 'Pixel Art Emoji Designer',
    accentColor: '#f59e0b',
    colorScheme: 'orange',
  },
  design: {
    type: 'design',
    name: 'Design System',
    icon: BookOpen,
    iconName: 'BookOpen',
    description: 'Docs, Components, DSL & Builder',
    accentColor: '#059669',
    colorScheme: 'emerald',
  },
  showcase: {
    type: 'showcase',
    name: 'Showcase',
    icon: Beaker,
    iconName: 'Beaker',
    description: 'Component Showcase & Testing',
    accentColor: '#ec4899',
    colorScheme: 'pink',
  },
  tokens: {
    type: 'tokens',
    name: 'Tokens',
    icon: Palette,
    iconName: 'Palette',
    description: 'Design Tokens & Theme System',
    accentColor: '#8b5cf6',
    colorScheme: 'purple',
  },
  builder: {
    type: 'builder',
    name: 'DSL Builder',
    icon: Blocks,
    iconName: 'Blocks',
    description: 'Visual DSL Layout Builder',
    accentColor: '#8b5cf6',
    colorScheme: 'purple',
  },
  layout: {
    type: 'layout',
    name: 'Layout Demo',
    icon: LayoutGrid,
    iconName: 'LayoutGrid',
    description: 'Page Template & Section Demo',
    accentColor: '#06b6d4',
    colorScheme: 'blue',
  },
};

interface AppContextType {
  currentApp: AppType;
  config: AppConfig;
  // setApp removed - use setLocation from wouter instead
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Note: This must be used inside Router context to access useLocation
  const [location] = useLocation();

  // Extract app type from URL path (예: "/ide" → "ide", "/" → "ide")
  const currentApp = (location.replace(/^\//, '') || 'ide') as AppType;
  const config = APP_CONFIGS[currentApp] || APP_CONFIGS.ide;

  // Update document attributes when route changes
  useEffect(() => {
    document.documentElement.setAttribute('data-app-type', currentApp);
    document.documentElement.setAttribute('data-color-scheme', config.colorScheme);
  }, [currentApp, config.colorScheme]);

  return <AppContext.Provider value={{ currentApp, config }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
