/**
 * TopToolbar - IntelliJ New UI Style (2024.2+)
 *
 * 구조:
 * [햄버거메뉴] [프로젝트위젯] [VCS위젯] [Run위젯] ... [패널토글] [설정]
 *
 * @see https://www.jetbrains.com/help/idea/new-ui.html
 */

import { Layer } from '@/components/ui/Layer';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ThemeToggleButton } from '@/components/ui/ThemeSwitcher';
import {
  Menu as MenuIcon,
  ChevronDown as ChevronDownIcon,
  GitBranch as GitBranchIcon,
  Play as PlayIcon,
  Settings as SettingsIcon,
  PanelBottom as PanelBottomIcon,
  PanelRightOpen as PanelRightOpenIcon,
  FolderOpen as FolderOpenIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from 'lucide-react';
import { useState } from 'react';

interface TopToolbarProps {
  projectName?: string;
  currentBranch?: string;
  onToggleRightSidebar?: () => void;
  showRightSidebar?: boolean;
  onOpenSettings?: () => void;
  onOpenSearch?: () => void;
}

export const TopToolbar = ({
  projectName = 'ide-ui-kit',
  currentBranch = 'main',
  onToggleRightSidebar,
  showRightSidebar,
  onOpenSettings,
  onOpenSearch,
}: TopToolbarProps) => {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showVcsMenu, setShowVcsMenu] = useState(false);
  const [showRunMenu, setShowRunMenu] = useState(false);

  return (
    <Layer level={4} className="flex h-10 items-center px-3 gap-2">
      {/* 1. Main Menu (Hamburger) */}
      <div className="relative">
        <IconButton
          size="sm"
          layer={4}
          onClick={() => setShowMainMenu(!showMainMenu)}
          onBlur={() => setTimeout(() => setShowMainMenu(false), 200)}
          title="Main Menu (Alt+\)"
        >
          <MenuIcon size={16} />
        </IconButton>

        {showMainMenu && (
          <Layer
            level={5}
            rounded="lg"
            className="absolute top-full left-0 mt-1 w-56 py-1 z-50"
          >
            <MainMenuContent />
          </Layer>
        )}
      </div>

      {/* 2. Project Widget */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowProjectMenu(!showProjectMenu)}
          onBlur={() => setTimeout(() => setShowProjectMenu(false), 200)}
        >
          <FolderOpenIcon size={16} />
          <span className="font-medium">{projectName}</span>
          <ChevronDownIcon size={16} />
        </Button>

        {showProjectMenu && (
          <Layer
            level={5}
            rounded="lg"
            className="absolute top-full left-0 mt-1 w-64 py-1 z-50"
          >
            <ProjectMenuContent />
          </Layer>
        )}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* 3. VCS Widget */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowVcsMenu(!showVcsMenu)}
          onBlur={() => setTimeout(() => setShowVcsMenu(false), 200)}
        >
          <GitBranchIcon size={16} />
          <span>{currentBranch}</span>
          <ChevronDownIcon size={16} />
        </Button>

        {showVcsMenu && (
          <Layer
            level={5}
            rounded="lg"
            className="absolute top-full left-0 mt-1 w-64 py-1 z-50"
          >
            <VcsMenuContent />
          </Layer>
        )}
      </div>

      {/* 4. Run Widget */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowRunMenu(!showRunMenu)}
          onBlur={() => setTimeout(() => setShowRunMenu(false), 200)}
        >
          <PlayIcon size={16} />
          <span>Run</span>
          <ChevronDownIcon size={16} />
        </Button>

        {showRunMenu && (
          <Layer
            level={5}
            rounded="lg"
            className="absolute top-full left-0 mt-1 w-64 py-1 z-50"
          >
            <RunMenuContent />
          </Layer>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side Actions */}
      <div className="flex items-center gap-1">
        {/* Panel Toggles */}
        {onToggleRightSidebar && (
          <IconButton
            size="sm"
            layer={4}
            active={showRightSidebar}
            onClick={onToggleRightSidebar}
            title="Toggle Right Sidebar"
          >
            <PanelRightOpenIcon size={16} />
          </IconButton>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* Settings */}
        <IconButton
          size="sm"
          layer={4}
          title="Settings (⌘,)"
          onClick={onOpenSettings}
        >
          <SettingsIcon size={16} />
        </IconButton>
      </div>
    </Layer>
  );
};

// ============================================================================
// Menu Contents
// ============================================================================

const MainMenuContent = () => {
  const menuItems = [
    { label: 'File', items: ['New...', 'Open...', 'Recent Projects', 'Close Project'] },
    { label: 'Edit', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
    { label: 'View', items: ['Tool Windows', 'Appearance', 'Quick Definition'] },
    { label: 'Navigate', items: ['Class...', 'File...', 'Symbol...', 'Recent Files'] },
    { label: 'Code', items: ['Generate...', 'Reformat Code', 'Optimize Imports'] },
    { label: 'Run', items: ['Run...', 'Debug...', 'Stop', 'Edit Configurations'] },
  ];

  return (
    <div className="py-1">
      {menuItems.map((menu) => (
        <div key={menu.label} className="px-2 py-1">
          <div className="text-xs font-semibold text-text-tertiary px-2 py-1">
            {menu.label}
          </div>
          {menu.items.map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-1.5 text-sm rounded-md layer-5-interactive"
            >
              {item}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

const ProjectMenuContent = () => {
  const recentProjects = [
    'ide-ui-kit',
    'design-system',
    'react-dashboard',
    'portfolio-2024',
  ];

  return (
    <div className="py-1">
      <button className="w-full text-left px-3 py-2 text-sm font-medium layer-5-interactive">
        New Project...
      </button>
      <button className="w-full text-left px-3 py-2 text-sm layer-5-interactive">
        Open...
      </button>
      <div className="h-px bg-border my-1" />
      <div className="px-2 py-1">
        <div className="text-xs font-semibold text-text-tertiary px-2 py-1">
          Recent Projects
        </div>
        {recentProjects.map((project) => (
          <button
            key={project}
            className="w-full text-left px-3 py-1.5 text-sm rounded layer-5-interactive"
          >
            {project}
          </button>
        ))}
      </div>
    </div>
  );
};

const VcsMenuContent = () => {
  return (
    <div className="py-1">
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm layer-5-interactive">
        <DownloadIcon size={16} />
        <span>Update Project</span>
        <span className="ml-auto text-xs text-text-tertiary">⌘T</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm layer-5-interactive">
        <UploadIcon size={16} />
        <span>Commit...</span>
        <span className="ml-auto text-xs text-text-tertiary">⌘K</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm layer-5-interactive">
        <UploadIcon size={16} />
        <span>Push...</span>
        <span className="ml-auto text-xs text-text-tertiary">⇧⌘K</span>
      </button>
      <div className="h-px bg-border my-1" />
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm layer-5-interactive">
        <GitBranchIcon size={16} />
        <span>Branches...</span>
      </button>
      <button className="w-full text-left px-3 py-2 text-sm layer-5-interactive">
        Fetch
      </button>
      <button className="w-full text-left px-3 py-2 text-sm layer-5-interactive">
        Pull...
      </button>
    </div>
  );
};

const RunMenuContent = () => {
  const configurations = [
    { name: 'dev', type: 'npm' },
    { name: 'build', type: 'npm' },
    { name: 'test', type: 'npm' },
  ];

  return (
    <div className="py-1">
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium layer-5-interactive">
        <PlayIcon size={16} />
        <span>Run 'dev'</span>
        <span className="ml-auto text-xs text-text-tertiary">⌃R</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm layer-5-interactive">
        <span className="text-accent">▶</span>
        <span>Debug 'dev'</span>
        <span className="ml-auto text-xs text-text-tertiary">⌃D</span>
      </button>
      <div className="h-px bg-border my-1" />
      <div className="px-2 py-1">
        <div className="text-xs font-semibold text-text-tertiary px-2 py-1">
          Configurations
        </div>
        {configurations.map((config) => (
          <button
            key={config.name}
            className="w-full text-left px-3 py-1.5 text-sm rounded layer-5-interactive"
          >
            <div className="flex items-center gap-2">
              <PlayIcon size={14} />
              <span>{config.name}</span>
              <span className="text-xs text-text-tertiary ml-auto">{config.type}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="h-px bg-border my-1" />
      <button className="w-full text-left px-3 py-2 text-sm layer-5-interactive">
        Edit Configurations...
      </button>
    </div>
  );
};
