/**
 * IDEPage - Linear Benchmark UI
 * Redesigned to mimic Linear's high-end, task-focused aesthetic.
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
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import { SearchModalDSL as SearchModal } from '@/components/dsl/Overlay/SearchModalDSL';
import { SettingsModalDSL as SettingsModal } from '@/components/dsl/Overlay/SettingsModalDSL';
import { Page } from '@/components/dsl/Page/Page.tsx';
import { RightBar } from '@/components/dsl/Section/role/RightBar.tsx';
import { Section } from '@/components/dsl/Section/Section.tsx';
import { Frame } from '@/components/dsl/shared/Frame';
import type { TreeNode } from '@/shared/lib/keyboard/useTreeNavigation';
import {
  Plus,
  Search,
  Inbox,
  Layers,
  Map as MapIcon,
  Target,
  Circle,
  ChevronDown,
  MoreHorizontal,
  Bell,
  Command,
  Layout,
  FileText,
  Code2,
  Terminal,
  Settings,
  User,
  Zap
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface OpenFile {
  path: string;
  name: string;
  content: string;
}

export const IDEPage = () => {
  const [currentView, setCurrentView] = useState('files');
  const [rightPanelView, setRightPanelView] = useState<string | null>(null);
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [fileTreeData] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // File Tree Conversion Logic
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
    return convert(fileTreeData);
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

  const NavItem = ({ icon: Icon, label, view, badge }: { icon: any, label: string, view: string, badge?: string }) => {
    const active = currentView === view;
    return (
      <div
        onClick={() => {
          setCurrentView(view);
          if (!showSidebar) setShowSidebar(true);
        }}
        className={cn(
          "group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 select-none",
          active ? "bg-surface-active text-text" : "text-muted hover:bg-hover hover:text-text/80"
        )}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} className={cn("transition-colors", active ? "text-primary" : "text-subtle group-hover:text-muted")} />
          <span className="text-[13px] font-medium">{label}</span>
        </div>
        {badge && (
          <span className="text-[11px] opacity-40 px-1.5 py-0.5 rounded bg-surface-hover">{badge}</span>
        )}
      </div>
    );
  };

  const SidebarSection = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="flex flex-col gap-1 mb-6">
      {title && (
        <div className="px-3 mb-1 flex items-center justify-between group">
          <span className="text-[11px] font-bold text-subtle tracking-wider uppercase">{title}</span>
          <Plus size={14} className="opacity-0 group-hover:opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
      )}
      {children}
    </div>
  );

  return (
    <Page title="Linear Studio" role="Application" layout="Workbench" density="Compact" className="bg-surface-base text-text">

      {/* Linear Sidebar - Merged Activity + Primary */}
      <Section
        role="PrimarySidebar"
        width="240px"
        className="bg-surface-sunken border-r border-border-muted flex flex-col p-3 pt-4 select-none"
      >
        {/* Workspace Switcher */}
        <div className="flex items-center justify-between px-2 mb-6 cursor-pointer group hover:bg-hover p-1 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-primary/20">
              L
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-text/90 group-hover:text-text">Linear Studio</span>
          </div>
          <ChevronDown size={14} className="opacity-40 group-hover:opacity-100" />
        </div>

        {/* Search & Inbox */}
        <SidebarSection>
          <div
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 mb-2 rounded-md bg-surface-elevated/20 border border-white/[0.05] cursor-pointer hover:bg-hover transition-all"
          >
            <Search size={14} className="text-subtle" />
            <span className="text-[13px] text-subtle flex-1">Search...</span>
            <div className="flex items-center gap-1 opacity-20">
              <Command size={10} />
              <span className="text-[10px] font-bold">K</span>
            </div>
          </div>
          <NavItem icon={Inbox} label="Inbox" view="inbox" badge="3" />
          <NavItem icon={Zap} label="My Issues" view="issues" />
          <NavItem icon={Layers} label="Views" view="views" />
          <NavItem icon={Target} label="Roadmap" view="roadmap" />
        </SidebarSection>

        {/* Resources / Files */}
        <SidebarSection title="Workspace">
          <NavItem icon={Code2} label="Explorers" view="files" />

          {currentView === 'files' && (
            <div className="mt-1 ml-4 border-l border-white/5 pl-2 mb-2">
              <Block
                role="Tree"
                className="py-1 tree-linear"
                spec={{
                  data: treeNodes,
                  defaultExpandedIds: ['/src', '/src/apps'],
                  onNodeClick: (node: any) => {
                    if (node.type === 'file' && node.path) {
                      handleFileClick(node.path);
                    }
                  },
                  selectable: true,
                }}
              />
            </div>
          )}

          <NavItem icon={Search} label="Global Search" view="search" />
          <NavItem icon={Terminal} label="Terminal" view="terminal" />
          <NavItem icon={MapIcon} label="Project Flow" view="flow" />
        </SidebarSection>

        {/* Teams & Projects */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SidebarSection title="Your Teams">
            <NavItem icon={Circle} label="Core Team" />
            <NavItem icon={Circle} label="Design System" />
          </SidebarSection>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
          <NavItem icon={User} label="My Account" />
          <NavItem icon={Settings} label="Settings" />
        </div>
      </Section>

      {/* Main Content Area (Linear Style) */}
      <Section role="Editor" className="bg-surface flex-1 flex flex-col overflow-hidden">

        {/* Header / Toolbar (Linear Style) */}
        <div className="h-[56px] min-h-[56px] border-b border-border-muted flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="p-1 hover:bg-white/5 rounded transition-colors cursor-pointer">
              <Layout size={18} className="opacity-60" />
            </div>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-white/30 text-[13px]">Projects</span>
              <span className="text-white/30 text-[13px]">/</span>
              <span className="text-white/90 text-[14px] font-medium truncate">Ide-ui-kit (Design System)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-surface bg-surface-elevated flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <Action role="Button" variant="Primary" className="bg-primary hover:bg-primary-hover text-on-primary rounded-md h-[32px] px-3 text-[13px] font-medium shadow-lg shadow-primary/20">
              New Issue
            </Action>
            <div className="p-2 hover:bg-hover rounded transition-colors cursor-pointer ml-1 relative">
              <Bell size={18} className="opacity-60" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-surface" />
            </div>
          </div>
        </div>

        {/* Editor Tabs (Hidden or Linear Style) */}
        {openFiles.length > 0 && (
          <div className="flex items-center px-4 pt-4 overflow-hidden mask-fade-right">
            {openFiles.map(file => (
              <div
                key={file.path}
                onClick={() => setActiveFilePath(file.path)}
                className={cn(
                  "px-4 py-1.5 rounded-t-lg text-[13px] transition-all cursor-pointer border-x border-t whitespace-nowrap",
                  file.path === activeFilePath
                    ? "bg-surface-sunken border-border-muted text-text opacity-100"
                    : "bg-transparent border-transparent text-subtle hover:text-muted opacity-60"
                )}
              >
                {file.name}
              </div>
            ))}
          </div>
        )}

        {/* Centered Content Container */}
        <div className="flex-1 overflow-y-auto bg-surface-sunken">
          <div className="max-w-[1200px] mx-auto w-full h-full p-8">
            {activeFile ? (
              <div className="bg-surface-sunken rounded-xl border border-border-muted overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
                {activeFile.name.endsWith('.tsx') ? (
                  <ComponentPreview path={activeFile.path} filename={activeFile.name} />
                ) : (
                  <CodeEditor content={activeFile.content} filename={activeFile.name} />
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-12">
                  <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full" />
                  <Zap size={80} className="text-primary opacity-60 relative z-10" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-text mb-4">Linear Studio Experience</h1>
                <p className="text-muted text-lg max-w-md mb-12">
                  Building tools with the precision and speed of Linear. Press ⌘K to open the command palette.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
                  {[
                    { icon: Plus, label: 'Create new component', sub: '⌘ C' },
                    { icon: Search, label: 'Find documentation', sub: '⌘ F' },
                    { icon: Layers, label: 'Explore UI themes', sub: '⌘ T' },
                    { icon: Target, label: 'View project roadmap', sub: '⌘ R' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-start p-4 rounded-xl bg-surface-elevated/20 border border-border-muted hover:bg-surface-elevated/40 hover:border-border-default transition-all cursor-pointer text-left group">
                      <item.icon size={20} className="mb-3 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-[14px] font-medium text-text/80 mb-1">{item.label}</span>
                      <span className="text-[11px] font-bold text-subtle">{item.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Taskbar / Action Bar (Linear Style) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-surface-elevated/90 backdrop-blur-xl border border-border-muted rounded-full h-[40px] px-1.5 flex items-center gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="px-3 py-1 flex items-center gap-2 hover:bg-hover rounded-full cursor-pointer transition-colors">
              <Zap size={14} className="text-primary" />
              <span className="text-[13px] font-medium">Actions</span>
            </div>
            <div className="w-[1px] h-4 bg-border-muted mx-1" />
            {[
              { icon: Plus, label: 'Issue' },
              { icon: Inbox, label: 'Inbox' },
              { icon: Target, label: 'Goals' }
            ].map(item => (
              <div key={item.label} className="p-1.5 hover:bg-hover rounded-full cursor-pointer transition-colors text-muted hover:text-text">
                <item.icon size={18} />
              </div>
            ))}
            <div className="w-[1px] h-4 bg-border-muted mx-1" />
            <div className="flex items-center gap-1 pr-3 pl-1 opacity-40">
              <Command size={12} />
              <span className="text-[12px] font-bold leading-none">K</span>
            </div>
          </div>
        </div>

      </Section>

      {/* Floating Panel (Bottom panel replacement) */}
      {showBottomPanel && (
        <Section
          role="Panel"
          height="300px"
          resizable={{ direction: 'top', minSize: 100, maxSize: 600 }}
          className="border-t border-[#262626] bg-[#0c0c0d] z-40"
        >
          <BottomPanel onClose={() => setShowBottomPanel(false)} />
        </Section>
      )}

      {/* Right UI components (Linear Sidebar style) */}
      {rightPanelView && (
        <Section
          role="SecondarySidebar"
          width="320px"
          className="bg-[#0c0c0d] border-l border-[#262626] p-6"
        >
          <RightBar
            view={rightPanelView}
            projectName="ide-ui-kit"
            currentBranch="main"
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        </Section>
      )}

      {/* Modals */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </Page>
  );
};
