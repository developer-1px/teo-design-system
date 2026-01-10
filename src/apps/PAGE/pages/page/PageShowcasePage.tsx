import {
  AlertTriangle,
  FileText,
  Layout,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import type { PageLayout, PageRole } from '@/components/types/Page/Page.types';
// Dynamic Type Imports
import pageTypesRaw from '@/components/types/Page/Page.types.ts?raw';
import { LAYOUT_SECTION_ROLES } from '@/components/types/Section/role-config';
import { Section } from '@/components/types/Section/Section';
import type { SectionRole } from '@/components/types/Section/Section.types';
import sectionTypesRaw from '@/components/types/Section/Section.types.ts?raw';
import { parseTsSource } from '../../utils/ts-doc-parser';

// Visual colors for section roles (keeping existing colors)
const ROLE_COLORS: Partial<Record<SectionRole, string>> = {
  Header: 'bg-blue-100/50 border-blue-200 text-blue-700',
  Footer: 'bg-gray-100/50 border-gray-200 text-gray-700',
  Status: 'bg-slate-800 text-white border-slate-900', // Unique for Status
  Main: 'bg-emerald-50/50 border-emerald-200 text-emerald-700',
  Container: 'bg-emerald-50/50 border-emerald-200 text-emerald-700',
  Navigator: 'bg-purple-100/50 border-purple-200 text-purple-700',
  Aside: 'bg-amber-100/50 border-amber-200 text-amber-700',
  Toolbar: 'bg-stone-100/50 border-stone-200 text-stone-700',
  ActivityBar: 'bg-indigo-100/50 border-indigo-200 text-indigo-700',
  PrimarySidebar: 'bg-purple-100/50 border-purple-200 text-purple-700',
  SecondarySidebar: 'bg-pink-100/50 border-pink-200 text-pink-700',
  Editor: 'bg-white border-slate-200 text-slate-700',
  Panel: 'bg-orange-100/50 border-orange-200 text-orange-700',
  Master: 'bg-cyan-100/50 border-cyan-200 text-cyan-700',
  Detail: 'bg-white border-slate-200 text-slate-700',
  DialogHeader: 'bg-sky-100/50 border-sky-200 text-sky-700',
  DialogContent: 'bg-white border-slate-200 text-slate-700',
  DialogFooter: 'bg-slate-100/50 border-slate-200 text-slate-700',
  // Fallback
  Region: 'bg-gray-100 border-gray-200 text-gray-700',
};


export function PageShowcasePage() {
  const [selectedLayout, setSelectedLayout] = useState<PageLayout>('Single');
  const [selectedRole, setSelectedRole] = useState<PageRole>('Document');
  const [disabledSections, setDisabledSections] = useState<Set<SectionRole>>(new Set());

  // 1. Parse Page Types
  const pageTypeDefs = useMemo(() => parseTsSource(pageTypesRaw, 'Page.types.ts'), []);
  const pageLayoutDef = useMemo(
    () => pageTypeDefs.find((def) => def.name === 'PageLayout'),
    [pageTypeDefs]
  );
  const pageRoleDef = useMemo(
    () => pageTypeDefs.find((def) => def.name === 'PageRole'),
    [pageTypeDefs]
  );

  // 2. Parse Section Types
  const sectionTypeDefs = useMemo(() => parseTsSource(sectionTypesRaw, 'Section.types.ts'), []);
  const sectionRoleDef = useMemo(
    () => sectionTypeDefs.find((def) => def.name === 'SectionRole'),
    [sectionTypeDefs]
  );

  // Available options
  const layouts: PageLayout[] = (pageLayoutDef?.members as PageLayout[]) || [
    'Single',
    'Sidebar',
    'Aside',
    'HolyGrail',
    'Split',
    'Studio',
    'Mobile',
  ];

  const roles: PageRole[] = (pageRoleDef?.members as PageRole[]) || [
    'Document',
    'Application',
    'Focus',
    'Fullscreen',
    'Immersive',
    'Overlay',
    'Paper',
  ];

  // Determine sections to render
  const validSections = LAYOUT_SECTION_ROLES[selectedLayout] || [];

  const renderSections = useMemo(
    () => validSections.filter((role) => !disabledSections.has(role)),
    [validSections, disabledSections]
  );

  const toggleSection = (role: SectionRole) => {
    setDisabledSections((prev) => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  // Validation Logic
  const validationResults = useMemo(() => {
    if (!sectionRoleDef) return [];
    return validSections.map((role) => ({
      role,
      isDefined: sectionRoleDef.members?.includes(role),
    }));
  }, [validSections, sectionRoleDef]);

  return (
    <Page title="Showcase" role="Document" layout="Sidebar">
      {/* Header */}
      <Section role="Header" prominence="Standard">
        <Block role="Toolbar" className="w-full">
          <Text
            role="Title"
            prominence="Standard"
            content="Page Layout Gallery (Dynamic + Validated)"
          />
          <Block role="ToolbarDivider">
            <></>
          </Block>
          <Text role="Body" prominence="Subtle" content="Strict IDDL 5.0 Implementation" />
        </Block>
      </Section>

      {/* Sidebar navigation */}
      <Section role="Nav" prominence="Standard" className="w-72">
        <Block role="ScrollMenu" className="p-2 gap-4 h-full">
          {/* Role Selector */}
          <Block role="Stack" className="gap-2">
            <Text role="Label" content="PHYSICS (ROLE)" prominence="Subtle" className="px-2" />
            <div className="flex flex-col gap-1">
              {roles.map((role) => {
                const Icon = FileText;
                const isSelected = selectedRole === role;
                return (
                  <div
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`
                       px-3 py-2 rounded-md cursor-pointer transition-all flex items-center gap-3
                       ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-surface-elevated text-text-secondary'}
                     `}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{role}</span>
                  </div>
                );
              })}
            </div>
          </Block>

          <Block role="Divider" />

          {/* Layout Selector */}
          <Block role="Stack" className="gap-2">
            <Text role="Label" content="ZONING (LAYOUT)" prominence="Subtle" className="px-2" />
            <div className="flex flex-col gap-1">
              {layouts.map((layout) => {
                const isSelected = selectedLayout === layout;
                const desc = pageLayoutDef?.memberDescriptions?.[layout];
                return (
                  <div
                    key={layout}
                    onClick={() => setSelectedLayout(layout)}
                    className={`
                       px-3 py-2 rounded-md cursor-pointer transition-all flex flex-col gap-1
                       ${isSelected ? 'bg-accent/10 text-accent' : 'hover:bg-surface-elevated text-text-secondary'}
                     `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>{layout}</span>
                      <Layout size={14} className="opacity-50" />
                    </div>
                    {desc && (
                      <span className="text-[10px] opacity-70 line-clamp-1">
                        {desc.split('(')[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Block>
        </Block>
      </Section>

      {/* Main Content */}
      <Section role="Main" prominence="Standard" mode="view">
        <Block
          role="Container"
          className="p-8 gap-8 w-full max-w-6xl mx-auto h-full"
        >
          {/* Section Toggles (Outside the preview box) */}
          <div className="flex flex-col items-center gap-4 w-full bg-white p-6 rounded-2xl border border-border-default shadow-lg mb-8 transition-all hover:shadow-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 font-black">
              <Layout size={14} className="text-primary" />
              Section Toggles
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl px-4">
              {validSections.map((role) => {
                const isDisabled = disabledSections.has(role);
                const colorClass = ROLE_COLORS[role] || 'bg-gray-100 text-gray-500';

                return (
                  <button
                    key={role}
                    onClick={() => toggleSection(role)}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
                      border-2 flex items-center gap-3 active:scale-95
                      ${isDisabled
                        ? 'bg-slate-50 border-slate-100 text-slate-300 opacity-50'
                        : `bg-white ${colorClass.split(' ')[1]} ${colorClass.split(' ')[2]} shadow-md hover:shadow-lg translate-y-[-2px]`
                      }
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-slate-300' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]'}`} />
                    {role}
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100 italic">
              Click to dynamically toggle sections and verify layout adaptation
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <Block
            role="Card"
            className="aspect-[4/3] w-full bg-slate-100 p-8 border border-border-default rounded-xl shadow-inner relative overflow-hidden flex flex-col items-center justify-center flex-1"
          >
            {/* Simulation Window - Using Custom Block Role */}
            <Block
              role="DeviceFrame"
              className={`
              border-[6px] border-slate-900 overflow-hidden shadow-2xl relative
              ${selectedRole === 'Application' ? 'w-full h-full rounded-none' : ''}
              ${selectedRole === 'Document' ? 'w-full max-w-[850px] aspect-[3/4] rounded-2xl' : ''}
              ${selectedLayout === 'Mobile' ? 'w-[375px] h-[750px] rounded-[50px] border-[12px]' : ''}
              ${selectedRole === 'Paper' ? 'w-[210mm] h-[297mm] bg-white shadow-none border-none scale-50 origin-top' : ''}
            `}
            >
              {/* 
                 ACTUAL PAGE COMPONENT 
                 Nested safely here to demonstrate internal layout 
               */}
              <Page
                title="Page Showcase"
                role={selectedRole}
                layout={selectedLayout}
                className={`w-full h-full !min-h-0 relative ${selectedRole === 'Paper' ? 'scale-75 origin-top' : ''}`}
              >
                {renderSections.map((role) => {
                  const validationResult = validationResults.find((r) => r.role === role);
                  const isMissing = !validationResult?.isDefined;

                  return (
                    <Section key={role} role={role} className="relative group overflow-hidden">
                      <Block
                        role="SectionHighlight"
                        className={`
                       ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-500'}
                       ${isMissing ? 'ring-2 ring-red-500 ring-inset' : ''} 
                     `}
                      >
                        <div className="p-2 border-b border-black/5 flex items-center justify-center bg-black/5 gap-2">
                          <Text role="Label" content={role} className="font-bold text-xs" />
                          {isMissing && <AlertTriangle size={12} className="text-red-600" />}
                        </div>

                        <div className="flex-1 overflow-auto p-4 flex flex-col">
                          <div className="text-[10px] opacity-50 text-center uppercase tracking-wider mb-2">
                            {role} Area
                          </div>
                          {role === 'Main' && selectedRole === 'Document' ? (
                            <div className="flex flex-col gap-4">
                              {Array.from({ length: 15 }).map((_, i) => (
                                <Block
                                  key={i}
                                  role="Mock"
                                  className="h-24 flex items-center justify-center border-dashed"
                                >
                                  Document Content Block {i + 1}
                                </Block>
                              ))}
                            </div>
                          ) : (
                            <Block role="Mock" className="h-full flex items-center justify-center">
                              Mock Content
                            </Block>
                          )}
                        </div>
                      </Block>
                    </Section>
                  );
                })}
              </Page>
            </Block>
          </Block>
        </Block>
      </Section>

    </Page>
  );
}
