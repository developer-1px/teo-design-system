import { useState } from 'react';
import {
  Sparkles,
  GitBranch,
  Settings,
  Info,
  X,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

interface RightNavProps {
  onViewChange?: (view: string | null) => void;
  onClose?: () => void;
}

export const RightNav = ({ onViewChange, onClose }: RightNavProps) => {
  const [activeView, setActiveView] = useState<string | null>('ai');

  const handleViewChange = (view: string) => {
    const newView = activeView === view ? null : view;
    setActiveView(newView);
    onViewChange?.(newView);
  };

  return (
    <div className="flex flex-col gap-0.5 p-1.5">
      <IconButton
        size="md"
        active={activeView === 'ai'}
        onClick={() => handleViewChange('ai')}
        title="AI Assistant"
      >
        <Sparkles size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'git'}
        onClick={() => handleViewChange('git')}
        title="Git Info"
      >
        <GitBranch size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'info'}
        onClick={() => handleViewChange('info')}
        title="Project Info"
      >
        <Info size={20} />
      </IconButton>

      <div className="flex-1" />

      <IconButton
        size="md"
        active={activeView === 'settings'}
        onClick={() => handleViewChange('settings')}
        title="Settings"
      >
        <Settings size={20} />
      </IconButton>

      {onClose && (
        <IconButton
          size="md"
          onClick={onClose}
          title="Close Sidebar"
        >
          <X size={20} />
        </IconButton>
      )}
    </div>
  );
};
