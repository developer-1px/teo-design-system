import { FileCode, FileJson, FileType, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/types/Atom/Action/role/Button';
import { Section } from '@/components/types/Section/Section.tsx';
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
    <Section role="Header" density="Compact" className="flex items-center overflow-x-auto gap-0 p-0 h-9 border-b border-border-default">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn('gap-2 px-4 py-0 text-xs h-full rounded-none border-r border-border-muted group whitespace-nowrap', {
            'bg-surface-raised text-text font-medium': activeTab === tab.id,
            'text-text-secondary hover:bg-surface-hover': activeTab !== tab.id,
          })}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className="text-text-tertiary">{getIcon(tab.type)}</span>
          <span className="truncate max-w-[120px]">{tab.name}</span>
          {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-accent ml-1" />}
          <Button
            variant="ghost"
            onClick={(e) => handleCloseTab(tab.id, e)}
            className="ml-2 opacity-0 group-hover:opacity-100 h-5 w-5 p-0 hover:bg-black/10 dark:hover:bg-white/10 rounded-sm transition-all"
          >
            <X size={12} />
          </Button>
        </Button>
      ))}
    </Section>
  );
};
