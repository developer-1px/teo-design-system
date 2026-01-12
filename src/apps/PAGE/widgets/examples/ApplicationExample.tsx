/**
 * ApplicationExample - Full-screen application layout examples
 *
 * Use cases: IDE, Dashboard, Studio, Data Analysis Tools
 */

import {
  BarChart3,
  Bell,
  Code,
  File,
  Folder,
  FolderTree,
  GitBranch,
  Play,
  RefreshCw,
  Save,
  Search,
  Settings,
  Terminal,
  X,
} from 'lucide-react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import type { PageLayout } from '@/components/dsl/Page/Page.types';
import { Section } from '@/components/dsl/Section/Section';

interface ApplicationExampleProps {
  layout: PageLayout;
}

export function ApplicationExample({ layout }: ApplicationExampleProps) {
  const isWorkbench = layout === 'Workbench';
  const isSplit = layout === 'Split';

  return (
    <>
      <Section role="Toolbar">
        <Block role="Toolbar" className="px-6 py-3 border-b border-slate-200/50 bg-white">
          <Block role="Stack" className="flex-row items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code size={18} className="text-primary" />
            </div>
            <Block role="Stack" density="Compact">
              <Text
                role="Label"
                content="STRATA STUDIO"
                prominence="Strong"
                className="text-xs font-black tracking-widest"
              />
              <Text
                role="Caption"
                content="iddl-core-v6 • main"
                prominence="Subtle"
                className="text-[10px] opacity-40"
              />
            </Block>
          </Block>
          <Block role="Stack" className="flex-row gap-3">
            <Action
              role="Button"
              label="Compile"
              prominence="Strong"
              intent="Positive"
              className="h-9 px-4 rounded-lg shadow-sm"
            >
              <Play size={14} className="fill-current" />
            </Action>
            <Action
              role="Button"
              label="Commit"
              prominence="Standard"
              className="h-9 px-4 rounded-lg"
            >
              <Save size={14} />
            </Action>
            <Action role="IconButton" prominence="Subtle" className="h-9 w-9 rounded-lg">
              <Settings size={18} />
            </Action>
          </Block>
        </Block>
      </Section>

      {isWorkbench && (
        <>
          {/* Section: Activity Bar (Leftmost) */}
          <Section
            role="ActivityBar"
            variant="Plain"
            className="w-16 border-r border-slate-200 bg-slate-50 flex flex-col items-center py-6 gap-6"
          >
            {['Files', 'Search', 'Git', 'Extensions', 'Monitor'].map((item, i) => (
              <Action
                key={i}
                role="IconButton"
                permanence={i === 0 ? 'Strong' : 'Subtle'}
                intent={i === 0 ? 'Brand' : 'Neutral'}
                className="h-10 w-10 rounded-xl transition-all hover:scale-110"
              >
                {i === 0 && <FolderTree size={22} />}
                {i === 1 && <Search size={22} />}
                {i === 2 && <Code size={22} />}
                {i === 3 && <Play size={22} />}
                {i === 4 && <BarChart3 size={22} />}
              </Action>
            ))}
            <div className="mt-auto flex flex-col items-center gap-6">
              <Action role="IconButton" prominence="Subtle" className="h-10 w-10 rounded-xl">
                <Settings size={22} />
              </Action>
            </div>
          </Section>

          {/* Section: Primary Sidebar (File Explorer) */}
          <Section
            role="PrimarySidebar"
            variant="Plain"
            scrollable
            className="w-72 border-r border-slate-200 bg-slate-50/50"
          >
            <Block role="Stack" density="Comfortable" className="p-6">
              <Block role="Toolbar" className="items-center mb-6">
                <Text
                  role="Label"
                  content="EXPLORER"
                  prominence="Strong"
                  className="text-[11px] font-black tracking-[0.2em] opacity-30"
                />
                <Action role="IconButton" prominence="Subtle" className="h-7 w-7 rounded-lg">
                  <RefreshCw size={14} className="opacity-40" />
                </Action>
              </Block>

              <Block role="Tree" density="Compact" className="space-y-1.5">
                {[
                  { name: 'node_modules', type: 'folder', color: 'text-slate-400' },
                  {
                    name: 'src',
                    type: 'folder',
                    color: 'text-primary',
                    open: true,
                    children: [
                      { name: 'components', type: 'folder', color: 'text-primary' },
                      { name: 'hooks', type: 'folder', color: 'text-primary' },
                      { name: 'App.tsx', type: 'file', active: true },
                      { name: 'index.ts', type: 'file' },
                    ],
                  },
                  { name: 'package.json', type: 'file' },
                  { name: 'tsconfig.json', type: 'file' },
                ].map((node, i) => (
                  <div key={i} className="group">
                    <Action
                      role="TreeItem"
                      prominence={node.active ? 'Strong' : 'Subtle'}
                      className={`gap-3 h-9 px-3 rounded-xl transition-all ${node.active ? 'bg-primary/10 text-primary font-black shadow-soft-sm' : 'hover:bg-white hover:shadow-soft-sm'}`}
                    >
                      {node.type === 'folder' ? (
                        <Folder size={16} className={node.color} />
                      ) : (
                        <File size={16} className="opacity-30 group-hover:opacity-60" />
                      )}
                      <Text role="Label" content={node.name} className="text-xs font-semibold" />
                    </Action>
                    {node.children && (
                      <div className="ml-6 border-l-2 border-slate-200/50 pl-3 mt-1.5 space-y-1">
                        {node.children.map((child, j) => (
                          <Action
                            key={j}
                            role="TreeItem"
                            prominence={child.active ? 'Strong' : 'Subtle'}
                            className={`gap-3 h-9 px-3 rounded-xl w-full transition-all ${child.active ? 'bg-primary/10 text-primary font-black shadow-soft-sm' : 'hover:bg-white hover:shadow-soft-sm group'}`}
                          >
                            {child.type === 'folder' ? (
                              <Folder size={16} className={child.color} />
                            ) : (
                              <File
                                size={16}
                                className={
                                  child.active
                                    ? 'text-primary'
                                    : 'opacity-30 group-hover:opacity-60'
                                }
                              />
                            )}
                            <Text
                              role="Label"
                              content={child.name}
                              className="text-xs font-semibold"
                            />
                          </Action>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Block>
            </Block>
          </Section>

          {/* Main Editor Slot */}
          <Section role="Editor" className="flex-1 bg-white">
            <Block role="Stack" className="h-full">
              {/* Tab Bar */}
              <Block
                role="Tabs"
                className="bg-slate-50 border-b border-slate-200 h-11 px-2 items-center gap-1.5"
              >
                <Action
                  role="Tab"
                  label="App.tsx"
                  prominence="Strong"
                  intent="Brand"
                  className="h-9 bg-white border border-slate-200 border-b-white rounded-t-xl px-4 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] text-xs font-bold"
                />
                <Action
                  role="Tab"
                  label="index.ts"
                  prominence="Subtle"
                  className="h-9 px-4 opacity-40 hover:opacity-100 text-xs font-bold transition-all"
                />
                <Action
                  role="Tab"
                  label="globals.css"
                  prominence="Subtle"
                  className="h-9 px-4 opacity-40 hover:opacity-100 text-xs font-bold transition-all"
                />
              </Block>

              {/* Code Editor Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Line Numbers */}
                <div className="w-14 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center py-8 text-[11px] font-mono opacity-30 select-none">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="h-7 leading-7">
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Editor Content */}
                <Block
                  role="Card"
                  prominence="Subtle"
                  className="flex-1 p-8 border-none bg-transparent font-mono text-[14px] leading-7 overflow-auto"
                >
                  <pre className="text-slate-800">
                    <span className="text-purple-600 font-bold">import</span> {'{'} Page {'}'}{' '}
                    <span className="text-purple-600 font-bold">from</span>{' '}
                    <span className="text-green-600">'@/dsl/Page'</span>;{'\n\n'}
                    <span className="text-blue-600 font-black">function</span>{' '}
                    <span className="text-yellow-600 font-bold">App</span>() {'{'}
                    {'\n'}
                    {'  '}
                    <span className="text-purple-600 font-bold">return</span> ({'\n'}
                    {'    '}
                    <span className="text-blue-500 font-black">{'<Page'}</span>{' '}
                    <span className="text-orange-600">role</span>=
                    <span className="text-green-700">"Application"</span>{' '}
                    <span className="text-orange-600">layout</span>=
                    <span className="text-green-700">"Workbench"</span>
                    {'>'}
                    {'\n'}
                    {'      '}
                    <span className="text-slate-400 font-normal opacity-50">
                      {'/* Declarative Layout System */'}
                    </span>
                    {'\n'}
                    {'    '}
                    <span className="text-blue-500 font-black">{'</Page>'}</span>
                    {'\n'}
                    {'  '});{'\n'}
                    {'}'}
                    {'\n\n'}
                    <span className="text-purple-600 font-black">export default</span> App;
                  </pre>
                </Block>
              </div>
            </Block>
          </Section>

          {/* Section: Panel (Bottom) */}
          <Section role="Panel" className="h-64 border-t border-slate-200 bg-white">
            <Block role="Stack" density="Compact" className="h-full">
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
                <Block role="Stack" className="flex-row items-center gap-8">
                  <Text
                    role="Label"
                    content="TERMINAL"
                    prominence="Strong"
                    className="text-[11px] font-black tracking-widest text-primary border-b-2 border-primary py-2"
                  />
                  <Text
                    role="Label"
                    content="DEBUG CONSOLE"
                    prominence="Subtle"
                    className="text-[11px] font-black tracking-widest opacity-20"
                  />
                  <Text
                    role="Label"
                    content="PROBLEMS"
                    prominence="Subtle"
                    className="text-[11px] font-black tracking-widest opacity-20"
                  />
                </Block>
                <div className="flex items-center gap-4">
                  <Action
                    role="IconButton"
                    prominence="Subtle"
                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                  >
                    <Terminal size={16} className="opacity-40" />
                  </Action>
                  <Action
                    role="IconButton"
                    prominence="Subtle"
                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                  >
                    <X size={16} className="opacity-40" />
                  </Action>
                </div>
              </div>
              <Block
                role="Card"
                prominence="Subtle"
                className="flex-1 p-6 font-mono text-[13px] overflow-auto bg-slate-50/30 border-none"
              >
                <div className="flex gap-3 mb-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-slate-600 font-medium">Bundled successfully in 124ms</span>
                </div>
                <div className="flex gap-3 mb-2">
                  <span className="text-primary font-black">$</span>
                  <span className="text-slate-900 font-bold">npm run build</span>
                </div>
                <div className="text-slate-400 mt-4 opacity-50 italic">
                  Compiling IDDL components into optimized static tokens...
                </div>
              </Block>
            </Block>
          </Section>

          {/* Status Bar */}
          <Section
            role="Statusbar"
            className="h-8 bg-primary text-white flex items-center px-4 justify-between text-[11px] font-bold tracking-tight"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:bg-white/10 px-3 h-full cursor-pointer transition-colors">
                <GitBranch size={12} />
                <span>main*</span>
              </div>
              <div className="flex items-center gap-2 hover:bg-white/10 px-3 h-full cursor-pointer transition-colors">
                <RefreshCw size={12} className="animate-spin-slow" />
                <span>Syncing Engine...</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:bg-white/10 px-3 h-full cursor-pointer transition-colors">
                <Bell size={12} />
                <span>2 INFOS</span>
              </div>
              <span className="opacity-60 font-black">UTF-8</span>
              <span className="opacity-60 font-black uppercase">TypeScript JSX</span>
            </div>
          </Section>
        </>
      )}

      {isSplit && (
        <>
          {/* Master - List */}
          <Section role="Sidebar" variant="Plain" scrollable>
            <Block role="Stack" density="Compact" className="p-4">
              <Block role="Toolbar">
                <Text role="Heading" content="Files" prominence="Strong" />
                <Action role="IconButton" prominence="Subtle">
                  <Search size={16} />
                </Action>
              </Block>

              <Block role="List" density="Compact">
                <Action role="ListItem" label="Dashboard.tsx" prominence="Strong" intent="Brand" />
                <Action role="ListItem" label="Settings.tsx" prominence="Standard" />
                <Action role="ListItem" label="Profile.tsx" prominence="Standard" />
                <Action role="ListItem" label="Analytics.tsx" prominence="Standard" />
              </Block>
            </Block>
          </Section>

          {/* Detail - Content */}
          <Section role="Main" scrollable>
            <Block role="Stack" density="Comfortable" className="p-6">
              <Text role="Title" content="Dashboard.tsx" prominence="Hero" />
              <Text
                role="Body"
                content="Main application dashboard component"
                prominence="Standard"
              />

              <Block role="Grid" className="grid-cols-2 gap-4 mt-6">
                <Block role="Card" prominence="Subtle" className="p-4">
                  <BarChart3 size={32} className="text-accent mb-2" />
                  <Text role="Label" content="Total Users" prominence="Strong" />
                  <Text role="Title" content="12,450" prominence="Hero" />
                </Block>

                <Block role="Card" prominence="Subtle" className="p-4">
                  <FolderTree size={32} className="text-green-500 mb-2" />
                  <Text role="Label" content="Active Projects" prominence="Strong" />
                  <Text role="Title" content="89" prominence="Hero" />
                </Block>
              </Block>
            </Block>
          </Section>
        </>
      )}

      {layout === 'Sidebar' && (
        <>
          {/* Sidebar */}
          <Section role="Sidebar" variant="Plain" scrollable>
            <Block role="Stack" density="Compact" className="p-4">
              <Text role="Label" content="Navigation" prominence="Strong" />
              <Block role="List" density="Compact">
                <Action role="ListItem" label="Dashboard" prominence="Strong" intent="Brand" />
                <Action role="ListItem" label="Analytics" prominence="Standard" />
                <Action role="ListItem" label="Settings" prominence="Standard" />
              </Block>
            </Block>
          </Section>

          {/* Main */}
          <Section role="Main" scrollable>
            <Block role="Stack" density="Comfortable" className="p-6">
              <Text role="Title" content="Application Dashboard" prominence="Hero" />
              <Text
                role="Body"
                content="Full-screen application with dedicated sidebar navigation"
                prominence="Standard"
              />
            </Block>
          </Section>
        </>
      )}
    </>
  );
}
