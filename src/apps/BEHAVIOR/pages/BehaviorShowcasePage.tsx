/**
 * BehaviorShowcasePage - Navigable + Selectable Showcase
 *
 * 다양한 예제로 Navigable + Selectable 동작 시연
 * 1. Navigable Only: 키보드 네비게이션만 (파일 탐색기)
 * 2. Selectable Only: 선택만 (체크박스 목록)
 * 3. Navigable + Selectable: 통합 (슬라이드 썸네일)
 */

import { Check } from 'lucide-react';
import { useState } from 'react';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Navigable } from '@/shared/lib/behavior/Navigable/Navigable';
import { useNavigableContext } from '@/shared/lib/behavior/Navigable/NavigableContext';
import { Selectable } from '@/shared/lib/behavior/Selectable/Selectable';
import { useSelectableContext } from '@/shared/lib/behavior/Selectable/SelectableContext';
import { cn } from '@/shared/lib/utils';

// ==================== Example 1: Navigable Only ====================

const FILES = [
  { id: 'file-1', name: 'README.md', type: 'file' },
  { id: 'file-2', name: 'package.json', type: 'file' },
  { id: 'file-3', name: 'tsconfig.json', type: 'file' },
  { id: 'file-4', name: 'src', type: 'folder' },
  { id: 'file-5', name: 'docs', type: 'folder' },
];

function NavigableFileItem({ file }: { file: (typeof FILES)[0] }) {
  const navigable = useNavigableContext();
  const focused = navigable.isFocused(file.id);
  const itemProps = navigable.getItemProps(file.id);

  return (
    <div
      {...itemProps}
      className={cn(
        'px-3 py-2 rounded cursor-pointer transition-colors',
        focused && 'bg-accent text-white outline outline-2 outline-accent outline-offset-2',
        !focused && 'hover:bg-surface-hover'
      )}
    >
      <Text role="Body">
        {file.type === 'folder' ? '📁' : '📄'} {file.name}
      </Text>
    </div>
  );
}

function Example1_NavigableOnly() {
  return (
    <Block role="Card" gap={4}>
      <Block role="Stack" gap={1}>
        <Text role="Title" prominence="Standard">
          1. Navigable Only - File Explorer
        </Text>
        <Text role="Caption" prominence="Subtle">
          Use ↑↓ keys to navigate. Try typing first letter to jump.
        </Text>
      </Block>

      <Block role="Container" className="p-4 bg-surface-sunken rounded-lg">
        <Navigable orientation="vertical" typeahead loop>
          <Block role="Stack" gap={1}>
            {FILES.map((file) => (
              <NavigableFileItem key={file.id} file={file} />
            ))}
          </Block>
        </Navigable>
      </Block>

      <Block role="Card" className="p-3 bg-info-muted border-info text-xs">
        <Text role="Caption" prominence="Subtle">
          💡 <strong>Navigable features:</strong>
          <br />• Arrow keys: Navigate items
          <br />• Home/End: Jump to first/last
          <br />• Typeahead: Type first letter to jump (try pressing 'p' or 't')
        </Text>
      </Block>
    </Block>
  );
}

// ==================== Example 2: Selectable Only ====================

const TASKS = [
  { id: 'task-1', text: 'Complete project proposal' },
  { id: 'task-2', text: 'Review pull requests' },
  { id: 'task-3', text: 'Update documentation' },
  { id: 'task-4', text: 'Fix bug #123' },
  { id: 'task-5', text: 'Deploy to production' },
];

function SelectableTaskItem({ task }: { task: (typeof TASKS)[0] }) {
  const selectable = useSelectableContext();
  const selected = selectable.isSelected(task.id);
  const itemProps = selectable.getItemProps(task.id);

  return (
    <div
      {...itemProps}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors',
        selected && 'bg-accent-muted border-2 border-accent',
        !selected && 'border-2 border-transparent hover:bg-surface-hover'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
          selected
            ? 'bg-accent border-accent'
            : 'bg-white border-border-default hover:border-accent'
        )}
      >
        {selected && <Check size={14} className="text-white" />}
      </div>
      <Text role="Body" className={cn(selected && 'font-medium')}>
        {task.text}
      </Text>
    </div>
  );
}

