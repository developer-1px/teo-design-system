import { Frame } from '@/components/dsl/shared/Frame';
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
        <Block role="Toolbar">
          <Frame.Stack className="flex-row items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code size={18} className="text-primary" />
            </div>
            <Frame.Stack density="Compact">
              <Text
                role="Label"
                content="STRATA STUDIO"
                prominence="Strong"
              />
              <Text
                role="Caption"
                content="iddl-core-v6 • main"
                prominence="Subtle"
              />
            </Frame.Stack>
          </Frame.Stack>
          <Frame.Stack className="flex-row gap-3">
            <Action
              role="Button"
              label="Compile"
              prominence="Strong"
              intent="Positive"
            >
              <Play size={14} className="fill-current" />
            </Action>
            <Action
              role="Button"
              label="Commit"
              prominence="Standard"
            >
              <Save size={14} />
            </Action>
            <Action role="IconButton" prominence="Subtle">
              <Settings size={18} />
            </Action>
          </Frame.Stack>
        </Block>
      </Section>

      {isWorkbench && (
        <>
          {/* Section: Activity Bar (Leftmost) */}
          <Section
            role="ActivityBar"
            prominence="Subtle"
          >
            <Frame.Stack align="center" gap={6} className="py-6">
              {['Files', 'Search', 'Git', 'Extensions', 'Monitor'].map((_, i) => (
                <Action
                  key={i}
                  role="IconButton"
                  prominence={i === 0 ? 'Strong' : 'Subtle'}
                  intent={i === 0 ? 'Brand' : 'Neutral'}
                >
                  {i === 0 && <FolderTree size={24} />}
                  {i === 1 && <Search size={22} />}
                  {i === 2 && <Code size={22} />}
                  {i === 3 && <Play size={22} />}
                  {i === 4 && <BarChart3 size={22} />}
                </Action>
              ))}
              <Frame.Spacer />
              <Action role="IconButton" prominence="Subtle">
                <Settings size={22} />
              </Action>
            </Frame.Stack>
          </Section>

          {/* Section: Primary Sidebar (File Explorer) */}
          <Section
            role="PrimarySidebar"
            scrollable
            prominence="Subtle"
          >
            <Frame.Stack density="Comfortable">
              <Block role="Toolbar">
                <Text
                  role="Label"
                  content="EXPLORER"
                  prominence="Strong"
                />
                <Action role="IconButton" prominence="Subtle">
                  <RefreshCw size={14} />
                </Action>
              </Block>

              <Block role="Tree" density="Compact">
                {[
                  { name: 'node_modules', type: 'folder' },
                  {
                    name: 'src',
                    type: 'folder',
                    open: true,
                    children: [
                      { name: 'components', type: 'folder' },
                      { name: 'hooks', type: 'folder' },
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
                      prominence={(node as any).active ? 'Strong' : 'Subtle'}
                      intent={(node as any).active ? 'Brand' : 'Neutral'}
                    >
                      {node.type === 'folder' ? (
                        <Folder size={16} />
                      ) : (
                        <File size={16} />
                      )}
                      <Text role="Label" content={node.name} />
                    </Action>
                    {node.children && (
                      <div className="ml-6 space-y-1">
                        {node.children.map((child, j) => (
                          <Action
                            key={j}
                            role="TreeItem"
                            prominence={(child as any).active ? 'Strong' : 'Subtle'}
                            intent={(child as any).active ? 'Brand' : 'Neutral'}
                          >
                            {child.type === 'folder' ? (
                              <Folder size={16} />
                            ) : (
                              <File size={16} />
                            )}
                            <Text
                              role="Label"
                              content={child.name}
                            />
                          </Action>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Block>
            </Frame.Stack>
          </Section>

          {/* Main Editor Slot */}
          <Section role="Editor" className="flex-1 bg-white">
            <Frame.Stack className="h-full">
              {/* Tab Bar */}
              <Block
                role="Tabs"
              >
                <div className="flex flex-row items-end h-full px-2 gap-0.5">
                  <Action
                    role="Tab"
                    label="App.tsx"
                    prominence="Strong"
                    intent="Brand"
                  />
                  <Action
                    role="Tab"
                    label="index.ts"
                    prominence="Subtle"
                  />
                  <Action
                    role="Tab"
                    label="globals.css"
                    prominence="Subtle"
                  />
                </div>
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
                >
                  <pre>
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
            </Frame.Stack>
          </Section>

          {/* Section: Panel (Bottom) */}
          <Section role="Panel" prominence="Subtle">
            <Frame.Stack density="Compact">
              <Block role="Toolbar">
                <Frame.Stack className="flex-row items-center gap-8">
                  <Text
                    role="Label"
                    content="TERMINAL"
                    prominence="Strong"
                    intent="Brand"
                  />
                  <Text
                    role="Label"
                    content="DEBUG CONSOLE"
                    prominence="Subtle"
                  />
                  <Text
                    role="Label"
                    content="PROBLEMS"
                    prominence="Subtle"
                  />
                </Frame.Stack>
                <div className="flex items-center gap-4">
                  <Action
                    role="IconButton"
                    prominence="Subtle"
                  >
                    <Terminal size={16} />
                  </Action>
                  <Action
                    role="IconButton"
                    prominence="Subtle"
                  >
                    <X size={16} />
                  </Action>
                </div>
              </Block>
              <Block
                role="Card"
                prominence="Subtle"
              >
                <div className="flex gap-3 mb-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Bundled successfully in 124ms</span>
                </div>
                <div className="flex gap-3 mb-2">
                  <span className="text-primary font-black">$</span>
                  <span className="font-bold">npm run build</span>
                </div>
                <Text role="Caption" content="Compiling IDDL components into optimized static tokens..." prominence="Subtle" />
              </Block>
            </Frame.Stack>
          </Section>

          {/* Status Bar */}
          <Section
            role="Statusbar"
            intent="Brand"
            prominence="Hero"
          >
            <Block role="Toolbar">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 h-full cursor-pointer hover:bg-white/10 transition-colors">
                  <GitBranch size={12} />
                  <span>main*</span>
                </div>
                <div className="flex items-center gap-2 px-3 h-full cursor-pointer hover:bg-white/10 transition-colors">
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Syncing Engine...</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 h-full cursor-pointer hover:bg-white/10 transition-colors">
                  <Bell size={12} />
                  <span>2 INFOS</span>
                </div>
                <div className="flex items-center gap-4 mr-4">
                  <span className="opacity-60 font-black">UTF-8</span>
                  <span className="opacity-60 font-black uppercase">TypeScript JSX</span>
                </div>
              </div>
            </Block>
          </Section>
        </>
      )}

      {isSplit && (
        <>
          {/* Master - List */}
          <Section role="Sidebar" variant="Plain" scrollable>
            <Frame.Stack density="Compact" className="p-4">
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
            </Frame.Stack>
          </Section>

          {/* Detail - Content */}
          <Section role="Main" scrollable>
            <Frame.Stack density="Comfortable" className="p-6">
              <Text role="Title" content="Dashboard.tsx" prominence="Hero" />
              <Text
                role="Body"
                content="Main application dashboard component"
                prominence="Standard"
              />

              <Frame.Grid className="grid-cols-2 gap-4 mt-6">
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
              </Frame.Grid>
            </Frame.Stack>
          </Section>
        </>
      )}

      {layout === 'Sidebar' && (
        <>
          {/* Sidebar */}
          <Section role="Sidebar" variant="Plain" scrollable>
            <Frame.Stack density="Compact" className="p-4">
              <Text role="Label" content="Navigation" prominence="Strong" />
              <Block role="List" density="Compact">
                <Action role="ListItem" label="Dashboard" prominence="Strong" intent="Brand" />
                <Action role="ListItem" label="Analytics" prominence="Standard" />
                <Action role="ListItem" label="Settings" prominence="Standard" />
              </Block>
            </Frame.Stack>
          </Section>

          {/* Main */}
          <Section role="Main" scrollable>
            <Frame.Stack density="Comfortable" className="p-6">
              <Text role="Title" content="Application Dashboard" prominence="Hero" />
              <Text
                role="Body"
                content="Full-screen application with dedicated sidebar navigation"
                prominence="Standard"
              />
            </Frame.Stack>
          </Section>
        </>
      )}
    </>
  );
}
