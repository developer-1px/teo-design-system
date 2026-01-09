/**
 * TopToolbar - IntelliJ New UI Style (2024.2+)
 *
 * 구조:
 * [햄버거메뉴] [프로젝트위젯] [VCS위젯] [Run위젯] ... [패널토글] [설정]
 *
 * @see https://www.jetbrains.com/help/idea/new-ui.html
 */

import {
  ChevronDown as ChevronDownIcon,
  Download as DownloadIcon,
  FolderOpen as FolderOpenIcon,
  GitBranch as GitBranchIcon,
  Play as PlayIcon,
  Upload as UploadIcon,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggleButton } from '@/apps/IDE/widgets/ThemeSwitcher.tsx';
import { Button } from '@/components/types/Atom/Action/role/Button.tsx';
import { Action } from '@/components/types/Atom/Action/Action.tsx';
import { Section } from '@/components/types/Section/Section.tsx';

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
    <Section role="Header" prominence="Hero" layout="flex" direction="horizontal" align="center" padding="sm" gap="xs" height="40">
      {/* 1. Main Menu (Hamburger) */}
      <Group role="Dropdown" position="relative">
        <Action
          role="IconButton"
          icon="Menu"
          label="Main Menu (Alt+\)"
          density="Compact"
          onClick={() => setShowMainMenu(!showMainMenu)}
          onBlur={() => setTimeout(() => setShowMainMenu(false), 200)}
        />

        {showMainMenu && (
          <Section
            role="Container"
            prominence="Hero"
            position="absolute"
            top="full"
            left="0"
            width="224"
            padding="xs"
            elevation="high"
          >
            <MainMenuContent />
          </Section>
        )}
      </Group>

      {/* 2. Project Widget */}
      <Group role="Dropdown" position="relative">
        <Button
          variant="ghost"
          size="sm"
          gap="xs"
          onClick={() => setShowProjectMenu(!showProjectMenu)}
          onBlur={() => setTimeout(() => setShowProjectMenu(false), 200)}
        >
          <FolderOpenIcon size={16} />
          <Text role="Body" prominence="Primary" content={projectName} />
          <ChevronDownIcon size={16} />
        </Button>

        {showProjectMenu && (
          <Section
            role="Container"
            prominence="Hero"
            position="absolute"
            top="full"
            left="0"
            width="256"
            padding="xs"
            elevation="high"
          >
            <ProjectMenuContent />
          </Section>
        )}
      </Group>

      {/* Divider */}
      <Group role="Divider" orientation="vertical" height="24" />

      {/* 3. VCS Widget */}
      <Group role="Dropdown" position="relative">
        <Button
          variant="ghost"
          size="sm"
          gap="xs"
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
            position="absolute"
            top="full"
            left="0"
            width="256"
            padding="xs"
            elevation="high"
          >
            <VcsMenuContent />
          </Section>
        )}
      </Group>

      {/* 4. Run Widget */}
      <Group role="Dropdown" position="relative">
        <Button
          variant="ghost"
          size="sm"
          gap="xs"
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
            position="absolute"
            top="full"
            left="0"
            width="256"
            padding="xs"
            elevation="high"
          >
            <RunMenuContent />
          </Section>
        )}
      </Group>

      {/* Spacer */}
      <Group role="Spacer" flex="1" />

      {/* Right Side Actions */}
      <Group role="Toolbar" direction="horizontal" align="center" gap="xs">
        {/* Panel Toggles */}
        {onToggleRightSidebar && (
          <Action
            role="IconButton"
            icon="PanelRightOpen"
            label="Toggle Right Sidebar"
            density="Compact"
            selected={showRightSidebar}
            onClick={onToggleRightSidebar}
          />
        )}

        {/* Divider */}
        <Group role="Divider" orientation="vertical" height="24" margin="xs" />

        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* Settings */}
        <Action
          role="IconButton"
          icon="Settings"
          label="Settings (⌘,)"
          density="Compact"
          onClick={onOpenSettings}
        />
      </Group>
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
          <div className="text-xs font-semibold text-subtle px-2 py-1">{menu.label}</div>
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
  const recentProjects = ['ide-ui-kit', 'design-system', 'react-dashboard', 'portfolio-2024'];

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
        <div className="text-xs font-semibold text-subtle px-2 py-1">Recent Projects</div>
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
        <div className="text-xs font-semibold text-subtle px-2 py-1">Configurations</div>
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
