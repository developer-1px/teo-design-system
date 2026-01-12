import { Block } from '@/components/dsl/Block/Block';
import type { BlockRole } from '@/components/dsl/Block/Block.types';
import { ROLE_CONFIGS } from '@/components/dsl/Block/role-config';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';
import { Frame } from '@/components/dsl/shared/Frame';
import { SectionSpecDemo } from './examples/SectionSpecDemo';
import { LayoutPortalContext } from '@/components/dsl/Page/context/LayoutPortalContext';
import {
  Menu,
  Layout,
  List,
  FormInput,
  Bell,
  Layers,
  Search,
  Plus,
  ChevronDown,
  Command,
  Zap,
  Box,
  Cpu,
  Component,
  Package,
  Workflow
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

// Categorize roles for display
const CATEGORIES: Record<string, { roles: BlockRole[]; icon: any }> = {
  Layout: {
    roles: ['Card', 'ScrollArea', 'Collapsible', 'Splitter', 'AspectRatio', 'Divider', 'Tree', 'FeatureGrid'],
    icon: Layout,
  },
  Navigation: {
    roles: ['Tabs', 'Toolbar', 'Breadcrumbs', 'Pagination', 'Stepper'],
    icon: Menu,
  },
  Collection: {
    roles: ['List', 'Menu', 'SubMenu', 'DataTable', 'TreeView', 'SortableList'],
    icon: List,
  },
  Form: {
    roles: ['Form', 'FieldGroup', 'RadioGroup', 'CheckboxGroup', 'ButtonGroup'],
    icon: FormInput,
  },
  Overlay: {
    roles: ['Dialog', 'Sheet', 'Popover', 'Tooltip', 'Toast', 'HoverCard'],
    icon: Layers,
  },
  Feedback: {
    roles: ['Alert', 'Banner', 'EmptyState'],
    icon: Bell,
  },
};

export function BlockShowcasePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleScroll = (id: string, catName?: string) => {
    if (catName) setActiveCategory(catName);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const NavItem = ({ icon: Icon, label, id, catName, active }: { icon: any, label: string, id: string, catName?: string, active?: boolean }) => (
    <div
      onClick={() => handleScroll(id, catName)}
      className={cn(
        "group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 select-none",
        active ? "bg-hover text-text" : "text-muted hover:bg-hover hover:text-text"
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={16} className={cn("transition-colors", active ? "text-primary" : "text-subtle group-hover:text-muted")} />
        <span className="text-[13px] font-medium">{label}</span>
      </div>
    </div>
  );

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
    <Page role="Application" density="Compact" className="bg-surface-base text-text">

      {/* Sidebar Navigation (Linear Style) */}
      <Section role="Sidebar" width="240px" className="bg-surface-base border-r border-border-muted flex flex-col p-3 pt-4 select-none">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
            B
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-text">Block Explorer</span>
        </div>

        {/* Global Search Mock */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 mb-6 rounded-md bg-surface-sunken border border-border-muted cursor-pointer hover:bg-hover transition-all">
          <Search size={14} className="text-subtle" />
          <span className="text-[13px] text-muted flex-1">Find role...</span>
          <div className="flex items-center gap-1 opacity-20">
            <Command size={10} />
            <span className="text-[10px] font-bold">F</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SidebarSection>
            <NavItem
              icon={Zap}
              label="Core Philosophy"
              id="context"
              active={activeCategory === 'philosophy'}
              catName="philosophy"
            />
          </SidebarSection>

          {Object.entries(CATEGORIES).map(([name, data]) => (
            <SidebarSection key={name} title={name}>
              {data.roles.map((role) => (
                <NavItem
                  key={role}
                  icon={data.icon}
                  label={role}
                  id={role}
                  active={activeCategory === name}
                  catName={name}
                />
              ))}
            </SidebarSection>
          ))}
        </div>

        <div className="pt-4 border-t border-border-muted flex flex-col gap-1">
          <NavItem icon={Box} label="Block Registry" id="top" />
          <NavItem icon={Workflow} label="Layout Patterns" id="top" />
        </div>
      </Section>

      {/* Main Content Area */}
      <Section role="Main" scrollable className="bg-surface p-0">
        <LayoutPortalContext.Provider value={null}>
          <div className="max-w-5xl mx-auto px-12 py-16 pb-40">

            {/* Legend / Breadcrumbs */}
            <div className="flex items-center gap-3 mb-10 text-[13px] text-subtle font-medium">
              <span className="hover:text-text cursor-pointer transition-colors">Documentation</span>
              <span>/</span>
              <span className="hover:text-text cursor-pointer transition-colors text-muted font-semibold">Block Roles</span>
            </div>

            {/* 1. Context Awareness Header */}
            <header id="section-context" className="scroll-mt-20 mb-32">
              <Frame.Stack gap={4}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                  <Zap size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Core Architecture</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-text mb-2">Context-Aware Orchestration</h1>
                <p className="text-xl text-muted leading-relaxed max-w-3xl">
                  In IDDL, Blocks are not static components. They are functional entities that resolve their visual language based on the Section Role they inhabit.
                </p>
                <div className="mt-8 p-1 rounded-2xl bg-surface-sunken border border-border-muted">
                  <SectionSpecDemo />
                </div>
              </Frame.Stack>
            </header>

            {/* Render Categories */}
            {Object.entries(CATEGORIES).map(([catName, data]) => (
              <Frame.Stack key={catName} gap={20} className="mb-40">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-text tracking-tight">{catName} Module</h2>
                  <div className="flex-1 h-[1px] bg-border-muted" />
                </div>

                <div className="grid grid-cols-1 gap-16">
                  {data.roles.map((role) => {
                    const config = ROLE_CONFIGS[role as BlockRole];
                    if (!config) return null;

                    return (
                      <article key={role} id={`section-${role}`} className="scroll-mt-24 group">
                        <Frame.Stack gap={8}>
                          {/* Role Header */}
                          <div className="flex items-start justify-between">
                            <Frame.Stack gap={1.5}>
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-text group-hover:text-primary transition-colors">{role}</h3>
                                <div className="px-2 py-0.5 rounded-md bg-surface-raised border border-border-muted text-[10px] font-mono text-subtle tracking-tighter uppercase whitespace-nowrap">
                                  {config.htmlTag}
                                </div>
                              </div>
                              <p className="text-[14px] text-muted max-w-xl leading-relaxed">{config.description}</p>
                            </Frame.Stack>

                            <Action
                              role="Button"
                              label="View Spec"
                              className="text-[12px] h-8 px-4 rounded-full bg-surface-raised hover:bg-hover border border-border-muted transition-all opacity-0 group-hover:opacity-100"
                            />
                          </div>

                          {/* Linear-style Preview Card */}
                          <div className="relative overflow-hidden rounded-2xl border border-border-muted bg-surface-sunken min-h-[400px] flex flex-col p-1 shadow-sm">
                            {/* Subtle Inner Glow */}
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

                            {/* Toolbar Simulation */}
                            <div className="h-10 border-b border-border-muted flex items-center px-4 justify-between bg-surface-elevated/20">
                              <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-text opacity-10" />
                                <div className="w-2 h-2 rounded-full bg-text opacity-10" />
                                <div className="w-2 h-2 rounded-full bg-text opacity-10" />
                              </div>
                              <span className="text-[10px] font-bold text-subtle uppercase tracking-widest">{role} Preview</span>
                            </div>

                            <div className="flex-1 flex items-center justify-center p-12">
                              <div className="w-full max-w-2xl relative z-10 transition-transform duration-500 group-hover:scale-[1.01]">
                                {role === 'Divider' || role === 'DividerVertical' ? (
                                  <div className={role === 'DividerVertical' ? 'h-32 flex justify-center' : 'w-full'}>
                                    <Block role={role as BlockRole} />
                                  </div>
                                ) : role === 'FeatureGrid' ? (
                                  <Block role="FeatureGrid" spec={{ label: 'Orchestrated Grid', icon: Layout }}>
                                    <Text role="Heading" content="Semantic Intelligence" className="text-2xl" />
                                    <Text role="Body" content="FeatureGrid resolves layout and density based on context." className="text-muted" />
                                  </Block>
                                ) : role === 'CodeSnippet' ? (
                                  <Block role="CodeSnippet" spec={{ lines: [{ text: 'export const MyRole = () => <Block role="Card" />;' }] }} />
                                ) : (
                                  <div className="bg-surface p-8 rounded-xl border border-border-muted shadow-lg">
                                    <Block role={role as BlockRole} prominence="Standard" density="Compact">
                                      <Text role="Caption" content={`Live Implementation: ${role}`} className="text-primary font-semibold mb-6 block" />
                                      <Frame.Stack gap={4}>
                                        <div className="h-4 bg-surface-sunken rounded-full w-3/4 animate-pulse" />
                                        <div className="h-4 bg-surface-sunken rounded-full w-1/2 animate-pulse" />
                                        <Frame.Row gap={3} className="mt-4">
                                          <div className="h-9 w-24 rounded-lg bg-primary/80 hover:bg-primary transition-colors shadow-lg shadow-primary/20" />
                                          <div className="h-9 w-24 rounded-lg bg-surface-sunken border border-border-muted" />
                                        </Frame.Row>
                                      </Frame.Stack>
                                    </Block>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Frame.Stack>
                      </article>
                    );
                  })}
                </div>
              </Frame.Stack>
            ))}
          </div>
        </LayoutPortalContext.Provider>
      </Section>

      {/* Floating Navigator (Linear Style) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-surface-elevated/90 backdrop-blur-xl border border-border-default rounded-full h-[44px] px-2 flex items-center gap-1 shadow-2xl">
          <div
            onClick={() => handleScroll('context', 'philosophy')}
            className="px-4 py-1.5 flex items-center gap-2 hover:bg-hover rounded-full cursor-pointer transition-colors"
          >
            <Zap size={14} className="text-primary" />
            <span className="text-[13px] font-medium text-text">Architecture</span>
          </div>
          <div className="w-[1px] h-4 bg-border-muted mx-1" />

          {Object.keys(CATEGORIES).map(cat => (
            <div
              key={cat}
              onClick={() => handleScroll(CATEGORIES[cat].roles[0], cat)}
              className={cn(
                "p-2 hover:bg-hover rounded-full cursor-pointer transition-colors group",
                activeCategory === cat ? "text-primary" : "text-subtle"
              )}
            >
              <Component size={18} className="group-hover:scale-110 transition-transform" />
            </div>
          ))}

          <div className="w-[1px] h-4 bg-border-muted mx-1" />
          <div className="flex items-center gap-1 pr-4 pl-2 opacity-40">
            <Command size={12} />
            <span className="text-[12px] font-bold text-text">K</span>
          </div>
        </div>
      </div>
    </Page>
  );
}
