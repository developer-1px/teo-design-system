import {
  ArrowRight,
  File,
  FileText,
  Search,
  Settings,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import {
  getHighlightedParts,
  useFuzzySearch,
} from "../design-system/hooks/search/useFuzzySearch";
import { formatKeyCombo, useHotKeys } from "../design-system/hooks/interaction/useHotKeys";
import { useNavigation } from "../design-system/hooks/interaction/useNavigation";
import { Icon } from "../design-system/Icon.tsx";
import { Text } from "../design-system/text/Text.tsx";
import {
  ContainerSize,
  IconSize,
  Opacity,
  Size,
  Space,
} from "../design-system/token/token.const.1tier.ts";
import { Radius2 } from "../design-system/token/token.const.2tier.ts";

// --- Mock Data ---
const COMMANDS = [
  {
    id: "1",
    type: "Docs",
    label: "Search Documentation",
    shortcut: "⌘ D",
    icon: FileText,
  },
  {
    id: "2",
    type: "Action",
    label: "Create New File",
    shortcut: "⌘ N",
    icon: File,
  },
  {
    id: "3",
    type: "Settings",
    label: "Open Settings",
    shortcut: "⌘ ,",
    icon: Settings,
  },
  {
    id: "4",
    type: "Go",
    label: "Go to Line...",
    shortcut: "⌘ G",
    icon: ArrowRight,
  },
];

const RECENTLY_USED = [
  {
    id: "5",
    type: "File",
    label: "src/apps/App.tsx",
    shortcut: "",
    icon: File,
  },
  {
    id: "6",
    type: "File",
    label: "src/design-system/Frame.tsx",
    shortcut: "",
    icon: File,
  },
];

// --- Types ---
type Command = {
  id: string;
  type: string;
  label: string;
  shortcut: string;
  icon: React.ElementType;
};

// --- Components ---

function CommandGroup({ title }: { title: string }) {
  return (
    <Frame
      override={{
        px: Space.n16,
        py: Space.n8,
      }}
    >
      <Text.Menu.Group>{title}</Text.Menu.Group>
    </Frame>
  );
}

function CommandItem({
  label,
  shortcut,
  isActive,
  icon: IconComp,
  onClick,
  indices = [],
}: {
  label: string;
  shortcut?: string;
  isActive?: boolean;
  icon: React.ElementType;
  onClick?: () => void;
  indices?: number[];
}) {
  // Get highlighted parts
  const parts = getHighlightedParts(label, indices);

  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      interactive
      selected={isActive}
      onClick={onClick}
      override={{ px: Space.n16, minHeight: Size.n40 }}
    >
      <Frame
        override={{
          w: Size.n16,
          h: Size.n16,
          align: "center",
          justify: "center",
          opacity: Opacity.n50,
        }}
      >
        <Icon src={IconComp} />
      </Frame>

      <Frame override={{ flex: 1, minWidth: Size.n0 }}>
        <Text.Menu.Item>
          {parts.map((part, i) => (
            <span
              key={i}
              style={{
                color: part.highlight ? "var(--primary-fg)" : "inherit",
                fontWeight: part.highlight ? "bold" : "normal",
              }}
            >
              {part.text}
            </span>
          ))}
        </Text.Menu.Item>
      </Frame>

      {shortcut && (
        <Frame>
          <Text variant="caption-sm">{shortcut}</Text>
        </Frame>
      )}
    </Frame>
  );
}

function CommandInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{ p: Space.n16, borderBottom: true, minHeight: Size.n40 }}
    >
      <Frame override={{ w: Size.n16, h: Size.n16, opacity: Opacity.n50 }}>
        <Icon src={Search} />
      </Frame>
      <Frame override={{ flex: 1 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a command or search..."
          style={{
            all: "unset",
            width: "100%",
            fontFamily: "var(--font-primary)",
            fontSize: "var(--font-size-n14)",
            color: "var(--text-primary)",
          }}
        />
      </Frame>
      <Frame override={{ opacity: Opacity.n50 }}>
        <Text variant="caption-sm">ESC</Text>
      </Frame>
    </Frame>
  );
}

