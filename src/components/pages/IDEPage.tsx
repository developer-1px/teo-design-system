/**
 * IDEPage - Full IDE with Toolbar, Nav, Editor, Terminal
 */

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/Layout';
import { IconButton } from '@/components/ui/IconButton';
import { RightBar } from '@/components/ui/RightBar';
import { RightNav } from '@/components/workspace/RightNav';
import { BottomPanel } from '@/components/ui/BottomPanel';
import { WorkspaceNav } from '@/components/workspace/WorkspaceNav';
import { FileTree, type FileNode } from '@/components/file-tree/FileTree';
import { EditorTabs } from '@/components/editor/EditorTabs';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ComponentPreview } from '@/components/editor/ComponentPreview';
import { SearchModal } from '@/components/modal/SearchModal';
import { SettingsModal } from '@/components/modal/SettingsModal';
import { getFilePaths, buildFileTree, loadFileContent } from '@/utils/file-loader';
import { Terminal } from 'lucide-react';

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
    <Layout depth={0} className="flex h-full w-full flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Workspace Navigation */}
        <Layout depth={2} className="flex flex-col">
          <div className="flex-1">
            <WorkspaceNav onViewChange={setCurrentView} />
          </div>

          {/* Terminal Toggle Button */}
          <div className="p-1.5">
            <IconButton
              size="md"
              active={showBottomPanel}
              onClick={() => setShowBottomPanel(!showBottomPanel)}
              title="Terminal"
            >
              <Terminal size={20} />
            </IconButton>
          </div>
        </Layout>

        {/* File Tree Sidebar */}
        {currentView === 'files' && (
          <Layout depth={2} className="flex w-64 flex-col overflow-hidden">
            <Layout depth={1} rounded={false} className="px-3 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Explorer
              </h2>
            </Layout>
            <div className="flex-1 overflow-y-auto px-2">
              <FileTree data={fileTreeData} onFileClick={handleFileClick} />
            </div>
          </Layout>
        )}

        {/* Editor Area with Bottom Panel */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            {currentView === 'files' && (
              <>
                {openFiles.length > 0 && <EditorTabs />}

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
                  <Layout depth={3} className="flex-1 flex items-center justify-center">
                    <div className="text-center text-text-tertiary">
                      <p className="text-sm">No file open</p>
                      <p className="text-xs mt-1">
                        Select a file from the explorer to start editing
                      </p>
                    </div>
                  </Layout>
                )}
              </>
            )}
          </div>

          {/* Bottom Panel - Terminal */}
          <BottomPanel
            isOpen={showBottomPanel}
            onClose={() => setShowBottomPanel(false)}
            height={200}
          />
        </div>

        {/* Right Sidebar */}
        <RightBar
          view={rightPanelView}
          projectName="ide-ui-kit"
          currentBranch="main"
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        {/* Right Navigation */}
        <Layout depth={2} className="flex flex-col">
          <RightNav
            onViewChange={setRightPanelView}
            onClose={() => setRightPanelView(null)}
          />
        </Layout>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </Layout>
  );
};
