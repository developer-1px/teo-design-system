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
      <Block role="Container" density="Comfortable" className="gap-6" id="dialogs">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="1. Dialogs" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Modal interactions that require user attention."
          />
        </div>
        <Block role="Card" className="p-6 flex flex-row gap-4">
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

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 2. Drawers */}
      <Block role="Container" density="Comfortable" className="gap-6" id="drawers">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="2. Drawers & Sheets" />
          <Text role="Body" prominence="Subtle" content="Slide-out panels from screen edges." />
        </div>

        <Block role="Card" className="p-6 flex flex-row gap-4">
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

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 3. Popovers & Toasts */}
      <Block role="Container" density="Comfortable" className="gap-6" id="floating">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="3. Popovers & Toasts" />
          <Text role="Body" prominence="Subtle" content="Floating content and notifications." />
        </div>

        <Block role="Card" className="p-6 flex flex-row gap-4">
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
        <Block role="Container" className="p-6 gap-4">
          <Block role="Container" className="gap-2">
            <Text role="Title" prominence="Strong" content="Confirm Action" />
            <Text
              role="Body"
              content="Are you sure you want to proceed with this action? This can be undone."
            />
          </Block>
          <Block role="Toolbar" className="justify-end gap-2">
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
        <Block role="Container" className="p-6 gap-4 border-l-4 border-critical">
          <Block role="Container" className="gap-2">
            <Text role="Title" prominence="Strong" content="Delete Account" intent="Critical" />
            <Text
              role="Body"
              content="This action promotes permanent data loss. Are you absolutely sure?"
            />
          </Block>
          <Block role="Toolbar" className="justify-end gap-2">
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
        <Block role="Container" className="w-[400px] h-full p-6 gap-4">
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
        <Block role="Container" className="w-[300px] h-full p-6 gap-4">
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
        <Block role="Container" className="p-8 gap-4 items-center justify-center">
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
        <Block role="Container" className="p-4 flex flex-row items-center gap-3">
          <Text role="Title" content="Success!" prominence="Standard" intent="Positive" />
          <Text role="Body" content="Your changes have been saved." />
        </Block>
      </Overlay>
    </ShowcasePage>
  );
}
