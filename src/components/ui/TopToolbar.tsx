/**
 * TopToolbar - IntelliJ New UI Style (2024.2+)
 *
 * 구조:
 * [햄버거메뉴] [프로젝트위젯] [VCS위젯] [Run위젯] ... [패널토글] [설정]
 *
 * @see https://www.jetbrains.com/help/idea/new-ui.html
 */

import { Section } from '@/components/dsl/Section';
import { IconButton } from '@/components/ui';
import { Button } from '@/components/ui';
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
    <Section role="Header" prominence="Hero" className="flex h-10 items-center px-3 gap-2">
      {/* 1. Main Menu (Hamburger) */}
      <div className="relative">
        <IconButton
          size="sm"
         
          onClick={() => setShowMainMenu(!showMainMenu)}
          onBlur={() => setTimeout(() => setShowMainMenu(false), 200)}
          title="Main Menu (Alt+\)"
        >
          <MenuIcon size={16} />
        </IconButton>

        {showMainMenu && (
          <Section
            role="Container"
            prominence="Hero"
           
            className="absolute top-full left-0 mt-1 w-56 py-1 z-50"
          >
            <MainMenuContent />
          </Section>
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
          <Section
            role="Container"
            prominence="Hero"
           
            className="absolute top-full left-0 mt-1 w-64 py-1 z-50"
          >
            <ProjectMenuContent />
          </Section>
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
          <Section
            role="Container"
            prominence="Hero"
           
            className="absolute top-full left-0 mt-1 w-64 py-1 z-50"
          >
            <VcsMenuContent />
          </Section>
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
          <Section
            role="Container"
            prominence="Hero"
           
            className="absolute top-full left-0 mt-1 w-64 py-1 z-50"
          >
            <RunMenuContent />
          </Section>
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
         
          title="Settings (⌘,)"
          onClick={onOpenSettings}
        >
          <SettingsIcon size={16} />
        </IconButton>
      </div>
    </Section>
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
          <div className="text-xs font-semibold text-subtle px-2 py-1">
            {menu.label}
          </div>
          {menu.items.map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-surface-floating/50 active:bg-surface-floating transition-colors"
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
      <button className="w-full text-left px-3 py-2 text-sm font-medium hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        New Project...
      </button>
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        Open...
      </button>
      <div className="h-px bg-border my-1" />
      <div className="px-2 py-1">
        <div className="text-xs font-semibold text-subtle px-2 py-1">
          Recent Projects
        </div>
        {recentProjects.map((project) => (
          <button
            key={project}
            className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-surface-floating/50 active:bg-surface-floating transition-colors"
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
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        <DownloadIcon size={16} />
        <span>Update Project</span>
        <span className="ml-auto text-xs text-subtle">⌘T</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        <UploadIcon size={16} />
        <span>Commit...</span>
        <span className="ml-auto text-xs text-subtle">⌘K</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        <UploadIcon size={16} />
        <span>Push...</span>
        <span className="ml-auto text-xs text-subtle">⇧⌘K</span>
      </button>
      <div className="h-px bg-border my-1" />
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        <GitBranchIcon size={16} />
        <span>Branches...</span>
      </button>
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        Fetch
      </button>
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
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
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        <PlayIcon size={16} />
        <span>Run 'dev'</span>
        <span className="ml-auto text-xs text-subtle">⌃R</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        <span className="text-accent">▶</span>
        <span>Debug 'dev'</span>
        <span className="ml-auto text-xs text-subtle">⌃D</span>
      </button>
      <div className="h-px bg-border my-1" />
      <div className="px-2 py-1">
        <div className="text-xs font-semibold text-subtle px-2 py-1">
          Configurations
        </div>
        {configurations.map((config) => (
          <button
            key={config.name}
            className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-surface-floating/50 active:bg-surface-floating transition-colors"
          >
            <div className="flex items-center gap-2">
              <PlayIcon size={14} />
              <span>{config.name}</span>
              <span className="text-xs text-subtle ml-auto">{config.type}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="h-px bg-border my-1" />
      <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface-floating/50 active:bg-surface-floating transition-colors">
        Edit Configurations...
      </button>
    </div>
  );
};
