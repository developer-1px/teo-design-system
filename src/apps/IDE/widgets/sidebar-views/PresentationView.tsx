import { LayoutTemplate } from 'lucide-react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';
import { SidebarHeader } from './SidebarHeader';

export const PresentationView = () => {
  const slides = [
    { title: 'Intro: What is IDDL?', active: true },
    { title: 'Core Concepts: Intent vs Implementation', active: false },
    { title: 'Atomic Design Principles', active: false },
    { title: 'Layout System: Page & Section', active: false },
    { title: 'Functional Components: Block', active: false },
    { title: 'Token System: Role & Prominence', active: false },
    { title: 'Demo: IDE UI Kit', active: false },
    { title: 'Q&A', active: false },
  ];

  return (
    <>
      <SidebarHeader
        title="PRESENTATION"
        actions={
          <div className="flex items-center gap-1">
            <Action
              role="IconButton"
              icon="Plus"
              label="Add Slide"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="Play"
              label="Start Presentation"
              prominence="Subtle"
              density="Compact"
            />
          </div>
        }
      />

      <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <Block role="List" className="flex flex-col gap-2">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${slide.active ? 'bg-surface-raised border border-border-default' : 'hover:bg-surface-hover border border-transparent'}`}
            >
              {/* Thumbnail */}
              <div className="w-20 h-12 bg-surface-sunken rounded border border-border-default flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col p-1 gap-1 opacity-50 scale-75">
                  <div className="h-1 w-1/2 bg-text-secondary rounded-full"></div>
                  <div className="h-0.5 w-full bg-text-tertiary rounded-full"></div>
                  <div className="h-0.5 w-3/4 bg-text-tertiary rounded-full"></div>
                </div>
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-text-tertiary">
                  {idx + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <Text
                  role="Body"
                  content={slide.title}
                  className={`text-sm truncate ${slide.active ? 'font-bold text-text' : 'font-medium text-text-secondary'}`}
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-text-tertiary flex items-center gap-0.5">
                    <LayoutTemplate size={10} /> Output
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Block>
      </Section>
    </>
  );
};
