import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Space, Size } from "../../design-system/token/token.const.1tier";

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
      override={{
        w: Size.full,
        py: Space.n24,
        px: Space.n0,
        style: { borderBottom: "1px solid var(--border-color)" },
      }}
      surface="base"
    >
      <Frame
        override={{
          gap: Space.n8,
          w: Size.full,
          style: {
            // Hide scrollbar for cleaner look but keep functionality
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          },
          py: Space.n0,
          px: Space.n24,
        }}
        row
        overflow="auto"
      >
        {TABS.map((tab, i) => (
          <Action
            key={tab}
            label={tab}
            variant={i === 0 ? "primary" : "ghost"}
            rounded="full"
            h="action"
          />
        ))}
      </Frame>
    </Frame>
  );
}
