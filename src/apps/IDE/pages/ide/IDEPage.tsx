/**
 * IDEPage - IDDL 기반 IDE 애플리케이션
 *
 * IDDL Structure:
 * - Page: 최상위 페이지 컨테이너 (layout='full')
 *   - Section[Container]: 메인 IDE 영역
 *     - Section[ActivityBar]: 좌측 워크스페이스 네비게이션 (v1.1.0)
 *     - Section[PrimarySidebar]: 파일 트리 사이드바 (v1.1.0)
 *     - Section[Editor]: 에디터 영역 (v1.1.0)
 *       - Group[Content]: 에디터 탭 + 코드 에디터
 *       - BottomPanel: 터미널
 *     - RightBar: 우측 사이드바
 *     - Section[ActivityBar]: 우측 네비게이션 (v1.1.0)
 */

import { useState, useEffect } from 'react';
import { Page } from '@/components/dsl/Page';
import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Text } from '@/components/dsl/Text';
import { Action } from '@/components/dsl/Action';
import { RightBar } from '@/components/ui/RightBar';
import { RightNav } from '@/components/workspace/RightNav';
import { BottomPanel } from '@/components/ui/BottomPanel';
import { WorkspaceNav } from '@/components/workspace/WorkspaceNav';
import { FileTree, type FileNode } from '@/apps/IDE/widgets/file-tree/FileTree';
import { EditorTabs } from '@/apps/IDE/widgets/editor/EditorTabs';
import { CodeEditor } from '@/apps/IDE/widgets/editor/CodeEditor';
import { ComponentPreview } from '@/apps/IDE/widgets/editor/ComponentPreview';
import { SearchModalDSL as SearchModal } from '@/components/modal/SearchModalDSL';
import { SettingsModalDSL as SettingsModal } from '@/components/modal/SettingsModalDSL';
import { getFilePaths, buildFileTree, loadFileContent } from '@/utils/file-loader';

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
    <Page layout="full">
      {/* IDDL Section[Container]: Main IDE Area */}
      <Section role="Container" className="flex flex-1 overflow-hidden">
        {/* IDDL Section[ActivityBar]: Workspace Navigation (v1.1.0) */}
        <Section role="ActivityBar">
          <div className="flex-1">
            <WorkspaceNav onViewChange={setCurrentView} />
          </div>

          {/* Terminal Toggle */}
          <Group role="Toolbar" className="p-1.5">
            <Action
              icon="Terminal"
              prominence={showBottomPanel ? 'Primary' : 'Tertiary'}
              intent="Neutral"
              behavior={{ action: 'toggle', target: 'bottom-panel' }}
              onClick={() => setShowBottomPanel(!showBottomPanel)}
            />
          </Group>
        </Section>

        {/* IDDL Section[PrimarySidebar]: File Tree Sidebar (v1.1.0) */}
        {currentView === 'files' && (
          <Section role="PrimarySidebar">
            {/* Explorer Header */}
            <Section role="Header" className="px-3 py-2">
              <Text
                role="Title"
                prominence="Tertiary"
                className="text-xs font-semibold uppercase tracking-wide"
                content="Explorer"
              />
            </Section>

            {/* File Tree */}
            <Group role="Container" className="flex-1 overflow-y-auto px-2">
              <FileTree data={fileTreeData} onFileClick={handleFileClick} />
            </Group>
          </Section>
        )}

        {/* IDDL Section[Container]: Editor Area */}
        <Section role="Editor">
          {/* Editor Content */}
          <Group role="Container" className="flex-1 flex flex-col min-h-0">
            {currentView === 'files' && (
              <>
                {/* Editor Tabs */}
                {openFiles.length > 0 && <EditorTabs />}

                {/* Editor or Empty State */}
                {activeFile ? (
                  activeFile.name.endsWith('.tsx') || activeFile.name.endsWith('.jsx') ? (
                    <ComponentPreview
                      path={activeFile.path}
                      filename={activeFile.name}
                    />
                  ) : (
                    <CodeEditor
                      content={activeFile.content}
                      filename={activeFile.name}
                    />
                  )
                ) : (
                  <Section role="Container" prominence="Secondary" className="flex-1 flex items-center justify-center">
                    <Group role="Card" direction="vertical" className="text-center">
                      <Text role="Body" prominence="Primary" content="No file open" />
                      <Text
                        role="Caption"
                        prominence="Tertiary"
                        className="text-xs"
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

        {/* Right Sidebar */}
        <RightBar
          view={rightPanelView}
          projectName="ide-ui-kit"
          currentBranch="main"
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        {/* IDDL Section[Navigator]: Right Navigation */}
        <Section role="ActivityBar">
          <RightNav
            onViewChange={setRightPanelView}
            onClose={() => setRightPanelView(null)}
          />
        </Section>
      </Section>

      {/* Modals */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </Page>
  );
};
