import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';

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
    <Block role="Navigator">
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

      <Block role="Spacer" flex="1" />

      <Action
        role="IconButton"
        icon="Settings"
        label="Settings"
        selected={activeView === 'settings'}
        onClick={() => handleViewChange('settings')}
      />

      {onClose && <Action role="IconButton" icon="X" label="Close Sidebar" onClick={onClose} />}
    </Block>
  );
};
