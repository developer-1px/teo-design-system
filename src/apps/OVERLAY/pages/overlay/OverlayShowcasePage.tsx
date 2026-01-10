/**
 * OverlayShowcasePage - Overlay Component Showcase
 * 
 * MECE gallery of IDDL Overlay component capabilities.
 * Demonstrates Dialogs, Drawers, Sheets, Popovers, and Toasts.
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Separator } from '@/components/types/Element/Separator/Separator.tsx';
import { Text } from '@/components/types/Element/Text/Text';
import { Action } from '@/components/types/Element/Action/Action';
import { Overlay } from '@/components/types/Overlay/Overlay';

export function OverlayShowcasePage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const closeOverlay = () => setActiveOverlay(null);

  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Block role="Toolbar" density="Compact">
          <Text role="Title" prominence="Standard" content="Overlay Component Gallery" />
          <Separator role="ToolbarDivider" className="w-px h-4 mx-2" />
          <Text role="Body" prominence="Subtle" content="Layered User Interface v2.1" />
        </Block>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Block role="ScrollMenu" density="Comfortable">
          <Text role="Label" content="CATEGORIES" prominence="Subtle" className="px-2 pt-2" />
          <Block role="Container" density="Standard">
            {['Dialogs & Modals', 'Drawers & Sheets', 'Popovers & Tooltips', 'Toasts'].map(item => (
              <Block key={item} role="Inline" clickable value={item} className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer">
                <Text role="Body" content={item} prominence="Standard" />
              </Block>
            ))}
          </Block>
        </Block>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Block role="Container" density="Comfortable" className="p-8 gap-12 max-w-5xl mx-auto">

          {/* Header */}
          <Block role="Container" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Overlays" />
            <Text role="Body" prominence="Hero" content="Components that sit on top of the main UI-layer." />
          </Block>

          <Separator className="h-px w-full" />


          {/* 1. Dialogs */}
          <Block role="Container" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="1. Dialogs" />
              <Action role="IconButton" icon="Bold" label="Bold" />
              <Action role="IconButton" icon="Italic" label="Italic" />
              <Separator role="ToolbarDivider" />
            </div>
            <Block role="Card" className="p-6 flex flex-row gap-4">
              <Action role="Button" label="Standard Dialog" onClick={() => setActiveOverlay('dialog-standard')} />
              <Action role="Button" label="Critical Alert" intent="Critical" onClick={() => setActiveOverlay('dialog-critical')} />
            </Block>
          </Block>

          <Separator className="h-px w-full" />

          {/* 2. Drawers */}
          <Block role="Container" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="2. Drawers & Sheets" />
              <Text role="Body" prominence="Subtle" content="slide-out panels from screen edges." />
            </div>

            <Block role="Card" className="p-6 flex flex-row gap-4">
              <Action role="Button" label="Right Drawer" onClick={() => setActiveOverlay('drawer-right')} />
              <Action role="Button" label="Left Drawer" onClick={() => setActiveOverlay('drawer-left')} />
              <Action role="Button" label="Bottom Sheet" onClick={() => setActiveOverlay('sheet-bottom')} />
            </Block>
          </Block>

          <Separator className="h-px w-full" />

          {/* 3. Popovers & Tooltips */}
          <Block role="Container" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="3. Popovers & Toasts" />
              <Text role="Body" prominence="Subtle" content="Floating content and notifications." />
            </div>

            <Block role="Card" className="p-6 flex flex-row gap-4">
              {/* Note: Popovers usually require an anchor. Simulating here via fixed state for demo */}
              {/* 
               <Action role="Button" label="Show Popover" onClick={() => setActiveOverlay('popover-demo')} />
               */}
              <Action role="Button" label="Show Toast" onClick={() => setActiveOverlay('toast-demo')} />
            </Block>
          </Block>
        </Block>
      </Section>

      {/* --- Overlay Implementations --- */}

      {/* Standard Dialog */}
      <Overlay role="Dialog" id="dialog-standard" isOpen={activeOverlay === 'dialog-standard'} onClose={closeOverlay}>
        <Block role="Container" className="p-6 gap-4">
          <Block role="Container" className="gap-2">
            <Text role="Title" prominence="Strong" content="Confirm Action" />
            <Text role="Body" content="Are you sure you want to proceed with this action? This can be undone." />
          </Block>
          <Block role="Toolbar" className="justify-end gap-2">
            <Action role="Button" label="Cancel" prominence="Subtle" onClick={closeOverlay} />
            <Action role="Button" label="Confirm" intent="Brand" onClick={closeOverlay} />
          </Block>
        </Block>
      </Overlay>

      {/* Critical Dialog */}
      <Overlay role="Dialog" id="dialog-critical" isOpen={activeOverlay === 'dialog-critical'} onClose={closeOverlay}>
        <Block role="Container" className="p-6 gap-4 border-l-4 border-critical">
          <Block role="Container" className="gap-2">
            <Text role="Title" prominence="Strong" content="Delete Account" intent="Critical" />
            <Text role="Body" content="This action promotes permanent data loss. Are you absolutely sure?" />
          </Block>
          <Block role="Toolbar" className="justify-end gap-2">
            <Action role="Button" label="Cancel" onClick={closeOverlay} />
            <Action role="Button" label="Delete" intent="Critical" onClick={closeOverlay} />
          </Block>
        </Block>
      </Overlay>

      {/* Drawers */}
      <Overlay role="Drawer" id="drawer-right" isOpen={activeOverlay === 'drawer-right'} placement="right" onClose={closeOverlay}>
        <Block role="Container" className="w-[400px] h-full p-6 gap-4">
          <Text role="Title" content="Right Drawer" />
          <Text role="Body" content="This is a side panel content." />
          <Action role="Button" label="Close" onClick={closeOverlay} />
        </Block>
      </Overlay>

      <Overlay role="Drawer" id="drawer-left" isOpen={activeOverlay === 'drawer-left'} placement="left" onClose={closeOverlay}>
        <Block role="Container" className="w-[300px] h-full p-6 gap-4">
          <Text role="Title" content="Left Drawer" />
          <Text role="Body" content="Navigation or filters usually go here." />
        </Block>
      </Overlay>

      {/* Sheet */}
      <Overlay role="Sheet" id="sheet-bottom" isOpen={activeOverlay === 'sheet-bottom'} placement="bottom" onClose={closeOverlay}>
        <Block role="Container" className="p-8 gap-4 items-center justify-center">
          <Text role="Title" content="Bottom Sheet" />
          <Text role="Body" content="Useful for mobile actions or extended details." />
          <Action role="Button" label="Done" onClick={closeOverlay} />
        </Block>
      </Overlay>

      {/* Toast */}
      <Overlay role="Toast" id="toast-demo" isOpen={activeOverlay === 'toast-demo'} placement="bottom-right" onClose={closeOverlay}>
        <Block role="Container" className="p-4 flex flex-row items-center gap-3">
          <Text role="Title" content="Success!" prominence="Standard" intent="Positive" />
          <Text role="Body" content="Your changes have been saved." />
        </Block>
      </Overlay>

    </Page >
  );
}
