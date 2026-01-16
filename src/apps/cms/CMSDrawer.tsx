import { X } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function CMSDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Drawer */}
      <Overlay
        position="fixed"
        right="0"
        y="0"
        zIndex={301}
        style={{
          height: "100vh",
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        <Frame
          override={{
            w: Size.n512,
            h: Size.screen,
            shadow: "2xl",
          }}
          surface="base" border="left"
        >
          {/* Header */}
          <Frame
            override={{
              py: Space.n16,
              px: Space.n24,
              justify: "between",
            }}
            layout={Layout.Row.Header.Default} border="bottom"
          >
            <Text size={FontSize.n20} weight="bold">
              Options
            </Text>
            <Action
              icon={X}
              variant="ghost"
              size="sm"
              iconSize={IconSize.n20}
              onClick={onClose}
            />
          </Frame>

          {/* Content */}
          <Frame
            override={{
              p: Space.n24,
              gap: Space.n24,
            }}
            scroll
          >
            <Text size={FontSize.n16}>Drawer content goes here</Text>
          </Frame>
        </Frame>
      </Overlay>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
}
