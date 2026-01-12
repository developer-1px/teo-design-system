import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';
import { Page } from '@/components/dsl/Page/Page';
import { Frame } from '@/components/dsl/shared/Frame';
import { LayoutPortalContext } from '@/components/dsl/Page/context/LayoutPortalContext';
import {
  Columns,
  Settings,
  Layout,
  Menu,
  Layers,
  Maximize2,
  ShieldAlert,
  Search,
  Activity,
  Plus,
  ChevronDown,
  Command,
  Zap,
  Box,
  Workflow,
  Component,
  Terminal,
  Code2,
  Map as MapIcon
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

const CATEGORIES = [
  { id: 'bar', label: 'Bar Category', icon: Menu, description: 'Horizontal, fixed-height strips (Headers, Footers, Toolbars).' },
  { id: 'panel', label: 'Panel Category', icon: Columns, description: 'Vertical, resizable areas (Sidebars, Rails).' },
  { id: 'main', label: 'Main Category', icon: Layout, description: 'Primary focus areas for task execution.' },
  { id: 'overlay', label: 'Overlay Category', icon: Maximize2, description: 'Floating contextual regions (Modals, Popovers).' },
  { id: 'validation', label: 'Rules & Validation', icon: ShieldAlert, description: 'Design constraints and context-aware enforcement.' },
];

export function SectionShowcasePage() {
  const [activeCat, setActiveCat] = useState('bar');

  const handleScroll = (id: string) => {
    setActiveCat(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const NavItem = ({ icon: Icon, label, id, active }: { icon: any, label: string, id: string, active?: boolean }) => (
    <div
      onClick={() => handleScroll(id)}
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
            S
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-text">Section Explorer</span>
        </div>

        {/* Global Search Mock */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 mb-6 rounded-md bg-surface-sunken border border-border-muted cursor-pointer hover:bg-hover transition-all">
          <Search size={14} className="text-subtle" />
          <span className="text-[13px] text-muted flex-1">Filter sections...</span>
          <div className="flex items-center gap-1 opacity-20">
            <Command size={10} />
            <span className="text-[10px] font-bold">F</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SidebarSection>
            <NavItem
              icon={Zap}
              label="Structural Legend"
              id="top"
              active={false}
            />
          </SidebarSection>

          <SidebarSection title="Architectures">
            {CATEGORIES.map((cat) => (
              <NavItem
                key={cat.id}
                icon={cat.icon}
                label={cat.label}
                id={cat.id}
                active={activeCat === cat.id}
              />
            ))}
          </SidebarSection>
        </div>

        <div className="pt-4 border-t border-border-muted flex flex-col gap-1">
          <NavItem icon={Box} label="Section Registry" id="top" />
          <NavItem icon={Workflow} label="Composition Rules" id="top" />
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
              <span className="hover:text-text cursor-pointer transition-colors text-muted font-semibold">Semantic Regions</span>
            </div>

            <header id="top" className="mb-32">
              <Frame.Stack gap={4}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                  <Zap size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Structural Intelligence</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-text mb-2">Semantic Structural Regions</h1>
                <p className="text-xl text-muted leading-relaxed max-w-3xl">
                  Sections create the structural scaffolding of an interface. They provide the 'Design Context' (spacing, density, typography) that all child Blocks must inherit.
                </p>
              </Frame.Stack>
            </header>

            {/* Render Categories */}
            {CATEGORIES.map((cat) => (
              <Frame.Stack key={cat.id} id={`section-${cat.id}`} gap={12} className="mb-40 group">
                <div className="border-b border-border-muted pb-8">
                  <Frame.Row align="center" gap={4} className="mb-3">
                    <cat.icon size={24} className="text-primary" />
                    <h2 className="text-3xl font-bold text-text tracking-tight">{cat.label}</h2>
                  </Frame.Row>
                  <p className="text-lg text-muted leading-relaxed max-w-2xl">{cat.description}</p>
                </div>

                {/* Linear-style Visualization Card */}
                <div className="relative overflow-hidden rounded-2xl border border-border-muted bg-surface-sunken min-h-[400px] flex flex-col p-8">
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-3xl transition-all duration-500 group-hover:scale-[1.01]">
                      {cat.id === 'bar' && (
                        <Frame.Stack gap={10}>
                          <Section role="Header" className="rounded-xl border border-border-default bg-surface-raised p-6 shadow-2xl">
                            <Frame.Row justify="between" align="center" width="fill">
                              <Text role="Label" content="Unified Header" className="text-text font-bold" />
                              <div className="flex gap-2">
                                <div className="h-8 w-20 rounded bg-surface-sunken border border-border-muted" />
                                <div className="h-8 w-20 rounded bg-primary/80 shadow-lg shadow-primary/20" />
                              </div>
                            </Frame.Row>
                          </Section>

                          <Section role="Toolbar" className="rounded-xl border border-border-muted border-dashed p-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-surface-sunken" />
                            <div className="h-4 bg-muted/20 rounded-full w-40" />
                          </Section>

                          <Section role="Footer" className="rounded-xl border border-border-muted bg-surface-sunken/50 p-4">
                            <Text role="Caption" content="Ready for deployment" className="opacity-40" />
                          </Section>
                        </Frame.Stack>
                      )}

                      {cat.id === 'panel' && (
                        <div className="h-[340px] w-full rounded-2xl border border-border-default overflow-hidden flex bg-surface-base shadow-2xl">
                          <Section role="ActivityBar" width="56px" className="border-r border-border-muted flex flex-col items-center py-6 gap-6 bg-surface-elevated">
                            {[Layers, Search, Settings].map((Icon, i) => (
                              <Icon key={i} size={20} className={i === 0 ? "text-primary" : "text-subtle opacity-20"} />
                            ))}
                          </Section>

                          <Section role="Sidebar" width="220px" className="border-r border-border-muted bg-surface-sunken/50">
                            <Frame.Stack padding={6} gap={6}>
                              <div className="h-4 bg-surface-raised rounded-full w-1/2" />
                              <Frame.Stack gap={3}>
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="h-8 rounded-lg bg-surface-raised border border-border-muted" />
                                ))}
                              </Frame.Stack>
                            </Frame.Stack>
                          </Section>

                          <Section role="Main" className="flex-1 flex items-center justify-center p-12">
                            <div className="w-full h-full rounded-xl bg-surface-sunken/20 border border-border-muted border-dashed flex flex-col items-center justify-center gap-4">
                              <Maximize2 size={32} className="opacity-10" />
                              <span className="text-[12px] font-bold text-subtle uppercase tracking-widest">Primary Frame</span>
                            </div>
                          </Section>
                        </div>
                      )}

                      {cat.id === 'main' && (
                        <Section role="Main" className="rounded-3xl border border-border-default bg-surface-raised shadow-2xl overflow-hidden min-h-[400px]">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
                          <Frame.Stack padding={16} gap={10} align="center" justify="center" height="fill" className="relative z-10">
                            <div className="p-6 rounded-[2.5rem] bg-primary/10 border border-primary/20 shadow-inner">
                              <Layout size={56} className="text-primary opacity-60" />
                            </div>
                            <Frame.Stack align="center" gap={3}>
                              <h3 className="text-4xl font-bold text-text tracking-tight">Main Workbench</h3>
                              <p className="text-lg text-muted text-center max-w-md">Primary task execution area optimized for focus and spacious interaction.</p>
                            </Frame.Stack>
                            <div className="w-full max-w-sm h-32 rounded-2xl bg-surface-sunken border border-border-muted mt-6 border-dashed" />
                          </Frame.Stack>
                        </Section>
                      )}

                      {cat.id === 'overlay' && (
                        <div className="h-[400px] border border-border-muted rounded-3xl bg-surface-base/50 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                          <Section role="Modal" className="w-[340px] shadow-2xl rounded-2xl border border-border-default bg-surface z-10 overflow-hidden transform group-hover:translate-y-[-8px] transition-transform duration-700">
                            <div className="h-14 border-b border-border-muted px-6 flex items-center bg-surface-raised/50">
                              <span className="text-[14px] font-bold text-text">Confirmation Required</span>
                            </div>
                            <div className="p-8">
                              <p className="text-[14px] text-muted leading-relaxed">Are you sure you want to resolve this section context? This action will synchronize all child nodes.</p>
                            </div>
                            <div className="p-4 border-t border-border-muted flex justify-end gap-3 bg-surface-sunken/20">
                              <div className="h-9 w-24 rounded-lg bg-surface-raised border border-border-default" />
                              <div className="h-9 w-24 rounded-lg bg-primary text-[13px] font-bold shadow-lg shadow-primary/20" />
                            </div>
                          </Section>
                        </div>
                      )}

                      {cat.id === 'validation' && (
                        <div className="p-8 rounded-2xl bg-surface-sunken/20 border border-border-muted border-dashed">
                          <Frame.Stack gap={8}>
                            <Section role="Header" className="rounded-xl border border-primary/30 bg-primary/5 p-8 relative overflow-hidden group/rule">
                              <div className="absolute top-0 right-0 p-3 opacity-20">
                                <ShieldAlert size={40} />
                              </div>
                              <Frame.Row justify="between" align="center">
                                <Frame.Stack gap={2}>
                                  <span className="text-[14px] font-bold text-primary">Rule Enforcement</span>
                                  <p className="text-[13px] text-muted max-w-md italic">Structural integrity is automatically synchronized with the IDDL registry.</p>
                                </Frame.Stack>
                                <div className="px-4 py-1.5 bg-primary rounded-full text-[11px] font-bold text-white shadow-lg shadow-primary/50">
                                  ENFORCED
                                </div>
                              </Frame.Row>
                            </Section>

                            <div className="p-6 rounded-xl bg-surface-sunken border border-border-default hover:border-border-strong transition-colors">
                              <Frame.Row gap={4} align="center">
                                <Activity size={20} className="text-subtle" />
                                <p className="text-[13px] text-muted">Real-time validation log active in the Workbench console.</p>
                              </Frame.Row>
                            </div>
                          </Frame.Stack>
                        </div>
                      )}
                    </div>
                  </div>
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
            onClick={() => handleScroll('top')}
            className="px-4 py-1.5 flex items-center gap-2 hover:bg-hover rounded-full cursor-pointer transition-colors"
          >
            <Zap size={14} className="text-primary" />
            <span className="text-[13px] font-medium text-text">Structural Legend</span>
          </div>
          <div className="w-[1px] h-4 bg-border-muted mx-1" />

          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleScroll(cat.id)}
              className={cn(
                "p-2 hover:bg-hover rounded-full cursor-pointer transition-colors group",
                activeCat === cat.id ? "text-primary" : "text-subtle"
              )}
            >
              <Component size={18} className="group-hover:scale-110 transition-transform" />
            </div>
          ))}

          <div className="w-[1px] h-4 bg-border-muted mx-1" />
          <div className="flex items-center gap-1 pr-4 pl-2 opacity-40">
            <Command size={12} />
            <span className="text-[12px] font-bold text-text">L</span>
          </div>
        </div>
      </div>
    </Page>
  );
}
