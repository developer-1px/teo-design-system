import type { ReactNode } from 'react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';
import { Frame } from '@/components/dsl/shared/Frame';
import {
  Plus,
  Search,
  ChevronDown,
  Command,
  Zap,
  Box,
  Workflow,
  Component,
  Layout,
  Layers,
  Search as SearchIcon
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ShowcaseCategory {
  id: string;
  label: string;
  icon?: any;
}

export interface ShowcasePageProps {
  title: string;
  subtitle?: string;
  description?: string;
  categories?: ShowcaseCategory[];
  activeCategoryId?: string;
  onCategoryChange?: (id: string) => void;
  sidebar?: ReactNode;
  children: ReactNode;
  mode?: 'view' | 'edit';
}

export const ShowcasePage = ({
  title,
  subtitle,
  description,
  categories = [],
  activeCategoryId,
  onCategoryChange,
  sidebar,
  children,
  mode = 'view',
}: ShowcasePageProps) => {
  return (
    <Page role="Application" density="Compact" className="bg-surface-base text-text">
      {/* Sidebar Section (Linear Style) */}
      <Section
        role="Sidebar"
        width="260px"
        className="bg-surface-base border-r border-border-muted flex flex-col p-3 pt-4 select-none"
      >
        {sidebar ? (
          sidebar
        ) : (
          <Frame.Column height="fill">
            {/* Branding */}
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
                {title.charAt(0)}
              </div>
              <span className="text-[14px] font-semibold tracking-tight text-text">{title} Explorer</span>
            </div>

            {/* Filter Input */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 mb-6 rounded-md bg-surface-sunken border border-border-muted cursor-pointer hover:bg-hover transition-all">
              <SearchIcon size={14} className="text-subtle" />
              <span className="text-[13px] text-muted flex-1">Filter items...</span>
              <div className="flex items-center gap-1 opacity-20">
                <Command size={10} />
                <span className="text-[10px] font-bold">F</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="flex flex-col gap-1 mb-6">
                <div className="px-3 mb-1 flex items-center justify-between group">
                  <span className="text-[11px] font-bold text-subtle tracking-wider uppercase">Categories</span>
                  <Plus size={14} className="opacity-0 group-hover:opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                </div>

                {categories.map((category) => {
                  const isActive = activeCategoryId === category.id;
                  const Icon = category.icon || Layers;
                  return (
                    <div
                      key={category.id}
                      onClick={() => onCategoryChange?.(category.id)}
                      className={cn(
                        "group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 select-none",
                        isActive ? "bg-hover text-text" : "text-muted hover:bg-hover hover:text-text"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={cn("transition-colors", isActive ? "text-primary" : "text-subtle group-hover:text-muted")} />
                        <span className="text-[13px] font-medium">{category.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border-muted flex flex-col gap-1">
              <div className="group flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer text-muted hover:text-text transition-colors">
                <Box size={16} className="text-subtle group-hover:text-muted" />
                <span className="text-[13px] font-medium">Registry</span>
              </div>
              <div className="group flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer text-muted hover:text-text transition-colors">
                <Zap size={16} className="text-subtle group-hover:text-muted" />
                <span className="text-[13px] font-medium">Specs</span>
              </div>
            </div>
          </Frame.Column>
        )}
      </Section>

      {/* Main Content Area */}
      <Section role="Main" scrollable className="bg-surface p-0" mode={mode}>
        <div className="max-w-5xl mx-auto px-12 py-16 pb-40">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 mb-10 text-[13px] text-subtle font-medium">
            <span className="hover:text-text cursor-pointer transition-colors">Documentation</span>
            <span>/</span>
            <span className="hover:text-text cursor-pointer transition-colors text-muted font-semibold">{title}</span>
            {activeCategoryId && (
              <>
                <span>/</span>
                <span className="text-primary font-semibold">
                  {categories.find((c) => c.id === activeCategoryId)?.label || ''}
                </span>
              </>
            )}
          </div>

          {/* Header Area */}
          <header className="mb-20">
            <Frame.Stack gap={4}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                <Zap size={12} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{subtitle || 'IDDL Atom'}</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-text mb-2">{title}</h1>
              {description && (
                <p className="text-xl text-muted leading-relaxed max-w-3xl">
                  {description}
                </p>
              )}
            </Frame.Stack>
          </header>

          {/* Content */}
          <div className="flex flex-col gap-24">
            {children}
          </div>
        </div>

        {/* Floating Navigator (Linear Style) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-surface-elevated/90 backdrop-blur-xl border border-border-default rounded-full h-[44px] px-2 flex items-center gap-1 shadow-2xl">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-1.5 flex items-center gap-2 hover:bg-hover rounded-full cursor-pointer transition-colors"
            >
              <Zap size={14} className="text-primary" />
              <span className="text-[13px] font-medium text-muted">Top</span>
            </div>
            <div className="w-[1px] h-4 bg-border-muted mx-1" />

            {categories.slice(0, 5).map(cat => (
              <div
                key={cat.id}
                onClick={() => onCategoryChange?.(cat.id)}
                className={cn(
                  "p-2 hover:bg-hover rounded-full cursor-pointer transition-colors group",
                  activeCategoryId === cat.id ? "text-text" : "text-subtle"
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
      </Section>
    </Page>
  );
};
