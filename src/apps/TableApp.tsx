import { faker } from "@faker-js/faker";
import {
    ArrowUpDown,
    ChevronDown,
    Download,
    Eye,
    Filter,
    Grid,
    LayoutGrid,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Share2,
    Trash2,
    Users,
    RowsIcon,
    Columns,
    Copy
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useHeadlessList } from "../design-system/hooks/data/useHeadlessList";
import { NavProvider, useNavState } from "../design-system/context/NavContext";
import { Action } from "../design-system/Action";
import { DataTable } from "../design-system/DataTable";
import { Icon } from "../design-system/Icon";
import { Text } from "../design-system/text/Text";
import { CommandPalette, type PaletteItem } from "../design-system/CommandPalette/CommandPalette";
import { useCommandSystem } from "../design-system/hooks/interaction/useCommandSystem";
import { SystemCommand } from "../design-system/hooks/interaction/commands";

// 1. Mock Data Generator
const generateData = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        jobTitle: faker.person.jobTitle(),
        department: faker.commerce.department(),
        status: faker.helpers.arrayElement(["Active", "Inactive", "Pending"]),
        budget: faker.finance.amount(),
    }));
};

export function TableApp() {
    const [data, setData] = useState(() => generateData(100));
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    // Sidebar Items Data
    const ITEMS = useMemo(() => [
        { key: "all", label: "All Employees", icon: Grid },
        { key: "eng", label: "Engineering Team", icon: Users },
        { key: "des", label: "Design Team", icon: Users },
        { key: "active", label: "Active Status", icon: Filter },
        { key: "q_rev", label: "Quarterly Reviews", icon: ChevronDown },
        { key: "onboarding", label: "Onboarding", icon: ChevronDown },
        { key: "trash", label: "Trash", icon: Trash2 },
    ], []);

    const { state, actions, listProps } = useHeadlessList({
        items: ITEMS,
        initialSelectedIndex: 0,
        loop: true
    });

    const navValue = useMemo(() => ({
        focusedId: ITEMS[state.focusedIndex]?.key,
        selectedId: ITEMS[state.selectedIndex]?.key,
        selectionMode: "single" as const
    }), [ITEMS, state.focusedIndex, state.selectedIndex]);

    const columns = useMemo(
        () => [
            { key: "firstName", title: "First Name", width: "120px" },
            { key: "lastName", title: "Last Name", width: "120px" },
            { key: "email", title: "Email", width: "240px" },
            { key: "jobTitle", title: "Job Title", width: "240px" },
            { key: "department", title: "Department", width: "150px" },
            {
                key: "status",
                title: "Status",
                width: "100px",
                render: (val: string) => (
                    <Frame
                        surface={val === "Active" ? "primary" : val === "Pending" ? "sunken" : undefined}
                        rounded={Radius2.full}
                        override={{
                            py: Space.n2,
                            px: Space.n8
                        }}
                        layout={Layout.Row.Middle.Center}
                        style={{
                            background: val === "Active" ? "var(--primary-bg)" : val === "Pending" ? "var(--surface-sunken-bg)" : "var(--surface-overlay-bg)",
                            color: val === "Active" ? "var(--primary-fg)" : "var(--text-secondary)",
                            fontSize: "11px",
                            fontWeight: 600,
                            display: "inline-flex"
                        }}
                    >
                        {val}
                    </Frame>
                )
            },
            {
                key: "budget",
                title: "Budget",
                width: "100px",
                render: (val: string) => `$${Number(val).toLocaleString()}`
            },
        ],
        []
    );

    // Command Palette Items
    const paletteItems: PaletteItem[] = useMemo(() => [
        {
            id: "insert-row-above",
            label: "Insert Row Above",
            description: "Add a new row above the current selection",
            icon: RowsIcon,
            onSelect: () => {
                const newRow = {
                    id: data.length,
                    firstName: "",
                    lastName: "",
                    email: "",
                    jobTitle: "",
                    department: "",
                    status: "Pending" as const,
                    budget: "0",
                };
                setData([newRow, ...data]);
            }
        },
        {
            id: "insert-row-below",
            label: "Insert Row Below",
            description: "Add a new row below the current selection",
            icon: RowsIcon,
            onSelect: () => {
                const newRow = {
                    id: data.length,
                    firstName: "",
                    lastName: "",
                    email: "",
                    jobTitle: "",
                    department: "",
                    status: "Pending" as const,
                    budget: "0",
                };
                setData([...data, newRow]);
            }
        },
        {
            id: "delete-row",
            label: "Delete Selected Rows",
            description: "Remove selected rows from the table",
            icon: Trash2,
            onSelect: () => {
                // For now, just remove the last row as a demo
                if (data.length > 0) {
                    setData(data.slice(0, -1));
                }
            }
        },
        {
            id: "add-column",
            label: "Add Column",
            description: "Add a new column to the table",
            icon: Columns,
            onSelect: () => {
                alert("Add column feature - coming soon!");
            }
        },
        {
            id: "duplicate-row",
            label: "Duplicate Row",
            description: "Create a copy of the selected row",
            icon: Copy,
            onSelect: () => {
                if (data.length > 0) {
                    const lastRow = data[data.length - 1];
                    const duplicated = { ...lastRow, id: data.length };
                    setData([...data, duplicated]);
                }
            }
        },
        {
            id: "sort-ascending",
            label: "Sort by First Name (A-Z)",
            description: "Sort table by first name ascending",
            icon: ArrowUpDown,
            onSelect: () => {
                const sorted = [...data].sort((a, b) => a.firstName.localeCompare(b.firstName));
                setData(sorted);
            }
        },
        {
            id: "sort-descending",
            label: "Sort by First Name (Z-A)",
            description: "Sort table by first name descending",
            icon: ArrowUpDown,
            onSelect: () => {
                const sorted = [...data].sort((a, b) => b.firstName.localeCompare(a.firstName));
                setData(sorted);
            }
        },
        {
            id: "filter-active",
            label: "Filter Active Only",
            description: "Show only active employees",
            icon: Filter,
            onSelect: () => {
                const filtered = data.filter(row => row.status === "Active");
                setData(filtered);
            }
        },
        {
            id: "reset-data",
            label: "Reset Table Data",
            description: "Regenerate table with fresh data",
            icon: Download,
            onSelect: () => {
                setData(generateData(100));
            }
        },
    ], [data]);

    // Command System for Cmd+K
    const commandRegistry = {
        [SystemCommand.OpenPalette]: () => setIsPaletteOpen(true),
    };

    const keybindings = [
        { key: "cmd+k", command: SystemCommand.OpenPalette },
        { key: "ctrl+k", command: SystemCommand.OpenPalette },
    ];

    const { onKeyDown } = useCommandSystem(keybindings, commandRegistry);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => onKeyDown(e);
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onKeyDown]);

    return (
        <>
            <CommandPalette
                isOpen={isPaletteOpen}
                onClose={() => setIsPaletteOpen(false)}
                items={paletteItems}
            />
            <Frame surface="base" override={{ w: Size.fill, h: Size.fill }} layout={Layout.Row.Top.Start} spacing={Space.n0}>
                {/* 1. Left Sidebar (Views & Navigation) */}
                <Frame
                surface="sunken"
                override={{
                    w: "260px",
                    h: Size.fill,
                    border: true,
                    zIndex: ZIndex.n100
                }}
                style={{ flexShrink: 0, ...listProps.style }}
                onKeyDown={listProps.onKeyDown}
                tabIndex={listProps.tabIndex}
            >
                <NavProvider value={navValue}>
                    {/* Sidebar Header */}
                    <Frame layout={Layout.Row.Middle.Between} override={{ h: Size.n48, px: Space.n16, borderBottom: true }}>
                        <Frame layout={Layout.Row.Middle.Start} spacing={Space.n8}>
                            <Frame
                                w={Size.n24} h={Size.n24} rounded={Radius2.md} surface="primary"
                                layout={Layout.Row.Middle.Center}
                            >
                                <Icon src={LayoutGrid} size={IconSize.n14} style={{ color: "var(--primary-fg)" }} />
                            </Frame>
                            <Text.Card.Title style={{ fontSize: "14px" }}>Space HR</Text.Card.Title>
                        </Frame>
                        <Icon src={ChevronDown} size={IconSize.n16} style={{ opacity: 0.5 }} />
                    </Frame>

                    {/* Views List */}
                    <Frame override={{ p: Space.n8, gap: Space.n4, flex: 1 }} scroll>
                        {/* Section 1: Views */}
                        {ITEMS.slice(0, 4).map((item, i) => {
                            const globalIndex = i;
                            return (
                                <SideItem
                                    key={item.key}
                                    navId={item.key}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => {
                                        actions.setFocusedIndex(globalIndex);
                                        actions.setSelectedIndex(globalIndex);
                                    }}
                                />
                            );
                        })}

                        <Frame override={{ py: Space.n8, h: "1px", w: Size.fill }} style={{ background: "var(--border-subtle)" }} />

                        <Text.Card.Note style={{ padding: "0 8px", fontSize: "11px", fontWeight: 600, opacity: 0.7 }}>FOLDERS</Text.Card.Note>

                        {/* Section 2: Folders */}
                        {ITEMS.slice(4, 6).map((item, i) => {
                            const globalIndex = 4 + i;
                            return (
                                <SideItem
                                    key={item.key}
                                    navId={item.key}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => {
                                        actions.setFocusedIndex(globalIndex);
                                        actions.setSelectedIndex(globalIndex);
                                    }}
                                />
                            );
                        })}

                        <Frame override={{ py: Space.n8, h: "1px", w: Size.fill }} style={{ background: "var(--border-subtle)" }} />

                        {/* Section 3: Trash */}
                        {ITEMS.slice(6, 7).map((item, i) => {
                            const globalIndex = 6 + i;
                            return (
                                <SideItem
                                    key={item.key}
                                    navId={item.key}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => {
                                        actions.setFocusedIndex(globalIndex);
                                        actions.setSelectedIndex(globalIndex);
                                    }}
                                />
                            );
                        })}
                    </Frame>

                    {/* Sidebar Footer */}
                    <Frame override={{ p: Space.n12, borderTop: true }}>
                        <Action variant="surface" border w={Size.fill} gap={Space.n8}>
                            <Icon src={Plus} size={IconSize.n14} />
                            New View
                        </Action>
                    </Frame>
                </NavProvider>
            </Frame>

            {/* 2. Main Content Area */}
            <Frame override={{ flex: 1, h: Size.fill }} layout={Layout.Col.Left.Start} spacing={Space.n0}>

                {/* Top Bar (Global Actions) */}
                <Frame
                    layout={Layout.Row.Middle.Between}
                    override={{
                        h: Size.n48,
                        px: Space.n16,
                        borderBottom: true,
                        w: Size.fill
                    }}
                    surface="base"
                >
                    {/* Left: Breadcrumbs / Title */}
                    <Frame layout={Layout.Row.Middle.Start} spacing={Space.n8}>
                        <Text size={FontSize.n14} weight="medium" style={{ color: "var(--text-secondary)" }}>Workspace</Text>
                        <Text size={FontSize.n14} style={{ color: "var(--text-tertiary)" }}>/</Text>
                        <Text size={FontSize.n14} weight="medium">Employee Database</Text>
                    </Frame>

                    {/* Right: Global Tools */}
                    <Frame layout={Layout.Row.Middle.End} spacing={Space.n4}>
                        <Action variant="ghost" rounded={Radius2.full} p={Space.n8}>
                            <Icon src={Search} size={IconSize.n16} />
                        </Action>
                        <Action variant="ghost" rounded={Radius2.full} p={Space.n8}>
                            <Icon src={Settings} size={IconSize.n16} />
                        </Action>
                        <Frame style={{ width: 1, height: 16, background: "var(--border-subtle)", margin: "0 8px" }} />
                        <Action variant="primary" h={Size.n32} px={Space.n12} gap={Space.n6}>
                            <Icon src={Share2} size={IconSize.n14} style={{ color: "var(--primary-fg)" }} />
                            <Text size={FontSize.n12} style={{ color: "var(--primary-fg)", fontWeight: 600 }}>Share</Text>
                        </Action>
                    </Frame>
                </Frame>

                {/* Toolbar (View Operations) */}
                <Frame
                    layout={Layout.Row.Middle.Between}
                    override={{
                        h: Size.n44,
                        px: Space.n16,
                        borderBottom: true,
                        w: Size.fill,
                        gap: Space.n16
                    }}
                    surface="base" // Or sunken if we want contrast
                >
                    <Frame layout={Layout.Row.Middle.Start} spacing={Space.n0}>
                        {/* View Tabs embedded in Toolbar or distinct? AITable usually has Views in Sidebar or Top Tabs. We chose Sidebar.
                     So this toolbar is for OPERATIONS on the current view.
                 */}
                        <ToolBtn icon={Grid} label="View" active />
                        <Frame style={{ width: 1, height: 16, background: "var(--border-subtle)", margin: "0 8px" }} />
                        <ToolBtn icon={Eye} label="Hidden fields" />
                        <ToolBtn icon={Filter} label="Filter" />
                        <ToolBtn icon={ArrowUpDown} label="Sort" />
                        <ToolBtn icon={LayoutGrid} label="Group" />
                        <ToolBtn icon={Download} label="Color" />
                        <ToolBtn icon={MoreHorizontal} />
                    </Frame>

                    <Frame layout={Layout.Row.Middle.End} spacing={Space.n8}>
                        <Frame
                            rounded={Radius2.sm}
                            surface="sunken"
                            layout={Layout.Row.Middle.Start}
                            override={{ h: Size.n32, px: Space.n8, border: true }}
                            spacing={Space.n6}
                            style={{ width: 200 }}
                        >
                            <Icon src={Search} size={IconSize.n14} style={{ opacity: 0.5 }} />
                            <input
                                placeholder="Find in view"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "12px",
                                    width: "100%",
                                    color: "var(--text-primary)"
                                }}
                            />
                        </Frame>
                    </Frame>
                </Frame>

                {/* Data Grid Area */}
                <Frame override={{ flex: 1, w: Size.fill }} style={{ position: 'relative' }} scroll>
                    <DataTable
                        data={data}
                        columns={columns}
                        onChange={setData}
                        height="100%"
                        options={{
                            loop: false,
                            editOnType: true,
                            moveOnEnter: "none"
                        }}
                    />

                    {/* Floating Info Footer (Optional, like Airtable summary) */}
                    <Frame
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderTop: "1px solid var(--border-color)",
                            background: "var(--surface-base)"
                        }}
                        override={{ h: Size.n32, px: Space.n24 }}
                        layout={Layout.Row.Middle.Start}
                    >
                        <Text.Card.Note>{data.length} records</Text.Card.Note>
                    </Frame>
                </Frame>
            </Frame>
        </Frame>
        </>
    );
}