function Example2_SelectableOnly() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Block role="Card" gap={4}>
      <Block role="Stack" gap={1}>
        <Text role="Title" prominence="Standard">
          2. Selectable Only - Task List
        </Text>
        <Text role="Caption" prominence="Subtle">
          Click to select. Use Ctrl+click for multi-select, Shift+click for range.
        </Text>
      </Block>

      <Block role="Container" className="p-4 bg-surface-sunken rounded-lg">
        <Selectable mode="extended" selected={selected} onSelectionChange={setSelected}>
          <Block role="Stack" gap={1}>
            {TASKS.map((task) => (
              <SelectableTaskItem key={task.id} task={task} />
            ))}
          </Block>
        </Selectable>
      </Block>

      <Block role="Card" className="p-3 bg-surface-raised">
        <Text role="Caption" prominence="Subtle">
          Selected: {selected.length} / {TASKS.length}
        </Text>
        {selected.length > 0 && (
          <Block role="Stack" className="mt-2">
            <Text role="Caption" prominence="Subtle" className="text-xs">
              IDs: {selected.join(', ')}
            </Text>
          </Block>
        )}
      </Block>

      <Block role="Card" className="p-3 bg-info-muted border-info text-xs">
        <Text role="Caption" prominence="Subtle">
          💡 <strong>Selectable features:</strong>
          <br />• Click: Select single item
          <br />• Ctrl+Click (⌘+Click): Toggle selection
          <br />• Shift+Click: Range selection
          <br />• Space: Toggle (when focused)
          <br />• Ctrl+A (⌘+A): Select all
          <br />• Escape: Clear selection
        </Text>
      </Block>
    </Block>
  );
}

// ==================== Example 3: Navigable + Selectable ====================

const SLIDES = [
  { id: 'slide-1', title: 'Introduction', content: 'Welcome to the presentation' },
  { id: 'slide-2', title: 'Agenda', content: 'What we will cover today' },
  { id: 'slide-3', title: 'Background', content: 'Project history and context' },
  { id: 'slide-4', title: 'Problem Statement', content: 'The challenge we are solving' },
  { id: 'slide-5', title: 'Solution', content: 'Our approach and methodology' },
  { id: 'slide-6', title: 'Results', content: 'Outcomes and achievements' },
  { id: 'slide-7', title: 'Next Steps', content: 'Future plans and roadmap' },
  { id: 'slide-8', title: 'Q&A', content: 'Questions and answers' },
];

function SlideThumbItem({ slide, index }: { slide: (typeof SLIDES)[0]; index: number }) {
  const navigable = useNavigableContext();
  const selectable = useSelectableContext();

  const focused = navigable.isFocused(slide.id);
  const selected = selectable.isSelected(slide.id);

  const navProps = navigable.getItemProps(slide.id);
  const selectProps = selectable.getItemProps(slide.id);

  return (
    <div
      {...navProps}
      {...selectProps}
      className={cn(
        'relative p-3 rounded-lg cursor-pointer transition-all',
        // Base hover
        'hover:bg-surface-hover',
        // Focused (Navigable)
        focused && 'outline outline-2 outline-accent outline-offset-2 bg-surface-sunken',
        // Selected (Selectable)
        selected && 'bg-accent-muted border-2 border-accent',
        // Both focused + selected
        focused && selected && 'outline-offset-4',
        // Default border
        !selected && 'border-2 border-transparent'
      )}
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[16/9] bg-white rounded mb-2 flex items-center justify-center border border-border-default">
        <Text role="Title" prominence="Subtle">
          {index + 1}
        </Text>
      </div>

      {/* Slide Info */}
      <div className="text-sm font-medium">Slide {index + 1}</div>
      <div className="text-xs text-text-subtle truncate">{slide.title}</div>

      {/* Checkmark (Selected) */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
          <Check size={14} className="text-white" />
        </div>
      )}

      {/* Focus indicator badge */}
      {focused && (
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
      )}
    </div>
  );
}

