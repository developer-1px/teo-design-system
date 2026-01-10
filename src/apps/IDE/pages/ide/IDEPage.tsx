/**
 * IDEPage - IDDL 기반 IDE 애플리케이션
 *
 * IDDL Structure (v5.0):
 * - Page role="Application" layout="Studio": 전체 애플리케이션 루트
 *   - Section role="ActivityBar": 좌측 워크스페이스 네비게이션
 *   - Section role="PrimarySidebar": 파일 트리 사이드바
 *   - Section role="Editor": 에디터 영역
 *     - Group role="Container": 에디터 탭 + 코드 에디터
 *     - BottomPanel: 터미널/출력 패널
 *   - Section role="SecondarySidebar": 우측 사이드바 (RightBar)
 *   - Section role="Auxiliary": 우측 네비게이션 (RightNav)
 */

import { useEffect, useState } from 'react';
import { buildFileTree, getFilePaths, loadFileContent } from '@/apps/IDE/lib/file-loader';
import { BottomPanel } from '@/apps/IDE/widgets/BottomPanel';
import { CodeEditor } from '@/apps/IDE/widgets/editor/CodeEditor';
import { ComponentPreview } from '@/apps/IDE/widgets/editor/ComponentPreview';
import { EditorTabs } from '@/apps/IDE/widgets/editor/EditorTabs';
import { type FileNode, FileTree } from '@/apps/IDE/widgets/file-tree/FileTree';
import { RightNav } from '@/apps/IDE/widgets/workspace/RightNav';
import { WorkspaceNav } from '@/apps/IDE/widgets/workspace/WorkspaceNav';
import { Group } from '@/components/types/Group/Group.tsx';
import { Action } from '@/components/types/Atom/Action/Action';
import { Text } from '@/components/types/Atom/Text/Text';
import { SearchModalDSL as SearchModal } from '@/components/types/Overlay/SearchModalDSL';
import { SettingsModalDSL as SettingsModal } from '@/components/types/Overlay/SettingsModalDSL';
import { Page } from '@/components/types/Page/Page.tsx';
import { RightBar } from '@/components/types/Section/role/RightBar.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { SearchView } from '@/apps/IDE/widgets/sidebar-views/SearchView';
import { SourceControlView } from '@/apps/IDE/widgets/sidebar-views/SourceControlView';
import { DebugView } from '@/apps/IDE/widgets/sidebar-views/DebugView';
import { ExtensionsView } from '@/apps/IDE/widgets/sidebar-views/ExtensionsView';
import { RunView } from '@/apps/IDE/widgets/sidebar-views/RunView';
import { TokensView } from '@/apps/IDE/widgets/sidebar-views/TokensView';
import { JsonView } from '@/apps/IDE/widgets/sidebar-views/JsonView';
import { PresentationView } from '@/apps/IDE/widgets/sidebar-views/PresentationView';
import { SettingsView } from '@/apps/IDE/widgets/sidebar-views/SettingsView';
import { useResizable } from '@/shared/hooks/useResizable';
import { ResizeHandle } from '@/shared/components/ResizeHandle';

interface OpenFile {
  path: string;
  name: string;
  content: string;
}