function SideItem({ navId, label, icon: IconSrc, onClick }: { navId: string, label: string, icon: any, onClick?: () => void }) {
    const { isSelected } = useNavState(navId);
    return (
        <Frame
            navId={navId}
            layout={Layout.Row.Middle.Start}
            spacing={Space.n8}
            override={{ px: Space.n8, py: Space.n6, cursor: "pointer", gap: Space.n10 }}
            rounded={Radius2.md}
            surface={isSelected ? "sunken" : "ghost"}
            onClick={onClick}
            interactive
            style={{
                position: "relative",
            }}
        >
            {/* Selection Indicator Bar */}
            {isSelected && (
                <Frame
                    style={{
                        position: "absolute",
                        left: -8, // Align with sidebar edge
                        top: 8,
                        bottom: 8,
                        width: 3,
                        background: "var(--primary-bg)",
                        borderRadius: "0 2px 2px 0"
                    }}
                />
            )}

            <Icon
                src={IconSrc}
                size={IconSize.n14}
                style={{
                    opacity: isSelected ? 1 : 0.6,
                    color: isSelected ? "var(--primary-bg)" : "inherit"
                }}
            />
            <Text
                size={FontSize.n13}
                weight={isSelected ? "medium" : "regular"}
                style={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)"
                }}
            >
                {label}
            </Text>
            {isSelected && <Icon src={MoreHorizontal} size={IconSize.n12} style={{ opacity: 0.5 }} />}
        </Frame>
    );
}

function ToolBtn({ icon: IconSrc, label, active = false }: { icon: any, label?: string, active?: boolean }) {
    return (
        <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n4}
            override={{ px: Space.n8, h: Size.n32, cursor: "pointer" }}
            rounded={Radius2.sm}
            style={{
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--surface-sunken-bg)" : "transparent"
            }}
        >
            <Icon src={IconSrc} size={IconSize.n14} />
            {label && <Text size={FontSize.n13}>{label}</Text>}
            {/* {label && <Icon src={ChevronDown} size={IconSize.n10} style={{opacity: 0.5, marginLeft: 2}} />} */}
        </Frame>
    )
}
