import { useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Package,
  Settings,
  Bug,
  Play,
  Palette,
  Server,
  Presentation,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

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
    <div className="flex flex-col gap-0.5 p-1.5">
      <IconButton
        size="md"
        active={activeView === 'files'}
        onClick={() => handleViewChange('files')}
        title="Files"
      >
        <Files size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'search'}
        onClick={() => handleViewChange('search')}
        title="Search"
      >
        <Search size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'git'}
        onClick={() => handleViewChange('git')}
        title="Source Control"
      >
        <GitBranch size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'debug'}
        onClick={() => handleViewChange('debug')}
        title="Debug"
      >
        <Bug size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'extensions'}
        onClick={() => handleViewChange('extensions')}
        title="Extensions"
      >
        <Package size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'run'}
        onClick={() => handleViewChange('run')}
        title="Run & Deploy"
      >
        <Play size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'tokens'}
        onClick={() => handleViewChange('tokens')}
        title="Design Tokens"
      >
        <Palette size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'servers'}
        onClick={() => handleViewChange('servers')}
        title="JSON Viewer"
      >
        <Server size={20} />
      </IconButton>

      <IconButton
        size="md"
        active={activeView === 'presentation'}
        onClick={() => handleViewChange('presentation')}
        title="Presentation"
      >
        <Presentation size={20} />
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
    </div>
  );
};
