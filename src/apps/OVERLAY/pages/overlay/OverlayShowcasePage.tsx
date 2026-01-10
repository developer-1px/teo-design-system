/**
 * OverlayShowcasePage - Overlay Component Showcase
 * 
 * MECE gallery of IDDL Overlay component capabilities.
 * Demonstrates Dialogs, Drawers, Sheets, Popovers, and Toasts.
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Action } from '@/components/types/Atom/Action/Action';
import { Overlay } from '@/components/types/Overlay/Overlay';

export function OverlayShowcasePage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const closeOverlay = () => setActiveOverlay(null);

  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Overlay Component Gallery" />
          <Group role="Divider" layout="inline"><></></Group>
          <Text role="Body" prominence="Subtle" content="Layered User Interface v2.1" />
        </Group>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="CATEGORIES" prominence="Subtle" className="px-2 pt-2" />
          <Group role="Container" layout="stack" density="Standard">
            {['Dialogs & Modals', 'Drawers & Sheets', 'Popovers & Tooltips', 'Toasts'].map(item => (
              <Group key={item} role="Inline" clickable value={item} className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer">
                <Text role="Body" content={item} prominence="Standard" />
              </Group>
            ))}
          </Group>
        </Group>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Group role="Container" layout="stack" density="Comfortable" className="p-8 gap-12 max-w-5xl mx-auto">

          {/* Header */}
          <Group role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Overlays" />
            <Text role="Body" prominence="Hero" content="Components that sit on top of the main UI-layer." />
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 1. Dialogs */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="1. Dialogs" />
              <Text role="Body" prominence="Subtle" content="Modal windows that require user interaction." />
            </div>

            <Group role="Card" className="p-6 flex flex-row gap-4">
              <Action role="Button" label="Standard Dialog" onClick={() => setActiveOverlay('dialog-standard')} />
              <Action role="Button" label="Critical Alert" intent="Critical" onClick={() => setActiveOverlay('dialog-critical')} />
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 2. Drawers */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="2. Drawers & Sheets" />
              <Text role="Body" prominence="Subtle" content="slide-out panels from screen edges." />
            </div>

            <Group role="Card" className="p-6 flex flex-row gap-4">
              <Action role="Button" label="Right Drawer" onClick={() => setActiveOverlay('drawer-right')} />
              <Action role="Button" label="Left Drawer" onClick={() => setActiveOverlay('drawer-left')} />
              <Action role="Button" label="Bottom Sheet" onClick={() => setActiveOverlay('sheet-bottom')} />
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 3. Popovers & Tooltips */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="3. Popovers & Toasts" />
              <Text role="Body" prominence="Subtle" content="Floating content and notifications." />
            </div>

            <Group role="Card" className="p-6 flex flex-row gap-4">
              {/* Note: Popovers usually require an anchor. Simulating here via fixed state for demo */}
              {/* 
               <Action role="Button" label="Show Popover" onClick={() => setActiveOverlay('popover-demo')} />
               */}
              <Action role="Button" label="Show Toast" onClick={() => setActiveOverlay('toast-demo')} />
            </Group>
          </Group>
        </Group>
      </Section>

      {/* --- Overlay Implementations --- */}

      {/* Standard Dialog */}
      <Overlay role="Dialog" id="dialog-standard" isOpen={activeOverlay === 'dialog-standard'} onClose={closeOverlay}>
        <Group role="Container" className="p-6 gap-4">
          <Group role="Container" className="gap-2">
            <Text role="Title" prominence="Strong" content="Confirm Action" />
            <Text role="Body" content="Are you sure you want to proceed with this action? This can be undone." />
          </Group>
          <Group role="Toolbar" layout="inline" className="justify-end gap-2">
            <Action role="Button" label="Cancel" prominence="Subtle" onClick={closeOverlay} />
            <Action role="Button" label="Confirm" intent="Brand" onClick={closeOverlay} />
          </Group>
        </Group>
      </Overlay>

      {/* Critical Dialog */}
      <Overlay role="Dialog" id="dialog-critical" isOpen={activeOverlay === 'dialog-critical'} onClose={closeOverlay}>
        <Group role="Container" className="p-6 gap-4 border-l-4 border-critical">
          <Group role="Container" className="gap-2">
            <Text role="Title" prominence="Strong" content="Delete Account" intent="Critical" />
            <Text role="Body" content="This action promotes permanent data loss. Are you absolutely sure?" />
          </Group>
          <Group role="Toolbar" layout="inline" className="justify-end gap-2">
            <Action role="Button" label="Cancel" onClick={closeOverlay} />
            <Action role="Button" label="Delete" intent="Critical" onClick={closeOverlay} />
          </Group>
        </Group>
      </Overlay>

      {/* Drawers */}
      <Overlay role="Drawer" id="drawer-right" isOpen={activeOverlay === 'drawer-right'} placement="right" onClose={closeOverlay}>
        <Group role="Container" className="w-[400px] h-full p-6 gap-4">
          <Text role="Title" content="Right Drawer" />
          <Text role="Body" content="This is a side panel content." />
          <Action role="Button" label="Close" onClick={closeOverlay} />
        </Group>
      </Overlay>

      <Overlay role="Drawer" id="drawer-left" isOpen={activeOverlay === 'drawer-left'} placement="left" onClose={closeOverlay}>
        <Group role="Container" className="w-[300px] h-full p-6 gap-4">
          <Text role="Title" content="Left Drawer" />
          <Text role="Body" content="Navigation or filters usually go here." />
        </Group>
      </Overlay>

      {/* Sheet */}
      <Overlay role="Sheet" id="sheet-bottom" isOpen={activeOverlay === 'sheet-bottom'} placement="bottom" onClose={closeOverlay}>
        <Group role="Container" className="p-8 gap-4 items-center justify-center">
          <Text role="Title" content="Bottom Sheet" />
          <Text role="Body" content="Useful for mobile actions or extended details." />
          <Action role="Button" label="Done" onClick={closeOverlay} />
        </Group>
      </Overlay>

      {/* Toast */}
      <Overlay role="Toast" id="toast-demo" isOpen={activeOverlay === 'toast-demo'} placement="bottom-right" onClose={closeOverlay}>
        <Group role="Container" className="p-4 flex flex-row items-center gap-3">
          <Text role="Title" content="Success!" prominence="Standard" intent="Positive" />
          <Text role="Body" content="Your changes have been saved." />
        </Group>
      </Overlay>

    </Page>
  );
}
