/**
 * Accordion 사용 예시
 *
 * Block role="Accordion"의 다양한 사용 사례를 보여줍니다.
 */

import { ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Block } from '../Block';
import { AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

/**
 * 예시 1: 기본 Accordion (Single mode)
 *
 * 한 번에 하나의 아이템만 열림
 */
export function BasicAccordion() {
  return (
    <Block role="Accordion" mode="single" defaultValue="item-1" density="Standard">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>
          <p>
            This is the content of section 1. Only one section can be open at a time in single mode.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>
          <p>This is the content of section 2. Click on a section header to expand it.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>
          <p>This is the content of section 3. Use keyboard arrows to navigate between sections.</p>
        </AccordionContent>
      </AccordionItem>
    </Block>
  );
}

/**
 * 예시 2: Multiple Accordion
 *
 * 여러 아이템을 동시에 열 수 있음
 */
export function MultipleAccordion() {
  return (
    <Block role="Accordion" mode="multiple" defaultValue={['faq-1', 'faq-2']} density="Comfortable">
      <AccordionItem value="faq-1">
        <AccordionTrigger>What is IDDL?</AccordionTrigger>
        <AccordionContent>
          <p>
            IDDL (Intent-Driven Design Language) is a TSX-based DSL where developers declare "why"
            (purpose + prominence) instead of "how" (colors + sizes).
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-2">
        <AccordionTrigger>How does keyboard navigation work?</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <kbd>Enter</kbd> or <kbd>Space</kbd>: Toggle current section
            </li>
            <li>
              <kbd>↓</kbd>: Focus next section
            </li>
            <li>
              <kbd>↑</kbd>: Focus previous section
            </li>
            <li>
              <kbd>Home</kbd>: Focus first section
            </li>
            <li>
              <kbd>End</kbd>: Focus last section
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq-3">
        <AccordionTrigger>What are the available densities?</AccordionTrigger>
        <AccordionContent>
          <p>
            Three densities are available: <strong>Compact</strong>, <strong>Standard</strong>, and{' '}
            <strong>Comfortable</strong>.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Block>
  );
}

/**
 * 예시 3: Controlled Accordion
 *
 * 외부 state로 제어
 */
export function ControlledAccordion() {
  const [value, setValue] = useState<string>('');

  const handleValueChange = (newValue: string | string[]) => {
    setValue(newValue as string);
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-surface-elevated rounded-lg">
        <p className="text-sm text-text-secondary">
          Current open section: <strong className="text-text-primary">{value || 'None'}</strong>
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setValue('section-1')}
            className="px-3 py-1 text-sm bg-accent text-white rounded hover:bg-accent/90"
          >
            Open Section 1
          </button>
          <button
            onClick={() => setValue('section-2')}
            className="px-3 py-1 text-sm bg-accent text-white rounded hover:bg-accent/90"
          >
            Open Section 2
          </button>
          <button
            onClick={() => setValue('')}
            className="px-3 py-1 text-sm bg-surface border border-border-default rounded hover:bg-surface-elevated"
          >
            Close All
          </button>
        </div>
      </div>

      <Block
        role="Accordion"
        mode="single"
        value={value}
        onValueChange={handleValueChange}
        density="Standard"
      >
        <AccordionItem value="section-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>
            <p>This accordion is controlled by external state.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="section-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>
            <p>You can programmatically open/close sections using buttons above.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="section-3">
          <AccordionTrigger>Section 3</AccordionTrigger>
          <AccordionContent>
            <p>The current state is displayed in the control panel above.</p>
          </AccordionContent>
        </AccordionItem>
      </Block>
    </div>
  );
}

/**
 * 예시 4: Custom Icons
 *
 * 커스텀 아이콘 사용
 */
export function AccordionWithCustomIcons() {
  return (
    <Block role="Accordion" mode="single" density="Compact">
      <AccordionItem value="item-1">
        <AccordionTrigger icon={<ChevronRight size={20} />}>Chevron Right Icon</AccordionTrigger>
        <AccordionContent>
          <p>Using ChevronRight icon that rotates 90 degrees when open.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger icon={<Plus size={20} />}>Plus/Minus Icons</AccordionTrigger>
        <AccordionContent>
          <p>Note: For Plus/Minus icons, you'd need conditional rendering in the trigger.</p>
        </AccordionContent>
      </AccordionItem>
    </Block>
  );
}

/**
 * 예시 5: Nested Content
 *
 * 복잡한 내부 콘텐츠
 */
export function AccordionWithNestedContent() {
  return (
    <Block role="Accordion" mode="single" density="Comfortable">
      <AccordionItem value="features">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-text-primary mb-1">Keyboard Navigation</h4>
              <p className="text-sm">Full support for arrow keys, Enter, Home, and End.</p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-1">Animation</h4>
              <p className="text-sm">Smooth height transitions with auto-height support.</p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-1">ARIA Attributes</h4>
              <p className="text-sm">Fully accessible with proper ARIA roles and states.</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="installation">
        <AccordionTrigger>Installation</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>Install the package:</p>
            <pre className="bg-surface-sunken p-3 rounded text-sm overflow-x-auto">
              <code>pnpm install @your-org/iddl</code>
            </pre>
            <p className="mt-2">Import components:</p>
            <pre className="bg-surface-sunken p-3 rounded text-sm overflow-x-auto">
              <code>{`import { Block, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/types/Block/Block';`}</code>
            </pre>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="usage">
        <AccordionTrigger>Usage</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>Basic example:</p>
            <pre className="bg-surface-sunken p-3 rounded text-sm overflow-x-auto">
              <code>{`<Block role="Accordion" mode="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Block>`}</code>
            </pre>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Block>
  );
}

/**
 * 예시 6: Settings Panel
 *
 * 실제 사용 사례: 설정 패널
 */
export function SettingsAccordion() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <Block role="Accordion" mode="multiple" defaultValue={['general']} density="Standard">
        <AccordionItem value="general">
          <AccordionTrigger>General Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Enable notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Auto-save</span>
              </label>
              <label className="flex flex-col gap-1">
                <span>Language</span>
                <select className="px-3 py-2 border border-border-default rounded">
                  <option>English</option>
                  <option>한국어</option>
                </select>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <label className="flex flex-col gap-1">
                <span>Theme</span>
                <select className="px-3 py-2 border border-border-default rounded">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span>Density</span>
                <select className="px-3 py-2 border border-border-default rounded">
                  <option>Compact</option>
                  <option>Standard</option>
                  <option>Comfortable</option>
                </select>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy">
          <AccordionTrigger>Privacy & Security</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Two-factor authentication</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Activity logging</span>
              </label>
              <button className="px-4 py-2 bg-critical text-white rounded hover:bg-critical/90">
                Clear all data
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Block>
    </div>
  );
}