function Example3_NavigableSelectable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState<string | null>(null);

  const handleDelete = () => {
    if (selected.length > 0) {
      alert(`Deleting ${selected.length} slides:\n${selected.join(', ')}`);
      setSelected([]);
    }
  };

  const handleActivate = (slideId: string) => {
    setActiveSlide(slideId);
    setTimeout(() => setActiveSlide(null), 1000); // Reset after 1s
  };

  return (
    <Block role="Card" gap={4}>
      <Block role="Stack" gap={1}>
        <Text role="Title" prominence="Standard">
          3. Navigable + Selectable - Slide Thumbnails (PPT-style)
        </Text>
        <Text role="Caption" prominence="Subtle">
          Combine navigation and selection. Try ↑↓ + Space, Shift+↓, Ctrl+A, Delete, Enter.
        </Text>
      </Block>

      <Block role="Container" className="p-4 bg-surface-sunken rounded-lg">
        <Navigable orientation="both" typeahead loop>
          <Selectable mode="extended" selected={selected} onSelectionChange={setSelected}>
            <Block role="Grid" spec={{ columns: 4 }} gap={3}>
              {SLIDES.map((slide, index) => (
                <SlideThumbItem key={slide.id} slide={slide} index={index} />
              ))}
            </Block>
          </Selectable>
        </Navigable>
      </Block>

      <Block role="Row" className="p-3 bg-surface-raised rounded items-center justify-between">
        <Block role="Stack" gap={1}>
          <Text role="Caption" prominence="Subtle">
            Selected: {selected.length} / {SLIDES.length}
          </Text>
          {activeSlide && (
            <Text role="Caption" prominence="Standard" className="text-accent">
              ✓ Activated: {activeSlide}
            </Text>
          )}
        </Block>
        <Block role="Row" gap={2}>
          <button
            onClick={handleDelete}
            disabled={selected.length === 0}
            className="px-3 py-1 rounded bg-critical text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete ({selected.length})
          </button>
        </Block>
      </Block>

      <Block role="Card" className="p-3 bg-info-muted border-info text-xs">
        <Text role="Caption" prominence="Subtle">
          💡 <strong>Combined features:</strong>
          <br />• ↑↓←→: Navigate (Navigable)
          <br />• Space: Select focused item (Selectable)
          <br />• Shift+Arrow: Extend selection (Selectable)
          <br />• Ctrl+A (⌘+A): Select all (Selectable)
          <br />• Delete: Delete selected (Custom handler)
          <br />• Enter: Activate focused (Custom handler)
          <br />• Escape: Clear selection (Selectable)
        </Text>
      </Block>
    </Block>
  );
}

// ==================== Main Showcase Page ====================

export function BehaviorShowcasePage() {
  return (
    <ShowcasePage
      title="Behavior Primitives"
      subtitle="Navigable & Selectable v1.0"
      description="Low-level building blocks for complex list interactions."
    >
      <Block role="Stack" gap={8}>
        {/* Header */}
        <Block role="Stack" gap={2}>
          <Text role="Title" prominence="Hero">
            Behavior Primitives Showcase
          </Text>
          <Text role="Body" prominence="Subtle">
            Demonstrating Navigable and Selectable behavior primitives. These are low-level building
            blocks that can be combined to create complex interactions like file explorers, task
            lists, and slide thumbnails.
          </Text>
        </Block>

        {/* Examples */}
        <Example1_NavigableOnly />
        <Example2_SelectableOnly />
        <Example3_NavigableSelectable />

        {/* Documentation Links */}
        <Block role="Card" gap={3} className="bg-accent-muted border-2 border-accent p-6">
          <Text role="Title" prominence="Standard">
            📚 Documentation
          </Text>
          <Block role="Stack" gap={2}>
            {[
              'docs/2-areas/core/behavior/01-web-vs-app.md',
              'docs/2-areas/core/behavior/02-navigable.md',
              'docs/2-areas/core/behavior/03-selectable.md',
              'docs/2-areas/core/behavior/04-ppt-thumbnail-example.md',
              'docs/1-project/5-behavior-primitives-implementation.md',
            ].map((path) => (
              <Text key={path} role="Body" prominence="Subtle">
                • <code className="bg-surface-raised px-1 rounded">{path}</code>
              </Text>
            ))}
          </Block>
        </Block>
      </Block>
    </ShowcasePage>
  );
}
