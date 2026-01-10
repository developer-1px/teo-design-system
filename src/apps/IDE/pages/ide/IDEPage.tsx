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
    <Page role="Application" layout="Studio" density="Compact">
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
      {currentView === 'files' && (
        <Section role="PrimarySidebar">
          {/* Explorer Header */}
          <Section role="Header" prominence="Subtle" density="Compact">
            <Text
              role="Title"
              prominence="Subtle"
              content="Explorer"
            />
          </Section>

          {/* File Tree */}
          <Group role="Container">
            <FileTree data={fileTreeData} onFileClick={handleFileClick} />
          </Group>
        </Section>
      )}

      {/* IDDL Section[Editor]: Editor Area */}
      <Section role="Editor">
        {/* Editor Content */}
        <Group role="Container">
          {currentView === 'files' && (
            <>
              {/* Editor Tabs */}
              {openFiles.length > 0 && <EditorTabs />}

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

        {/* Bottom Panel - Terminal */}
        <BottomPanel
          isOpen={showBottomPanel}
          onClose={() => setShowBottomPanel(false)}
          height={200}
        />
      </Section>

      {/* IDDL Section[SecondarySidebar]: Right Sidebar */}
      <Section role="SecondarySidebar">
        <RightBar
          view={rightPanelView}
          projectName="ide-ui-kit"
          currentBranch="main"
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      </Section>

      {/* IDDL Section[Auxiliary]: Right Navigation */}
      <Section role="Auxiliary">
        <RightNav onViewChange={setRightPanelView} onClose={() => setRightPanelView(null)} />
      </Section>

      {/* Modals */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </Page>
  );
};