export function CommandBarDesignApp() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Combine all items for search
  const allItems: Command[] = [...COMMANDS, ...RECENTLY_USED];

  // Fuzzy search
  const searchResults = useFuzzySearch({
    items: allItems,
    query,
    getText: (item) => item.label,
    threshold: 0.3,
  });

  // Get actual items to render (with fuzzy match data)
  // If search has results, use them; otherwise use all items
  const displayItems =
    searchResults.length > 0
      ? searchResults.map((result) => result.item)
      : query.trim() !== ""
        ? [] // No results for search query
        : allItems; // Empty query shows all items

  // Create map of item id -> highlight indices (for search results only)
  const highlightMap = new Map<string, number[]>();
  for (const result of searchResults) {
    highlightMap.set(result.item.id, result.indices);
  }

  // Navigation hook (replaces manual useEffect)
  const { selectedIndex, setSelectedIndex } = useNavigation({
    items: displayItems,
    onSelect: (item) => {
      console.log("✅ Execute command:", item.label);
      console.log("   ID:", item.id);
      console.log("   Type:", item.type);
      console.log("   Shortcut:", item.shortcut || "None");
    },
    onClose: () => {
      console.log("❌ Close command palette");
      setQuery("");
      setIsOpen(false);
    },
    enabled: isOpen, // Always enabled when open (Escape should always work)
  });

  // Global hotkeys
  useHotKeys(
    {
      "cmd+k": () => {
        console.log("🔥 Open command palette (cmd+k)");
        setIsOpen(true);
      },
    },
    {
      enabled: !isOpen,
    },
  );

  if (!isOpen) {
    return (
      <Frame
        layout={Layout.Col.Center.Start}
        spacing={Space.n0}
        h={Size.fill}
        override={{ p: Space.n32 }}
        surface="base"
      >
        <Text.Prose.Body>
          Press <strong>{formatKeyCombo("cmd+k")}</strong> to open command
          palette
        </Text.Prose.Body>
      </Frame>
    );
  }

  return (
    // Page Container
    <Frame
      override={{
        w: Size.fill,
        h: Size.fill,
        p: Space.n32,
      }}
      surface="base"
    >
      {/* Command Palette */}
      <Frame
        surface="raised"
        layout={Layout.Col.Left.Start}
        spacing={Space.n8}
        override={{
          w: Size.fill,
          maxWidth: ContainerSize.n640,
          clip: true,
        }}
        rounded={Radius2.xl}
      >
        <CommandInput value={query} onChange={setQuery} />

        <Frame
          layout={Layout.Col.Left.Start}
          spacing={Space.n4}
          scroll="y"
          override={{
            maxHeight: ContainerSize.n320,
            py: Space.n8,
          }}
        >
          {displayItems.length > 0 ? (
            <>
              {query.trim() !== "" && <CommandGroup title="Search Results" />}
              {query.trim() === "" && <CommandGroup title="Suggested" />}

              {displayItems.map((item, i) => (
                <CommandItem
                  key={item.id}
                  label={item.label}
                  shortcut={item.shortcut}
                  icon={item.icon}
                  isActive={i === selectedIndex}
                  onClick={() => setSelectedIndex(i)}
                  indices={highlightMap.get(item.id) || []}
                />
              ))}

              {query.trim() === "" && COMMANDS.length < displayItems.length && (
                <>
                  <Frame override={{ h: Size.n8 }} />
                  <CommandGroup title="Recent Files" />
                </>
              )}
            </>
          ) : (
            <Frame
              override={{ h: Size.n96, align: "center", justify: "center" }}
            >
              <Text variant="caption" style={{ opacity: 0.5 }}>
                No results found
              </Text>
            </Frame>
          )}
        </Frame>

        {/* Footer */}
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          surface="sunken"
          override={{ py: Space.n8, gap: Space.n8, minHeight: Size.n40 }}
        >
          <Text variant="caption-sm">Search by</Text>
          <Frame override={{ opacity: Opacity.n50 }}>
            <Icon src={Zap} size={IconSize.n12} />
          </Frame>
          <Text variant="caption-sm">Teo</Text>
        </Frame>
      </Frame>
    </Frame>
  );
}
