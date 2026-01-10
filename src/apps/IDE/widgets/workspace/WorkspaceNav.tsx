import { useState } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';

interface WorkspaceNavProps {
  onViewChange?: (view: string) => void;
}

export const WorkspaceNav = ({ onViewChange }: WorkspaceNavProps) => {
  const [activeView, setActiveView] = useState('files');

  const handleViewChange = (view: string) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  return (
    <Block role="Navigator" padding="xs" gap="xs">
      <Action
        role="IconButton"
        icon="Files"
        label="Files"
        selected={activeView === 'files'}
        onClick={() => handleViewChange('files')}
      />

      <Action
        role="IconButton"
        icon="Search"
        label="Search"
        selected={activeView === 'search'}
        onClick={() => handleViewChange('search')}
      />

      <Action
        role="IconButton"
        icon="GitBranch"
        label="Source Control"
        selected={activeView === 'git'}
        onClick={() => handleViewChange('git')}
      />

      <Action
        role="IconButton"
        icon="Bug"
        label="Debug"
        selected={activeView === 'debug'}
        onClick={() => handleViewChange('debug')}
      />

      <Action
        role="IconButton"
        icon="Package"
        label="Extensions"
        selected={activeView === 'extensions'}
        onClick={() => handleViewChange('extensions')}
      />

      <Action
        role="IconButton"
        icon="Play"
        label="Run & Deploy"
        selected={activeView === 'run'}
        onClick={() => handleViewChange('run')}
      />

      <Action
        role="IconButton"
        icon="Palette"
        label="Design Tokens"
        selected={activeView === 'tokens'}
        onClick={() => handleViewChange('tokens')}
      />

      <Action
        role="IconButton"
        icon="Server"
        label="JSON Viewer"
        selected={activeView === 'servers'}
        onClick={() => handleViewChange('servers')}
      />

      <Action
        role="IconButton"
        icon="Presentation"
        label="Presentation"
        selected={activeView === 'presentation'}
        onClick={() => handleViewChange('presentation')}
      />

      <Block role="Spacer" flex="1" />

      <Action
        role="IconButton"
        icon="Settings"
        label="Settings"
        selected={activeView === 'settings'}
        onClick={() => handleViewChange('settings')}
      />
    </Block>
  );
};
