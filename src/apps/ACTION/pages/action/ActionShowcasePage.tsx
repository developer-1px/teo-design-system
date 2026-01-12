import { Frame } from '@/components/dsl/shared/Frame';
import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import {
  Grid3X3,
  MousePointer2,
  Layers,
  Zap,
  Activity,
  Maximize2,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function ActionShowcasePage() {
  const [activeCategoryId, setActiveCategoryId] = useState('matrix');
  const intents = ['Neutral', 'Brand', 'Positive', 'Caution', 'Critical', 'Info'] as const;

  const categories = [
    { id: 'matrix', label: 'Button Matrix', icon: Grid3X3 },
    { id: 'density', label: 'Density & Spacing', icon: Maximize2 },
    { id: 'combinations', label: 'UI Combinations', icon: Layers },
    { id: 'states', label: 'Button States', icon: Activity },
    { id: 'icons', label: 'Icon Buttons', icon: MousePointer2 },
    { id: 'components', label: 'Specialized Actions', icon: Zap },
    { id: 'links', label: 'Links', icon: LinkIcon },
  ];

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const PreviewCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="relative overflow-hidden rounded-2xl border border-border-muted bg-surface-sunken flex flex-col p-1 mb-8 group">
      <div className="h-10 border-b border-border-muted flex items-center px-4 justify-between bg-surface-elevated/20">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-text opacity-10" />
          <div className="w-2 h-2 rounded-full bg-text opacity-10" />
          <div className="w-2 h-2 rounded-full bg-text opacity-10" />
        </div>
        <span className="text-[10px] font-bold text-subtle uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-10 flex items-center justify-center overflow-x-auto">
        {children}
      </div>
    </div>
  );

  return (
    <ShowcasePage
      title="Actions"
      subtitle="Interactive Elements v6.0"
      description="Comprehensive set of interactive elements driven by the IDDL Token Engine. This showcase demonstrates Prominence, Intent, and Density axes in realistic UI contexts."
      categories={categories}
      activeCategoryId={activeCategoryId}
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Button Matrix */}
      <Frame.Stack id="matrix" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">1. Button Matrix</h2>
          <p className="text-muted text-[15px]">The core combinations of Prominence and Intent axes.</p>
        </div>

        <PreviewCard title="Interaction Matrix">
          <div className="flex flex-col gap-8 w-full">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="text-[11px] font-bold text-subtle uppercase tracking-widest">Axis</div>
              {intents.map((intent) => (
                <div key={intent} className="text-[11px] font-bold text-subtle uppercase tracking-widest text-center">{intent}</div>
              ))}
            </div>

            {/* Rows */}
            {['Hero', 'Strong', 'Standard', 'Subtle'].map((prominence: any) => (
              <div key={prominence} className="grid grid-cols-7 gap-4 items-center">
                <div className="text-[13px] font-semibold text-muted">{prominence}</div>
                {intents.map((intent) => (
                  <div key={intent} className="flex justify-center">
                    <Action
                      role="Button"
                      label="Action"
                      prominence={prominence}
                      intent={intent}
                      className="min-w-[80px]"
                      onClick={() => { }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 2. Density Test */}
      <Frame.Stack id="density" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">2. Density & Spacing</h2>
          <p className="text-muted text-[15px]">Adaptive layouts based on the Density axis (Compact, Standard, Comfortable).</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {(['Compact', 'Standard', 'Comfortable'] as any[]).map((d) => (
            <div key={d} className="bg-surface-sunken border border-border-muted rounded-2xl p-6 flex flex-col gap-6 hover:border-border-strong transition-colors">
              <div className="flex flex-col gap-1">
                <span className="text-primary text-[12px] font-bold uppercase tracking-widest">{d}</span>
                <span className="text-muted text-[13px]">Density scale</span>
              </div>

              <div className={cn(
                "flex flex-col gap-4",
                d === 'Compact' ? 'gap-2' : d === 'Comfortable' ? 'gap-6' : 'gap-4'
              )}>
                <Action role="Button" label="Primary Action" prominence="Hero" intent="Brand" />
                <Action role="Button" label="Secondary" prominence="Strong" />
                <div className="flex items-center gap-2">
                  <Action role="IconButton" icon="Plus" prominence="Standard" label="Add" />
                  <Action role="IconButton" icon="Settings" prominence="Standard" label="Config" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame.Stack>

      {/* 3. Real-world Combinations */}
      <Frame.Stack id="combinations" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">3. UI Combinations</h2>
          <p className="text-muted text-[15px]">Realistic implementation of interactive patterns using Action & Block.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <PreviewCard title="Studio Editor Header">
            <div className="flex flex-col gap-6 w-full">
              <div className="h-10 bg-surface-raised rounded-lg border border-border-muted flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-subtle">src / components /</span>
                  <span className="text-[13px] text-text font-medium">Action.tsx</span>
                </div>
                <div className="flex items-center gap-2">
                  <Action role="IconButton" icon="MoreHorizontal" prominence="Subtle" label="More" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-text">Interactive Design Language</h3>
                <div className="flex gap-2">
                  <Action role="Chip" label="v6.0-stable" intent="Positive" selected />
                  <Action role="Chip" label="TypeScript" selected={false} />
                </div>
              </div>
            </div>
          </PreviewCard>

          <PreviewCard title="Communication Card">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-text">Jane Doe</span>
                    <span className="text-[12px] text-subtle">2h ago</span>
                  </div>
                  <p className="text-[14px] text-muted leading-relaxed">I've updated the button tokens to support the new shadow-xl variant.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border-muted">
                <Action role="Button" label="Reply" prominence="Subtle" className="text-[12px]" />
                <Action role="Button" label="Like" prominence="Subtle" className="text-[12px]" />
                <div className="flex-1" />
                <Action
                  role="Button"
                  label="Resolve"
                  prominence="Strong"
                  intent="Positive"
                  size="sm"
                />
              </div>
            </div>
          </PreviewCard>
        </div>
      </Frame.Stack>

      {/* 4. Button States */}
      <Frame.Stack id="states" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">4. Button States</h2>
          <p className="text-muted text-[15px]">Dynamic states managed by the engine (Loading, Disabled, Selected).</p>
        </div>

        <PreviewCard title="Live State Demo">
          <div className="grid grid-cols-4 gap-8 w-full">
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Loading</span>
              <Action role="Button" label="Saving Changes" loading prominence="Hero" intent="Brand" />
            </div>
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Disabled</span>
              <Action role="Button" label="Submit" disabled prominence="Hero" intent="Critical" />
            </div>
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Selected</span>
              <Action role="Button" label="Active State" selected prominence="Strong" intent="Positive" />
            </div>
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Default</span>
              <Action role="Button" label="Idle Action" prominence="Standard" />
            </div>
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 5. Icon Buttons */}
      <Frame.Stack id="icons" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">5. Icon Buttons</h2>
          <p className="text-muted text-[15px]">Role-specific glyph actions with precise geometry.</p>
        </div>

        <PreviewCard title="Glyph Controls">
          <div className="flex flex-col gap-10 w-full">
            <div className="flex items-center gap-4 flex-wrap">
              <Action role="Button" label="Configure Systems" icon="Settings" prominence="Standard" />
              <Action role="Button" label="Delete Resource" icon="Trash" prominence="Hero" intent="Critical" />
              <Action role="Button" label="Commit Changes" icon="Save" prominence="Strong" intent="Brand" />
            </div>
            <div className="h-[1px] bg-border-muted" />
            <div className="flex items-center gap-6">
              <Action role="IconButton" icon="Settings" prominence="Standard" label="Settings" />
              <Action role="IconButton" icon="Trash" prominence="Hero" intent="Critical" label="Delete" />
              <Action role="IconButton" icon="Plus" prominence="Strong" intent="Brand" label="Add" />
              <Action role="IconButton" icon="MoreHorizontal" prominence="Subtle" label="More" />
              <Action role="IconButton" icon="Search" prominence="Standard" intent="Info" label="Search" />
            </div>
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 6. Specialized Actions */}
      <Frame.Stack id="components" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">6. Specialized Actions</h2>
          <p className="text-muted text-[15px]">Semantic components for complex contextual interactions.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <PreviewCard title="Navigation & Tags">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Tabs</span>
                <div className="flex gap-1 bg-surface-sunken p-1 rounded-lg">
                  <Action role="Tab" label="Overview" selected />
                  <Action role="Tab" label="Settings" />
                  <Action role="Tab" label="Analytics" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Interactive Chips</span>
                <div className="flex flex-wrap gap-2">
                  <Action role="Chip" label="JavaScript" icon="Code" selected intent="Brand" />
                  <Action role="Chip" label="React" selected={false} />
                  <Action role="Chip" label="Performance" intent="Positive" selected={false} />
                </div>
              </div>
            </div>
          </PreviewCard>

          <PreviewCard title="Menus & Overlays">
            <div className="flex flex-col gap-6 w-full">
              <div className="bg-surface rounded-xl border border-border-default overflow-hidden shadow-2xl">
                <Action role="MenuItem" label="Profile Settings" icon="User" />
                <Action role="MenuItem" label="Share Workspace" icon="Share2" />
                <div className="h-[1px] bg-border-muted" />
                <Action role="MenuItem" label="Logout" icon="LogOut" intent="Critical" />
              </div>
            </div>
          </PreviewCard>
        </div>
      </Frame.Stack>

      {/* 7. Links */}
      <Frame.Stack id="links" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text tracking-tight">7. Navigation Links</h2>
          <p className="text-muted text-[15px]">Semantic hyperlinks with standard typography.</p>
        </div>

        <PreviewCard title="External Connectivity">
          <div className="flex items-center gap-8">
            <Action role="Link" label="Documentation" href="#" />
            <Action role="Link" label="View Repository" icon="Github" href="#" intent="Brand" />
            <Action role="Link" label="System Status" icon="Activity" href="#" intent="Positive" />
          </div>
        </PreviewCard>
      </Frame.Stack>
    </ShowcasePage>
  );
}
