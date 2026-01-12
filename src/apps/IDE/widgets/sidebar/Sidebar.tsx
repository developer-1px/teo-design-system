import type { FileNode } from '@/apps/IDE/lib/file-loader';
import { FileTree } from '@/apps/IDE/widgets/file-tree/FileTree';
import { DebugView } from '@/apps/IDE/widgets/sidebar-views/DebugView';
import { ExtensionsView } from '@/apps/IDE/widgets/sidebar-views/ExtensionsView';
import { JsonView } from '@/apps/IDE/widgets/sidebar-views/JsonView';
import { PresentationView } from '@/apps/IDE/widgets/sidebar-views/PresentationView';
import { RunView } from '@/apps/IDE/widgets/sidebar-views/RunView';
import { SearchView } from '@/apps/IDE/widgets/sidebar-views/SearchView';
import { SettingsView } from '@/apps/IDE/widgets/sidebar-views/SettingsView';
import { SourceControlView } from '@/apps/IDE/widgets/sidebar-views/SourceControlView';
import { TokensView } from '@/apps/IDE/widgets/sidebar-views/TokensView';
import { Section } from '@/components/dsl/Section/Section';

interface SidebarProps {
  currentView: string;
  width: number;
  fileTreeData: FileNode[];
  onFileSelect: (path: string) => void;
}

export function Sidebar({ currentView, width, fileTreeData, onFileSelect }: SidebarProps) {
  if (currentView === 'none') return null;

  return (
    <Section
      role="PrimarySidebar"
      collapsible={{
        collapsed: false,
        expandedSize: width,
      }}
      className="border-r border-border-default h-full"
    >
      {currentView === 'files' && <FileTree data={fileTreeData} onFileSelect={onFileSelect} />}
      {currentView === 'search' && <SearchView />}
      {currentView === 'git' && <SourceControlView />}
      {currentView === 'debug' && <DebugView />}
      {currentView === 'extensions' && <ExtensionsView />}
      {currentView === 'run' && <RunView />}
      {currentView === 'tokens' && <TokensView />}
      {currentView === 'servers' && <JsonView />}
      {currentView === 'presentation' && <PresentationView />}
      {currentView === 'settings' && <SettingsView />}
    </Section>
  );
}
