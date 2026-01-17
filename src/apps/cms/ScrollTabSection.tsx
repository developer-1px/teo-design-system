import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

const TABS = [
  "Overview",
  "Analytics",
  "Reports",
  "Settings",
  "Users",
  "Billing",
  "Email",
  "Notifications",
  "Integrations",
  "API",
  "Support",
  "Security",
  "Audit Log",
  "Appearance",
];

export function ScrollTabSection() {
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      override={{
        w: Size.fill,
        py: Space.n8,
        px: Space.n0,
        borderBottom: true,
      }}
      surface="sunken"
    >
      <Frame
        override={{
          gap: Space.n8,
          w: Size.fill,
          py: Space.n0,
          px: Space.n24,
          justify: "center",
        }}
        style={{
          // Hide scrollbar for cleaner look but keep functionality
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        minHeight={Size.n40}
        scroll
      >
        {TABS.map((tab, i) => (
          <Action
            key={tab}
            label={tab}
            variant={i === 0 ? "primary" : "ghost"}
            rounded={Radius2.full}
            h="action"
          />
        ))}
      </Frame>
    </Frame>
  );
}
