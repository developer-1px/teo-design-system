import { X } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text";
import { FontSize, IconSize, Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function CMSDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <Overlay
        position="fixed"
        x="0"
        y="0"
        zIndex={300}
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

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
            w: Size.n320,
            h: Size.screen,
            shadow: "2xl",
          }}
          surface="base"
          style={{
            borderLeft: "1px solid var(--border-color)",
          }}
        >
          {/* Header */}
          <Frame
            override={{
              py: Space.n12,
              px: Space.n16,
              justify: "between",
            }}
            layout={Layout.Row.Header.Default}
            style={{
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <Text size={FontSize.n16} weight="bold">
              Options
            </Text>
            <Action
              icon={X}
              variant="ghost"
              size="xs"
              iconSize={IconSize.n16}
              onClick={onClose}
            />
          </Frame>

          {/* Content */}
          <Frame
            override={{
              p: Space.n16,
              gap: Space.n16,
            }}
            scroll
          >
            <Text size={FontSize.n14}>Drawer content goes here</Text>
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