export const IDEPage = () => {
  const [currentView, setCurrentView] = useState('files');
  const [rightPanelView, setRightPanelView] = useState<string | null>('ai');
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [fileTreeData, setFileTreeData] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Layout Resizing
  const {
    size: sidebarWidth,
    separatorProps: sidebarSeparatorProps,
    isResizing: isSidebarResizing
  } = useResizable({
    initialSize: 250,
    minSize: 170,
    maxSize: 600,
    direction: 'horizontal',
  });

  const {
    size: panelHeight,
    separatorProps: panelSeparatorProps,
    isResizing: isPanelResizing
  } = useResizable({
    initialSize: 200,
    minSize: 100,
    maxSize: 600,
    direction: 'vertical',
    reverse: true,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettingsModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const paths = getFilePaths();
    const tree = buildFileTree(paths);
    setFileTreeData(tree);
  }, []);

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

  return (
    <Page
      role="Application"
      layout="Studio"
      density="Compact"
      sizes={{
        primarysidebar: currentView !== 'none' ? `${sidebarWidth}px` : '0px',
        panel: showBottomPanel ? `${panelHeight}px` : '0px',
      }}
    >
      {/* IDDL Section[ActivityBar]: Left Workspace Navigation */}
      <Section role="ActivityBar">
        <Group role="Container">
          <WorkspaceNav onViewChange={setCurrentView} />
        </Group>

        {/* Terminal Toggle */}
        <Group role="Toolbar" prominence="Subtle" density="Compact">
          <Action
            icon="Terminal"
            prominence={showBottomPanel ? 'Standard' : 'Subtle'}
            intent="Neutral"
            behavior={{ action: 'toggle', target: 'bottom-panel' }}
            onClick={() => setShowBottomPanel(!showBottomPanel)}
          />
        </Group>
      </Section>

      {/* IDDL Section[PrimarySidebar]: File Tree Sidebar */}
      {/* IDDL Section[PrimarySidebar]: Sidebar Views */}
      {currentView !== 'none' && (
        <Section role="PrimarySidebar" className="flex flex-col border-r border-border-default overflow-hidden h-full">
          {currentView === 'files' && (
            <>
              <Section role="Header" density="Compact" className="h-9 px-3 flex items-center border-b border-border-default bg-surface-elevated">
                <Text
                  role="Title"
                  prominence="Subtle"
                  content="EXPLORER"
                  className="text-[10px] font-bold text-text-tertiary tracking-widest"
                />
              </Section>
              <Section role="Container" className="flex-1 overflow-y-auto">
                <FileTree data={fileTreeData} onFileClick={handleFileClick} />
              </Section>
            </>
          )}
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
      )}

      {/* IDDL Section[Editor]: Editor Area */}
      <Section role="Editor">
        {/* Editor Content */}
        <Group role="Container" className="flex-1 min-h-0 flex flex-col gap-0">
          {currentView === 'files' && (
            <>
              {/* Editor Tabs */}
              {openFiles.length > 0 && <EditorTabs />}

              {/* Breadcrumbs */}
              {activeFile && (
                <Group role="Breadcrumbs" layout="inline" padding="xs" prominence="Subtle" className="border-b border-border-muted px-4">
                  <Text role="Caption" content="src" prominence="Subtle" />
                  <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                  <Text role="Caption" content="apps" prominence="Subtle" />
                  <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                  <Text role="Caption" content="IDE" prominence="Subtle" />
                  <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                  <Text role="Caption" content={activeFile.name} prominence="Standard" />
                </Group>
              )}

              {/* Editor or Empty State */}
              {activeFile ? (
                activeFile.name.endsWith('.tsx') || activeFile.name.endsWith('.jsx') ? (
                  <ComponentPreview path={activeFile.path} filename={activeFile.name} />
                ) : (
                  <CodeEditor content={activeFile.content} filename={activeFile.name} />
                )
              ) : (
                <Section role="Container">
                  <Group role="Card" prominence="Subtle">
                    <Text role="Body" content="No file open" />
                    <Text
                      role="Caption"
                      prominence="Subtle"
                      content="Select a file from the explorer to start editing"
                    />
                  </Group>
                </Section>
              )}
            </>
          )}
        </Group>
      </Section>

      {/* Resize Handle: Primary Sidebar */}
      {currentView !== 'none' && (
        <ResizeHandle
          direction="horizontal"
          isResizing={isSidebarResizing}
          {...sidebarSeparatorProps}
          style={{
            ...sidebarSeparatorProps.style,
            gridArea: 'primarysidebar',
            justifySelf: 'end',
            width: '4px',
            zIndex: 50,
            transform: 'translateX(50%)',
          }}
        />
      )}

      {/* Resize Handle: Bottom Panel */}
      {showBottomPanel && (
        <ResizeHandle
          direction="vertical"
          isResizing={isPanelResizing}
          {...panelSeparatorProps}
          style={{
            ...panelSeparatorProps.style,
            gridArea: 'panel',
            alignSelf: 'start',
            height: '4px',
            zIndex: 50,
            transform: 'translateY(-50%)',
          }}
        />
      )}

      {/* IDDL Section[Panel]: Bottom Panel */}
      {showBottomPanel && (
        <Section role="Panel">
          <BottomPanel
            isOpen={showBottomPanel}
            onClose={() => setShowBottomPanel(false)}
          // height is handled by grid row size
          />
        </Section>
      )}

      {/* IDDL Section[SecondarySidebar]: Right Sidebar */}
      <Section role="SecondarySidebar">
        <RightBar
          view={rightPanelView}
          projectName="ide-ui-kit"
          currentBranch="main"
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      </Section>

      {/* IDDL Section[UtilityBar]: Right Navigation */}
      <Section role="UtilityBar">
        <RightNav onViewChange={setRightPanelView} onClose={() => setRightPanelView(null)} />
      </Section>

      {/* IDDL Section[Footer]: Status Bar */}
      <Section role="Footer" prominence="Subtle" density="Compact">
        <Group role="Toolbar" justify="between" align="center" padding="xs" className="w-full">
          {/* Left: Git Branch & Errors */}
          <Group role="Inline" gap="sm" align="center">
            <Action role="Button" icon="GitBranch" label="main*" prominence="Subtle" density="Compact" />
            <Action role="Button" icon="RefreshCw" label="" prominence="Subtle" density="Compact" />
            <Text role="Body" content="0 errors" prominence="Subtle" size="xs" />
            <Text role="Body" content="0 warnings" prominence="Subtle" size="xs" />
          </Group>

          {/* Right: Cursor & Language */}
          <Group role="Inline" gap="sm" align="center">
            <Text role="Body" content="Ln 12, Col 34" prominence="Subtle" size="xs" />
            <Text role="Body" content="UTF-8" prominence="Subtle" size="xs" />
            <Text role="Body" content="TypeScript React" prominence="Subtle" size="xs" />
            <Action role="Button" icon="Check" label="Prettier" prominence="Subtle" density="Compact" />
            <Action role="IconButton" icon="Bell" label="Notifications" prominence="Subtle" density="Compact" />
          </Group>
        </Group>
      </Section>

      {/* Modals */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </Page>
  );
};
