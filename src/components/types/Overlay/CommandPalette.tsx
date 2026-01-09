/**
 * CommandPalette - 전역 커맨드 팔레트
 *
 * Cmd+K로 열기, 모든 액션/파일/설정에 빠르게 접근
 */

import { Command } from 'cmdk';
import {
  Code,
  File,
  Folder,
  Maximize,
  Minimize,
  Monitor,
  Moon,
  Search,
  Settings,
  Sun,
  Terminal,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardContext, useGlobalShortcut, useKeyboardContext } from '@/shared/lib/keyboard';
import { applyThemeConfig, getThemeConfig, initializeTheme } from '@/shared/lib/theme.ts';
import './command-palette.css';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  onSelect: () => void;
  keywords?: string[];
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { enableContext, disableContext } = useKeyboardContext();

  // Cmd+K로 열기
  useGlobalShortcut(
    'mod+k',
    () => {
      setIsOpen((prev) => !prev);
    },
    {
      description: 'Toggle command palette',
      preventDefault: true,
    }
  );

  // 컨텍스트 관리
  useEffect(() => {
    if (isOpen) {
      enableContext(KeyboardContext.COMMAND_PALETTE_OPEN);
    } else {
      disableContext(KeyboardContext.COMMAND_PALETTE_OPEN);
    }
  }, [isOpen, enableContext, disableContext]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 커맨드 정의
  const commands: CommandGroup[] = [
    {
      heading: 'Files',
      items: [
        {
          id: 'new-file',
          label: 'New File',
          description: 'Create a new file',
          icon: <File size={16} />,
          onSelect: () => {
            console.log('New file');
            handleClose();
          },
          keywords: ['create', 'add'],
        },
        {
          id: 'new-folder',
          label: 'New Folder',
          description: 'Create a new folder',
          icon: <Folder size={16} />,
          onSelect: () => {
            console.log('New folder');
            handleClose();
          },
          keywords: ['create', 'add', 'directory'],
        },
      ],
    },
    {
      heading: 'Actions',
      items: [
        {
          id: 'open-settings',
          label: 'Open Settings',
          description: 'Open settings panel',
          icon: <Settings size={16} />,
          onSelect: () => {
            console.log('Open settings');
            handleClose();
          },
        },
        {
          id: 'toggle-terminal',
          label: 'Toggle Terminal',
          description: 'Show/hide terminal panel',
          icon: <Terminal size={16} />,
          onSelect: () => {
            console.log('Toggle terminal');
            handleClose();
          },
        },
        {
          id: 'command-palette',
          label: 'Command Palette',
          description: 'Open command palette (you are here)',
          icon: <Code size={16} />,
          onSelect: () => {
            console.log('Already open');
          },
        },
      ],
    },
    {
      heading: 'Theme',
      items: [
        {
          id: 'theme-light',
          label: 'Light Theme',
          description: 'Switch to light theme',
          icon: <Sun size={16} />,
          onSelect: () => {
            const config = getThemeConfig();
            applyThemeConfig({ ...config, theme: 'light' });
            handleClose();
          },
        },
        {
          id: 'theme-dark',
          label: 'Dark Theme',
          description: 'Switch to dark theme',
          icon: <Moon size={16} />,
          onSelect: () => {
            const config = getThemeConfig();
            applyThemeConfig({ ...config, theme: 'dark' });
            handleClose();
          },
        },
        {
          id: 'theme-auto',
          label: 'Auto Theme',
          description: 'Follow system preference',
          icon: <Monitor size={16} />,
          onSelect: () => {
            // Clear localStorage to enable system auto-detect
            localStorage.removeItem('ui-kit-theme-config');
            // Re-initialize from system preference
            initializeTheme();
            handleClose();
          },
        },
      ],
    },
    {
      heading: 'View',
      items: [
        {
          id: 'toggle-fullscreen',
          label: 'Toggle Fullscreen',
          description: 'Enter/exit fullscreen mode',
          icon: <Maximize size={16} />,
          onSelect: () => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
            handleClose();
          },
        },
        {
          id: 'zen-mode',
          label: 'Zen Mode',
          description: 'Distraction-free mode',
          icon: <Minimize size={16} />,
          onSelect: () => {
            console.log('Zen mode');
            handleClose();
          },
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Command Dialog */}
      <Command.Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        className="cmdk-root"
        label="Command palette"
      >
        <div className="cmdk-header">
          <Search size={16} className="cmdk-search-icon" />
          <Command.Input className="cmdk-input" placeholder="Search commands..." autoFocus />
        </div>

        <Command.List className="cmdk-list">
          <Command.Empty className="cmdk-empty">No commands found</Command.Empty>

          {commands.map((group) => (
            <Command.Group key={group.heading} heading={group.heading} className="cmdk-group">
              <div className="cmdk-group-heading">{group.heading}</div>
              {group.items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.description} ${item.keywords?.join(' ')}`}
                  onSelect={item.onSelect}
                  className="cmdk-item"
                >
                  <span className="cmdk-item-icon">{item.icon}</span>
                  <div className="cmdk-item-content">
                    <div className="cmdk-item-label">{item.label}</div>
                    {item.description && (
                      <div className="cmdk-item-description">{item.description}</div>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="cmdk-footer">
          <div className="cmdk-footer-hints">
            <span className="cmdk-hint">
              <kbd>↑↓</kbd> navigate
            </span>
            <span className="cmdk-hint">
              <kbd>↵</kbd> select
            </span>
            <span className="cmdk-hint">
              <kbd>ESC</kbd> close
            </span>
          </div>
        </div>
      </Command.Dialog>
    </div>
  );
};
