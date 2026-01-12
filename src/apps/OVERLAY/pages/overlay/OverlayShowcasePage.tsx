import { useState } from 'react';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Overlay } from '@/components/dsl/Overlay/Overlay';

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
      <Block role="Container" density="Comfortable" id="dialogs">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="1. Dialogs" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Modal interactions that require user attention."
          />
        </Block>
        <Block role="Card">
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

      <Block role="Divider" />

      {/* 2. Drawers */}
      <Block role="Container" density="Comfortable" id="drawers">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="2. Drawers & Sheets" />
          <Text role="Body" prominence="Subtle" content="Slide-out panels from screen edges." />
        </Block>

        <Block role="Card">
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

      <Block role="Divider" />

      {/* 3. Popovers & Toasts */}
      <Block role="Container" density="Comfortable" id="floating">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="3. Popovers & Toasts" />
          <Text role="Body" prominence="Subtle" content="Floating content and notifications." />
        </Block>

        <Block role="Card">
          <Action role="Button" label="Show Toast" onClick={() => setActiveOverlay('toast-demo')} />
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
        <Block role="Stack">
          <Block role="Stack">
            <Text role="Title" prominence="Strong" content="Confirm Action" />
            <Text
              role="Body"
              content="Are you sure you want to proceed with this action? This can be undone."
            />
          </Block>
          <Block role="Toolbar">
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
        <Block role="Stack">
          <Block role="Stack">
            <Text role="Title" prominence="Strong" content="Delete Account" intent="Critical" />
            <Text
              role="Body"
              content="This action promotes permanent data loss. Are you absolutely sure?"
            />
          </Block>
          <Block role="Toolbar">
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
        <Block role="Stack">
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
        <Block role="Stack">
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
        <Block role="Stack">
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
        <Block role="Toolbar">
          <Text role="Title" content="Success!" prominence="Standard" intent="Positive" />
          <Text role="Body" content="Your changes have been saved." />
        </Block>
      </Overlay>
    </ShowcasePage>
  );
}
