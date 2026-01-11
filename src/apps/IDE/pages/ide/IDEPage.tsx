/**
 * IDEPage - IDDL based IDE Application (IDDL v5.0 compliant)
 */

import { useMemo, useState } from 'react';
import { type FileNode, loadFileContent } from '@/apps/IDE/lib/file-loader';
import { BottomPanel } from '@/apps/IDE/widgets/BottomPanel';
import { CodeEditor } from '@/apps/IDE/widgets/editor/CodeEditor';
import { ComponentPreview } from '@/apps/IDE/widgets/editor/ComponentPreview';
import { EditorTabs } from '@/apps/IDE/widgets/editor/EditorTabs';
import { DebugView } from '@/apps/IDE/widgets/sidebar-views/DebugView';
import { ExtensionsView } from '@/apps/IDE/widgets/sidebar-views/ExtensionsView';
import { JsonView } from '@/apps/IDE/widgets/sidebar-views/JsonView';
import { PresentationView } from '@/apps/IDE/widgets/sidebar-views/PresentationView';
import { RunView } from '@/apps/IDE/widgets/sidebar-views/RunView';
import { SearchView } from '@/apps/IDE/widgets/sidebar-views/SearchView';
import { SettingsView } from '@/apps/IDE/widgets/sidebar-views/SettingsView';
import { SourceControlView } from '@/apps/IDE/widgets/sidebar-views/SourceControlView';
import { TokensView } from '@/apps/IDE/widgets/sidebar-views/TokensView';
import { RightNav } from '@/apps/IDE/widgets/workspace/RightNav';
import { WorkspaceNav } from '@/apps/IDE/widgets/workspace/WorkspaceNav';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { SearchModalDSL as SearchModal } from '@/components/types/Overlay/SearchModalDSL';
import { SettingsModalDSL as SettingsModal } from '@/components/types/Overlay/SettingsModalDSL';
import { Page } from '@/components/types/Page/Page.tsx';
import { RightBar } from '@/components/types/Section/role/RightBar.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import type { TreeNode } from '@/shared/lib/keyboard/useTreeNavigation';

interface OpenFile {
  path: string;
  name: string;
  content: string;
}

