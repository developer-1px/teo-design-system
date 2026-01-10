/**
 * App Context - 앱 타입 전환 및 관리 (Wouter 기반)
 */

import {
  Beaker,
  Blocks,
  BookOpen,
  Boxes,
  Code,
  FileBox,
  FileText,
  FormInput,
  Layout,
  LayoutGrid,
  Layers,
  Palette,
  Presentation,
  Smile,
  Type,
  Zap,
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
  | 'layout'
  | 'page'
  | 'section'
  | 'overlay'
  | 'group'
  | 'field'
  | 'action'
  | 'text';

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
  page: {
    type: 'page',
    name: 'Page',
    icon: FileBox,
    iconName: 'FileBox',
    description: 'Page Component Showcase (role, layout)',
    accentColor: '#059669',
    colorScheme: 'emerald',
  },
  section: {
    type: 'section',
    name: 'Section',
    icon: Layout,
    iconName: 'Layout',
    description: 'Section Component Showcase (gridArea, resizable)',
    accentColor: '#3b82f6',
    colorScheme: 'blue',
  },
  overlay: {
    type: 'overlay',
    name: 'Overlay',
    icon: Layers,
    iconName: 'Layers',
    description: 'Overlay Component Showcase (Dialog, Drawer, Popover)',
    accentColor: '#8b5cf6',
    colorScheme: 'purple',
  },
  group: {
    type: 'group',
    name: 'Group',
    icon: Boxes,
    iconName: 'Boxes',
    description: 'Group Component Showcase (Card, Toolbar, List)',
    accentColor: '#f59e0b',
    colorScheme: 'orange',
  },
  field: {
    type: 'field',
    name: 'Field',
    icon: FormInput,
    iconName: 'FormInput',
    description: 'Field Component Showcase (21 dataTypes, validation)',
    accentColor: '#059669',
    colorScheme: 'emerald',
  },
  action: {
    type: 'action',
    name: 'Action',
    icon: Zap,
    iconName: 'Zap',
    description: 'Action Component Showcase (Button, IconButton, Link)',
    accentColor: '#ef4444',
    colorScheme: 'red',
  },
  text: {
    type: 'text',
    name: 'Text',
    icon: Type,
    iconName: 'Type',
    description: 'Text Component Showcase (Title, Body, Label, Code)',
    accentColor: '#3b82f6',
    colorScheme: 'blue',
  },

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
