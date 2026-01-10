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
import { Button } from '@/components/types/Element/Action/role/Button.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
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
      <Block role="Dropdown" position="relative">
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
      </Block>

      {/* 2. Project Widget */}
      <Block role="Dropdown" position="relative">
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
      </Block>

      {/* Divider */}
      <Block role="Divider" orientation="vertical" height="24" />

      {/* 3. VCS Widget */}
      <Block role="Dropdown" position="relative">
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
      </Block>

      {/* 4. Run Widget */}
      <Block role="Dropdown" position="relative">
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
      </Block>

      {/* Spacer */}
      <Block role="Spacer" flex="1" />

      {/* Right Side Actions */}
      <Block role="Toolbar" direction="horizontal" align="center" gap="xs">
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
        <Block role="Divider" orientation="vertical" height="24" margin="xs" />

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
      </Block>
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
    <Block role="Menu" padding="xs">
      {menuItems.map((menu) => (
        <Block key={menu.label} role="MenuSection" padding="xs">
          <Text role="Label" prominence="Subtle" content={menu.label} />
          <Block role="MenuItems" gap="xs">
            {menu.items.map((item) => (
              <Action
                key={item}
                role="MenuItem"
                prominence="Secondary"
                label={item}
              />
            ))}
          </Block>
        </Block>
      ))}
    </Block>
  );
};

const ProjectMenuContent = () => {
  const recentProjects = ['ide-ui-kit', 'design-system', 'react-dashboard', 'portfolio-2024'];

  return (
    <Block role="Menu" padding="xs">
      <Action
        role="MenuItem"
        prominence="Primary"
        label="New Project..."
      />
      <Action
        role="MenuItem"
        prominence="Secondary"
        label="Open..."
      />
      <Block role="Divider" orientation="horizontal" />
      <Block role="MenuSection" padding="xs">
        <Text role="Label" prominence="Subtle" content="Recent Projects" />
        <Block role="MenuItems" gap="xs">
          {recentProjects.map((project) => (
            <Action
              key={project}
              role="MenuItem"
              prominence="Secondary"
              label={project}
            />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

const VcsMenuContent = () => {
  return (
    <Block role="Menu" padding="xs">
      <Block role="MenuItem" direction="horizontal" align="center" padding="sm" gap="sm" interactive>
        <DownloadIcon size={16} />
        <Text role="Body" prominence="Primary" content="Update Project" />
        <Text role="Label" prominence="Subtle" content="⌘T" />
      </Block>
      <Block role="MenuItem" direction="horizontal" align="center" padding="sm" gap="sm" interactive>
        <UploadIcon size={16} />
        <Text role="Body" prominence="Primary" content="Commit..." />
        <Text role="Label" prominence="Subtle" content="⌘K" />
      </Block>
      <Block role="MenuItem" direction="horizontal" align="center" padding="sm" gap="sm" interactive>
        <UploadIcon size={16} />
        <Text role="Body" prominence="Primary" content="Push..." />
        <Text role="Label" prominence="Subtle" content="⇧⌘K" />
      </Block>
      <Block role="Divider" orientation="horizontal" />
      <Block role="MenuItem" direction="horizontal" align="center" padding="sm" gap="sm" interactive>
        <GitBranchIcon size={16} />
        <Text role="Body" prominence="Primary" content="Branches..." />
      </Block>
      <Action
        role="MenuItem"
        prominence="Secondary"
        label="Fetch"
      />
      <Action
        role="MenuItem"
        prominence="Secondary"
        label="Pull..."
      />
    </Block>
  );
};

const RunMenuContent = () => {
  const configurations = [
    { name: 'dev', type: 'npm' },
    { name: 'build', type: 'npm' },
    { name: 'test', type: 'npm' },
  ];

  return (
    <Block role="Menu" padding="xs">
      <Block role="MenuItem" direction="horizontal" align="center" padding="sm" gap="sm" interactive>
        <PlayIcon size={16} />
        <Text role="Body" prominence="Primary" content="Run 'dev'" weight="medium" />
        <Text role="Label" prominence="Subtle" content="⌃R" />
      </Block>
      <Block role="MenuItem" direction="horizontal" align="center" padding="sm" gap="sm" interactive>
        <Text role="Body" prominence="Brand" content="▶" />
        <Text role="Body" prominence="Primary" content="Debug 'dev'" />
        <Text role="Label" prominence="Subtle" content="⌃D" />
      </Block>
      <Block role="Divider" orientation="horizontal" />
      <Block role="MenuSection" padding="xs">
        <Text role="Label" prominence="Subtle" content="Configurations" />
        <Block role="MenuItems" gap="xs">
          {configurations.map((config) => (
            <Block
              key={config.name}
              role="MenuItem"
              direction="horizontal"
              align="center"
              padding="sm"
              gap="xs"
              interactive
            >
              <PlayIcon size={14} />
              <Text role="Body" prominence="Primary" content={config.name} />
              <Text role="Label" prominence="Subtle" content={config.type} />
            </Block>
          ))}
        </Block>
      </Block>
      <Block role="Divider" orientation="horizontal" />
      <Action
        role="MenuItem"
        prominence="Secondary"
        label="Edit Configurations..."
      />
    </Block>
  );
};
