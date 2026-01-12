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
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Button } from '@/components/dsl/Element/Action/role/Button.tsx';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

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
    <Section role="Header" prominence="Hero">
      {/* 1. Main Menu (Hamburger) */}
      <Block role="Dropdown">
        <Action
          role="IconButton"
          icon="Menu"
          label="Main Menu (Alt+\)"
          density="Compact"
          onClick={() => setShowMainMenu(!showMainMenu)}
          onBlur={() => {
            setTimeout(() => setShowMainMenu(false), 200);
          }}
        />

        {showMainMenu && (
          <Section role="Container" prominence="Hero">
            <MainMenuContent />
          </Section>
        )}
      </Block>

      {/* 2. Project Widget */}
      <Block role="Dropdown">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowProjectMenu(!showProjectMenu)}
          onBlur={() => {
            setTimeout(() => setShowProjectMenu(false), 200);
          }}
        >
          <FolderOpenIcon size={16} />
          <Text role="Body" prominence="Strong" content={projectName} />
          <ChevronDownIcon size={16} />
        </Button>

        {showProjectMenu && (
          <Section role="Container" prominence="Hero">
            <ProjectMenuContent />
          </Section>
        )}
      </Block>

      {/* Divider */}
      <Block role="DividerVertical" />

      {/* 3. VCS Widget */}
      <Block role="Dropdown">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowVcsMenu(!showVcsMenu)}
          onBlur={() => {
            setTimeout(() => setShowVcsMenu(false), 200);
          }}
        >
          <GitBranchIcon size={16} />
          <span>{currentBranch}</span>
          <ChevronDownIcon size={16} />
        </Button>

        {showVcsMenu && (
          <Section role="Container" prominence="Hero">
            <VcsMenuContent />
          </Section>
        )}
      </Block>

      {/* 4. Run Widget */}
      <Block role="Dropdown">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRunMenu(!showRunMenu)}
          onBlur={() => {
            setTimeout(() => setShowRunMenu(false), 200);
          }}
        >
          <PlayIcon size={16} />
          <span>Run</span>
          <ChevronDownIcon size={16} />
        </Button>

        {showRunMenu && (
          <Section role="Container" prominence="Hero">
            <RunMenuContent />
          </Section>
        )}
      </Block>

      {/* Spacer */}
      <Block role="Spacer" />

      {/* Right Side Actions */}
      <Block role="Toolbar">
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
        <Block role="DividerVertical" />

        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* Search */}
        <Action
          role="IconButton"
          icon="Search"
          label="Search (⌘P)"
          density="Compact"
          onClick={onOpenSearch}
        />

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
    <Block role="Menu">
      {menuItems.map((menu) => (
        <Block key={menu.label} role="Group">
          <Text role="Label" prominence="Subtle" content={menu.label} />
          <Block role="Stack">
            {menu.items.map((item) => (
              <Action key={item} role="MenuItem" prominence="Standard" label={item} />
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
    <Block role="Menu">
      <Action role="MenuItem" prominence="Strong" label="New Project..." />
      <Action role="MenuItem" prominence="Standard" label="Open..." />
      <Block role="Divider" />
      <Block role="Group">
        <Text role="Label" prominence="Subtle" content="Recent Projects" />
        <Block role="Stack">
          {recentProjects.map((project) => (
            <Action key={project} role="MenuItem" prominence="Standard" label={project} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

const VcsMenuContent = () => {
  return (
    <Block role="Menu">
      <Action role="MenuItem">
        <Block role="Inline">
          <DownloadIcon size={16} />
          <Text role="Body" prominence="Strong" content="Update Project" />
          <Text role="Label" prominence="Subtle" content="⌘T" />
        </Block>
      </Action>
      <Action role="MenuItem">
        <Block layout="inline" align="center">
          <UploadIcon size={16} />
          <Text role="Body" prominence="Strong" content="Commit..." />
          <Text role="Label" prominence="Subtle" content="⌘K" />
        </Block>
      </Action>
      <Action role="MenuItem">
        <Block role="Inline">
          <UploadIcon size={16} />
          <Text role="Body" prominence="Strong" content="Push..." />
          <Text role="Label" prominence="Subtle" content="⇧⌘K" />
        </Block>
      </Action>
      <Block role="Divider" />
      <Action role="MenuItem">
        <Block layout="inline" align="center">
          <GitBranchIcon size={16} />
          <Text role="Body" prominence="Strong" content="Branches..." />
        </Block>
      </Action>
      <Action role="MenuItem" prominence="Standard" label="Fetch" />
      <Action role="MenuItem" prominence="Standard" label="Pull..." />
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
    <Block role="Menu">
      <Action role="MenuItem">
        <Block role="Inline">
          <PlayIcon size={16} />
          <Text role="Body" prominence="Strong" content="Run 'dev'" />
          <Text role="Label" prominence="Subtle" content="⌃R" />
        </Block>
      </Action>
      <Action role="MenuItem">
        <Block role="Inline">
          <Text role="Body" intent="Brand" prominence="Strong" content="▶" />
          <Text role="Body" prominence="Strong" content="Debug 'dev'" />
          <Text role="Label" prominence="Subtle" content="⌃D" />
        </Block>
      </Action>
      <Block role="Divider" />
      <Block role="Group">
        <Text role="Label" prominence="Subtle" content="Configurations" />
        <Block role="Stack">
          {configurations.map((config) => (
            <Action key={config.name} role="MenuItem">
              <Block role="Inline">
                <PlayIcon size={14} />
                <Text role="Body" prominence="Strong" content={config.name} />
                <Text role="Label" prominence="Subtle" content={config.type} />
              </Block>
            </Action>
          ))}
        </Block>
      </Block>
      <Block role="Divider" />
      <Action role="MenuItem" prominence="Standard" label="Edit Configurations..." />
    </Block>
  );
};
