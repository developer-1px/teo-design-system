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
      density="Compact"
      className="h-9 border-b border-border-default overflow-hidden"
    >
      <Block role="ScrollArea" orientation="horizontal" className="h-full">
        <Block role="Tabs" layout="inline" className="h-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Action
                key={tab.id}
                role="Button"
                prominence={isActive ? 'Standard' : 'Subtle'}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  'h-full px-4 rounded-none border-r border-border-muted flex items-center gap-2 group',
                  isActive && 'bg-surface-raised'
                )}
              >
                <Block role="Inline" layout="inline" className="gap-2">
                  <span className="text-text-tertiary">{getIcon(tab.type)}</span>
                  <Text
                    role="Body"
                    size="xs"
                    prominence={isActive ? 'Standard' : 'Subtle'}
                    className="truncate max-w-[120px]"
                    content={tab.name}
                  />
                  {tab.isDirty && (
                    <Text role="Badge" className="w-1.5 h-1.5 rounded-full bg-accent" content="" />
                  )}
                </Block>
                <Action
                  role="IconButton"
                  icon="X"
                  label="Close"
                  density="Compact"
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleCloseTab(tab.id, e)}
                />
              </Action>
            );
          })}
        </Block>
      </Block>
    </Section>
  );
};
