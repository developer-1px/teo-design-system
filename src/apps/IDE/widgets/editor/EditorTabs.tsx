import { Frame } from '@/components/dsl/shared/Frame';
import { FileCode, FileJson, FileType } from 'lucide-react';
import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

interface Tab {
  id: string;
  name: string;
  path: string;
  type: 'code' | 'json' | 'text';
  isDirty?: boolean;
}

interface EditorTabsProps {
  onTabChange?: (tabId: string) => void;
}

export const EditorTabs = ({ onTabChange }: EditorTabsProps) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', name: 'App.tsx', path: 'src/App.tsx', type: 'code', isDirty: true },
    { id: '2', name: 'layer.tsx', path: 'src/components/ui/layer.tsx', type: 'code' },
    { id: '3', name: 'package.json', path: 'package.json', type: 'json' },
  ]);
  const [activeTab, setActiveTab] = useState('1');

  const getIcon = (type: Tab['type']) => {
    switch (type) {
      case 'code':
        return <FileCode size={16} />;
      case 'json':
        return <FileJson size={16} />;
      case 'text':
        return <FileType size={16} />;
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(tabs.filter((t) => t.id !== tabId));
    if (activeTab === tabId && tabs.length > 1) {
      const currentIndex = tabs.findIndex((t) => t.id === tabId);
      const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1];
      if (nextTab) setActiveTab(nextTab.id);
    }
  };

  return (
    <Section
      role="Header"
      className="h-[35px] border-b border-border-muted bg-surface-sunken overflow-hidden shrink-0 flex items-center"
    >
      <div className="flex h-full items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative h-full px-4 border-r border-border-muted flex items-center gap-2 group cursor-pointer transition-colors select-none",
                isActive ? "bg-surface text-text" : "bg-transparent text-muted hover:bg-hover"
              )}
            >
              {/* Active Tab Top Indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-primary" />
              )}

              <span className={cn("opacity-70", isActive ? "text-primary" : "text-subtle")}>
                {getIcon(tab.type)}
              </span>

              <span className={cn("text-[13px] truncate max-w-[120px]", isActive ? "opacity-100" : "opacity-60")}>
                {tab.name}
              </span>

              {tab.isDirty && !isActive && (
                <div className="w-2 h-2 rounded-full border border-border-muted ml-1" />
              )}

              <Action
                role="IconButton"
                icon="X"
                size="xs"
                onClick={(e) => handleCloseTab(tab.id, e)}
                className={cn(
                  "ml-2 rounded p-0.5 hover:bg-hover transition-all",
                  isActive ? "opacity-80" : "opacity-0 group-hover:opacity-60"
                )}
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
};
