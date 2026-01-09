import { useState } from 'react';
import { X, FileCode, FileJson, FileType } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Section } from '@/components/dsl/Section';
import { Button } from '@/components/ui';

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
    <Section role="Container" prominence="Secondary" className="flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn(
            'gap-1.5 px-3 py-2 text-sm h-auto rounded-none group',
            {
              'bg-layer-3 hover:bg-layer-3': activeTab === tab.id,
              'text-text': activeTab === tab.id,
              'text-text-secondary': activeTab !== tab.id,
            }
          )}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className="text-text-tertiary">{getIcon(tab.type)}</span>
          <span className="truncate max-w-[120px]">{tab.name}</span>
          {tab.isDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          )}
          <Button
            variant="ghost"
            onClick={(e) => handleCloseTab(tab.id, e)}
            className="opacity-0 group-hover:opacity-100 h-auto p-0.5"
          >
            <X size={14} />
          </Button>
        </Button>
      ))}
    </Section>
  );
};
