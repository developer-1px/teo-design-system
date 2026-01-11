import { useState } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Overlay } from '@/components/types/Overlay/Overlay';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function OverlayShowcasePage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const closeOverlay = () => setActiveOverlay(null);

  const categories = [
    { id: 'dialogs', label: 'Dialogs & Modals' },
    { id: 'drawers', label: 'Drawers & Sheets' },
    { id: 'floating', label: 'Popovers & Toasts' },
  ];

  return (
    <ShowcasePage
      title="Overlays"
      subtitle="Layered User Interface v2.1"
      description="Components that sit on top of the main UI-layer."
      categories={categories}
      activeCategoryId="dialogs"
    >
      {/* 1. Dialogs */}
      <Block role="Container" density="Comfortable" gap={6} id="dialogs">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="1. Dialogs" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Modal interactions that require user attention."
          />
        </Block>
        <Block role="Card" layout="inline" gap={4} className="p-6">
          <Action
            role="Button"
            label="Standard Dialog"
            onClick={() => setActiveOverlay('dialog-standard')}
          />
          <Action
            role="Button"
            label="Critical Alert"
            intent="Critical"
            onClick={() => setActiveOverlay('dialog-critical')}
          />
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 2. Drawers */}
      <Block role="Container" density="Comfortable" gap={6} id="drawers">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="2. Drawers & Sheets" />
          <Text role="Body" prominence="Subtle" content="Slide-out panels from screen edges." />
        </Block>

        <Block role="Card" layout="inline" gap={4} className="p-6">
          <Action
            role="Button"
            label="Right Drawer"
            onClick={() => setActiveOverlay('drawer-right')}
          />
          <Action
            role="Button"
            label="Left Drawer"
            onClick={() => setActiveOverlay('drawer-left')}
          />
          <Action
            role="Button"
            label="Bottom Sheet"
            onClick={() => setActiveOverlay('sheet-bottom')}
          />
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 3. Popovers & Toasts */}
      <Block role="Container" density="Comfortable" gap={6} id="floating">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="3. Popovers & Toasts" />
          <Text role="Body" prominence="Subtle" content="Floating content and notifications." />
        </Block>

        <Block role="Card" layout="inline" gap={4} className="p-6">
          <Action
            role="Button"
            label="Show Toast"
            onClick={() => setActiveOverlay('toast-demo')}
          />
        </Block>
      </Block>

      {/* --- Overlay Implementations --- */}

      {/* Standard Dialog */}
      <Overlay
        role="Dialog"
        id="dialog-standard"
        isOpen={activeOverlay === 'dialog-standard'}
        onClose={closeOverlay}
      >
        <Block role="Stack" gap={4} className="p-6">
          <Block role="Stack" gap={2}>
            <Text role="Title" prominence="Strong" content="Confirm Action" />
            <Text
              role="Body"
              content="Are you sure you want to proceed with this action? This can be undone."
            />
          </Block>
          <Block role="Toolbar" gap={2} className="justify-end">
            <Action role="Button" label="Cancel" prominence="Subtle" onClick={closeOverlay} />
            <Action role="Button" label="Confirm" intent="Brand" onClick={closeOverlay} />
          </Block>
        </Block>
      </Overlay>

      {/* Critical Dialog */}
      <Overlay
        role="Dialog"
        id="dialog-critical"
        isOpen={activeOverlay === 'dialog-critical'}
        onClose={closeOverlay}
      >
        <Block role="Stack" gap={4} className="p-6 border-l-4 border-critical">
          <Block role="Stack" gap={2}>
            <Text role="Title" prominence="Strong" content="Delete Account" intent="Critical" />
            <Text
              role="Body"
              content="This action promotes permanent data loss. Are you absolutely sure?"
            />
          </Block>
          <Block role="Toolbar" gap={2} className="justify-end">
            <Action role="Button" label="Cancel" onClick={closeOverlay} />
            <Action role="Button" label="Delete" intent="Critical" onClick={closeOverlay} />
          </Block>
        </Block>
      </Overlay>

      {/* Drawers */}
      <Overlay
        role="Drawer"
        id="drawer-right"
        isOpen={activeOverlay === 'drawer-right'}
        placement="right"
        onClose={closeOverlay}
      >
        <Block role="Stack" gap={4} className="w-[400px] h-full p-6">
          <Text role="Title" content="Right Drawer" />
          <Text role="Body" content="This is a side panel content." />
          <Action role="Button" label="Close" onClick={closeOverlay} />
        </Block>
      </Overlay>

      <Overlay
        role="Drawer"
        id="drawer-left"
        isOpen={activeOverlay === 'drawer-left'}
        placement="left"
        onClose={closeOverlay}
      >
        <Block role="Stack" gap={4} className="w-[300px] h-full p-6">
          <Text role="Title" content="Left Drawer" />
          <Text role="Body" content="Navigation or filters usually go here." />
        </Block>
      </Overlay>

      {/* Sheet */}
      <Overlay
        role="Sheet"
        id="sheet-bottom"
        isOpen={activeOverlay === 'sheet-bottom'}
        placement="bottom"
        onClose={closeOverlay}
      >
        <Block role="Stack" gap={4} className="p-8 items-center justify-center">
          <Text role="Title" content="Bottom Sheet" />
          <Text role="Body" content="Useful for mobile actions or extended details." />
          <Action role="Button" label="Done" onClick={closeOverlay} />
        </Block>
      </Overlay>

      {/* Toast */}
      <Overlay
        role="Toast"
        id="toast-demo"
        isOpen={activeOverlay === 'toast-demo'}
        placement="bottom-right"
        onClose={closeOverlay}
      >
        <Block role="Row" gap={3} className="p-4 items-center">
          <Text role="Title" content="Success!" prominence="Standard" intent="Positive" />
          <Text role="Body" content="Your changes have been saved." />
        </Block>
      </Overlay>
    </ShowcasePage>
  );
}
