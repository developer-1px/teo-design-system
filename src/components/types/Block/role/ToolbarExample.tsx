/**
 * Toolbar 사용 예시
 *
 * Block role="Toolbar"의 다양한 사용 사례를 보여줍니다.
 */

import { Save, Undo, Redo, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Block, ToolbarDivider, ToolbarBlock } from '../Block';
import { Action } from '@/components/types/Element/Action/Action';

/**
 * 예시 1: 기본 Toolbar
 */
export function BasicToolbar() {
  return (
    <Block role="Toolbar" density="Standard">
      <Action role="IconButton" title="Save">
        <Save size={20} />
      </Action>
      <Action role="IconButton" title="Undo">
        <Undo size={20} />
      </Action>
      <Action role="IconButton" title="Redo">
        <Redo size={20} />
      </Action>
    </Block>
  );
}

/**
 * 예시 2: Divider로 구분된 Toolbar
 */
export function ToolbarWithDividers() {
  return (
    <Block role="Toolbar" density="Comfortable">
      <Action role="IconButton" title="Save">
        <Save size={20} />
      </Action>
      <Action role="IconButton" title="Undo">
        <Undo size={20} />
      </Action>
      <Action role="IconButton" title="Redo">
        <Redo size={20} />
      </Action>

      <ToolbarDivider />

      <Action role="IconButton" title="Bold">
        <Bold size={20} />
      </Action>
      <Action role="IconButton" title="Italic">
        <Italic size={20} />
      </Action>
      <Action role="IconButton" title="Underline">
        <Underline size={20} />
      </Action>
    </Block>
  );
}

/**
 * 예시 3: ToolbarBlock으로 그룹화
 */
export function ToolbarWithGroups() {
  return (
    <Block role="Toolbar" density="Compact">
      <ToolbarBlock>
        <Action role="IconButton" title="Save">
          <Save size={20} />
        </Action>
        <Action role="IconButton" title="Undo">
          <Undo size={20} />
        </Action>
        <Action role="IconButton" title="Redo">
          <Redo size={20} />
        </Action>
      </ToolbarBlock>

      <ToolbarDivider />

      <ToolbarBlock>
        <Action role="IconButton" title="Bold">
          <Bold size={20} />
        </Action>
        <Action role="IconButton" title="Italic">
          <Italic size={20} />
        </Action>
        <Action role="IconButton" title="Underline">
          <Underline size={20} />
        </Action>
      </ToolbarBlock>

      <ToolbarDivider />

      <ToolbarBlock>
        <Action role="IconButton" title="Align Left">
          <AlignLeft size={20} />
        </Action>
        <Action role="IconButton" title="Align Center">
          <AlignCenter size={20} />
        </Action>
        <Action role="IconButton" title="Align Right">
          <AlignRight size={20} />
        </Action>
      </ToolbarBlock>
    </Block>
  );
}

/**
 * 예시 4: Sticky Toolbar with Border
 */
export function StickyToolbar() {
  return (
    <div className="relative h-screen overflow-auto">
      <Block role="Toolbar" density="Standard" sticky border="bottom">
        <Action role="IconButton" title="Save">
          <Save size={20} />
        </Action>
        <Action role="IconButton" title="Undo">
          <Undo size={20} />
        </Action>
        <Action role="IconButton" title="Redo">
          <Redo size={20} />
        </Action>

        <ToolbarDivider />

        <Action role="IconButton" title="Bold">
          <Bold size={20} />
        </Action>
        <Action role="IconButton" title="Italic">
          <Italic size={20} />
        </Action>
      </Block>

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Long Content</h1>
        {Array.from({ length: 50 }).map((_, i) => (
          <p key={i} className="mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scroll down to see the sticky toolbar.
          </p>
        ))}
      </div>
    </div>
  );
}