export const IDEPage = () => {
  const [currentView, setCurrentView] = useState('files');
  const [rightPanelView, setRightPanelView] = useState<string | null>('ai');
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [fileTreeData] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Layout State (simplified for Splitter)
  // We don't need useResizable state anymore as Splitter manages it internally.
  // We just need to manage visibility.

  /* File Tree Conversion Logic remains same */
  const treeNodes = useMemo(() => {
    const convert = (nodes: FileNode[]): TreeNode[] => {
      return nodes.map((node, index) => ({
        id: node.path || `${node.name}-${index}`,
        name: node.name,
        type: node.type,
        children: node.children ? convert(node.children) : undefined,
        isOpen: node.defaultOpen,
        path: node.path,
        icon: node.icon,
      })) as TreeNode[];
    };
    const nodes = convert(fileTreeData);
    return nodes;
  }, [fileTreeData]);

  const handleFileClick = async (path: string) => {
    const existingFile = openFiles.find((f) => f.path === path);
    if (existingFile) {
      setActiveFilePath(path);
      return;
    }

    try {
      const content = await loadFileContent(path);
      const name = path.split('/').pop() || path;
      const newFile: OpenFile = { path, name, content };
      setOpenFiles([...openFiles, newFile]);
      setActiveFilePath(path);
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  // Helper to render Editor Part
  const EditorArea = (
    <Section role="Editor" className="h-full flex flex-col">
      {/* Editor Tabs */}
      {openFiles.length > 0 && <EditorTabs />}

      {/* Breadcrumbs */}
      {activeFile && (
        <Block
          role="Breadcrumbs"
          layout="inline"
          padding="xs"
          prominence="Subtle"
          className="border-b border-border-muted px-4"
        >
          <Text role="Caption" content="src" prominence="Subtle" />
          <Block role="DividerVertical" className="mx-1 h-3" />
          <Text role="Caption" content="apps" prominence="Subtle" />
          <Block role="DividerVertical" className="mx-1 h-3" />
          <Text role="Caption" content="IDE" prominence="Subtle" />
          <Block role="DividerVertical" className="mx-1 h-3" />
          <Text role="Caption" content={activeFile.name} prominence="Standard" />
        </Block>
      )}

      {/* Editor or Empty State */}
      <Block role="Container" className="flex-1 min-h-0 relative">
        {activeFile ? (
          activeFile.name.endsWith('.tsx') || activeFile.name.endsWith('.jsx') ? (
            <ComponentPreview path={activeFile.path} filename={activeFile.name} />
          ) : (
            <CodeEditor content={activeFile.content} filename={activeFile.name} />
          )
        ) : (
          <Block role="Stack" className="h-full items-center justify-center p-8">
            <Block role="Card" prominence="Subtle" className="text-center max-w-sm">
              <Text role="Heading" content="No File Open" className="mb-2" />
              <Text
                role="Body"
                prominence="Subtle"
                content="Select a file from the explorer or use ⌘P to search for files."
              />
            </Block>
          </Block>
        )}
      </Block>
    </Section>
  );

  return (
    <Page title="IDE" role="Application" layout="Studio" density="Compact">
      {/* 1. Activity Bar */}
      <Section role="ActivityBar">
        <Block role="Container" flex="1">
          <WorkspaceNav onViewChange={setCurrentView} />
        </Block>

        <Block role="Toolbar">
          <Action
            role="IconButton"
            icon="Terminal"
            label="Toggle Panel"
            prominence={showBottomPanel ? 'Standard' : 'Subtle'}
            onClick={() => setShowBottomPanel(!showBottomPanel)}
          />
        </Block>
      </Section>

      {/* 2. Primary Sidebar */}
      {currentView !== 'none' && (
        <Section role="PrimarySidebar">
          {currentView === 'files' && (
            <Block role="Stack" gap={0} className="h-full">
              <Block
                role="Toolbar"
                density="Compact"
                className="px-3 border-b border-border-default h-9 items-center flex-none"
              >
                <Text role="Caption" prominence="Subtle" content="EXPLORER" />
              </Block>
              <Block role="ScrollArea" className="flex-1">
                <Block
                  role="Tree"
                  data={treeNodes}
                  defaultExpandedIds={['/src', '/src/apps', '/src/apps/IDE', '/src/docs']}
                  onNodeClick={(node) => {
                    if (node.type === 'file' && node.path) {
                      handleFileClick(node.path);
                    }
                  }}
                  selectable
                />
              </Block>
            </Block>
          )}
          {currentView === 'search' && <SearchView onFileClick={handleFileClick} />}
          {currentView === 'git' && <SourceControlView onFileClick={handleFileClick} />}
          {currentView === 'debug' && <DebugView />}
          {currentView === 'extensions' && <ExtensionsView />}
          {currentView === 'run' && <RunView />}
          {currentView === 'tokens' && <TokensView />}
          {currentView === 'servers' && <JsonView />}
          {currentView === 'presentation' && <PresentationView />}
          {currentView === 'settings' && <SettingsView />}
        </Section>
      )}

      {/* 3. Editor */}
      {EditorArea}

      {/* 4. Panel */}
      {showBottomPanel && (
        <Section role="Panel" className="border-t border-border-default bg-surface">
          <BottomPanel onClose={() => setShowBottomPanel(false)} />
        </Section>
      )}

      {/* 5. Secondary Sidebar */}
      <Section role="SecondarySidebar" className="border-l border-border-default bg-surface">
        <RightBar
          view={rightPanelView}
          projectName="ide-ui-kit"
          currentBranch="main"
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      </Section>

      {/* 6. Utility Bar */}
      <Section role="UtilityBar" className="border-l border-border-default bg-surface">
        <RightNav onViewChange={setRightPanelView} onClose={() => setRightPanelView(null)} />
      </Section>

      {/* 7. Footer */}
      <Section
        role="Footer"
        prominence="Subtle"
        density="Compact"
        className="border-t border-border-default"
      >
        <Block role="Toolbar" justify="between" align="center" padding="xs" className="w-full">
          {/* Left: Git Branch & Errors */}
          <Block role="Inline" gap="sm" align="center">
            <Action
              role="Button"
              icon="GitBranch"
              label="main*"
              prominence="Subtle"
              density="Compact"
            />
            <Action role="Button" icon="RefreshCw" label="" prominence="Subtle" density="Compact" />
            <Text role="Body" content="0 errors" prominence="Subtle" size="xs" />
            <Text role="Body" content="0 warnings" prominence="Subtle" size="xs" />
          </Block>

          {/* Right: Cursor & Language */}
          <Block role="Inline" gap="sm" align="center">
            <Text role="Body" content="Ln 12, Col 34" prominence="Subtle" size="xs" />
            <Text role="Body" content="UTF-8" prominence="Subtle" size="xs" />
            <Text role="Body" content="TypeScript React" prominence="Subtle" size="xs" />
            <Action
              role="Button"
              icon="Check"
              label="Prettier"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="Bell"
              label="Notifications"
              prominence="Subtle"
              density="Compact"
            />
          </Block>
        </Block>
      </Section>

      {/* Modals */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </Page>
  );
};
