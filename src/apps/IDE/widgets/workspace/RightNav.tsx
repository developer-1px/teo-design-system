import { useState } from 'react';
import { Action } from '@/components/types/Atom/Action/Action.tsx';

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
      <Action
        role="IconButton"
        icon="Sparkles"
        label="AI Assistant"
        selected={activeView === 'ai'}
        onClick={() => handleViewChange('ai')}
      />

      <Action
        role="IconButton"
        icon="GitBranch"
        label="Git Info"
        selected={activeView === 'git'}
        onClick={() => handleViewChange('git')}
      />

      <Action
        role="IconButton"
        icon="Info"
        label="Project Info"
        selected={activeView === 'info'}
        onClick={() => handleViewChange('info')}
      />

      <div className="flex-1" />

      <Action
        role="IconButton"
        icon="Settings"
        label="Settings"
        selected={activeView === 'settings'}
        onClick={() => handleViewChange('settings')}
      />

      {onClose && (
        <Action
          role="IconButton"
          icon="X"
          label="Close Sidebar"
          onClick={onClose}
        />
      )}
    </div>
  );
};
