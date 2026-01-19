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
    Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { Action } from "../design-system/Action";
import { DataTable } from "../design-system/DataTable";
import { Frame } from "../design-system/Frame/Frame";
import { Layout } from "../design-system/Frame/Layout/Layout";
import { Icon } from "../design-system/Icon";
import { Text } from "../design-system/text/Text";
import { IconSize, Size, Space, ZIndex } from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

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

    return (
        <Frame surface="base" override={{ w: Size.fill, h: Size.fill }} layout={Layout.Row.Top.Start} spacing={Space.n0}>
            {/* 1. Left Sidebar (Views & Navigation) */}
            <Frame
                surface="sunken"
                override={{
                    w: "260px",
                    h: Size.fill,
                    border: true,
                    p: Space.n0,
                    gap: Space.n0,
                    zIndex: ZIndex.n100
                }}
                style={{ flexShrink: 0 }}
            >
                {/* Sidebar Header */}
                <Frame layout={Layout.Row.Middle.Between} override={{ h: Size.n48, px: Space.n16, borderBottom: true }}>
                    <Frame layout={Layout.Row.Middle.Start} spacing={Space.n8}>
                        <Frame
                            w={Size.n24} h={Size.n24} rounded={Radius2.md} surface="primary"
                            layout={Layout.Row.Middle.Center}
                        >
                            <Icon src={LayoutGrid} size={IconSize.n14} style={{ color: "white" }} />
                        </Frame>
                        <Text.Card.Title style={{ fontSize: "14px" }}>Space HR</Text.Card.Title>
                    </Frame>
                    <Icon src={ChevronDown} size={IconSize.n16} style={{ opacity: 0.5 }} />
                </Frame>

                {/* Views List */}
                <Frame override={{ p: Space.n8, gap: Space.n4, overflow: "auto", flex: 1 }}>
                    <SideItem icon={Grid} label="All Employees" active />
                    <SideItem icon={Users} label="Engineering Team" />
                    <SideItem icon={Users} label="Design Team" />
                    <SideItem icon={Filter} label="Active Status" />

                    <Frame override={{ my: Space.n8, h: "1px", w: Size.fill }} style={{ background: "var(--border-subtle)" }} />

                    <Text.Card.Note style={{ padding: "0 8px", fontSize: "11px", fontWeight: 600, opacity: 0.7 }}>FOLDERS</Text.Card.Note>
                    <SideItem icon={ChevronDown} label="Quarterly Reviews" />
                    <SideItem icon={ChevronDown} label="Onboarding" />

                    <Frame override={{ my: Space.n8, h: "1px", w: Size.fill }} style={{ background: "var(--border-subtle)" }} />

                    <SideItem icon={Trash2} label="Trash" />
                </Frame>

                {/* Sidebar Footer */}
                <Frame override={{ p: Space.n12, borderTop: true }}>
                    <Action variant="surface" border override={{ w: Size.fill }} gap={Space.n8}>
                        <Icon src={Plus} size={IconSize.n14} />
                        New View
                    </Action>
                </Frame>
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
                        <Text size={Size.n14} weight="medium" style={{ color: "var(--text-secondary)" }}>Workspace</Text>
                        <Text size={Size.n14} style={{ color: "var(--text-tertiary)" }}>/</Text>
                        <Text size={Size.n14} weight="medium">Employee Database</Text>
                    </Frame>

                    {/* Right: Global Tools */}
                    <Frame layout={Layout.Row.Middle.End} spacing={Space.n4}>
                        <Action variant="ghost" rounded={Radius2.full} override={{ p: Space.n8 }}>
                            <Icon src={Search} size={IconSize.n16} />
                        </Action>
                        <Action variant="ghost" rounded={Radius2.full} override={{ p: Space.n8 }}>
                            <Icon src={Settings} size={IconSize.n16} />
                        </Action>
                        <Frame style={{ width: 1, height: 16, background: "var(--border-subtle)", margin: "0 8px" }} />
                        <Action variant="primary" override={{ h: Size.n28, px: Space.n12 }} gap={Space.n6}>
                            <Icon src={Share2} size={IconSize.n14} style={{ color: "white" }} />
                            <Text size={Size.n12} style={{ color: "white", fontWeight: 600 }}>Share</Text>
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
                            override={{ h: Size.n28, px: Space.n8, border: true }}
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
                <Frame override={{ flex: 1, w: Size.fill, overflow: "hidden" }} style={{ position: 'relative' }}>
                    <DataTable
                        data={data}
                        columns={columns}
                        onChange={setData}
                        height="100%"
                        options={{
                            loop: false,
                            editOnType: true,
                            moveOnEnter: "down"
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
    );
}

function SideItem({ icon: IconSrc, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <Frame
            layout={Layout.Row.Middle.Start}
            spacing={Space.n8}
            override={{ px: Space.n8, py: Space.n6, cursor: "pointer" }}
            rounded={Radius2.md}
            style={{
                background: active ? "var(--surface-sunken-bg)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)"
            }}
        // hover effect handled by CSS usually, but we can rely on interactive surface props if we used Action. 
        // For Frame, we just manually style for now or use Action variant="ghost".
        >
            <Icon src={IconSrc} size={IconSize.n14} />
            <Text size={Size.n13} weight={active ? "medium" : "regular"} style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {label}
            </Text>
            {active && <Icon src={MoreHorizontal} size={IconSize.n12} style={{ opacity: 0.5 }} />}
        </Frame>
    )
}

function ToolBtn({ icon: IconSrc, label, active = false }: { icon: any, label?: string, active?: boolean }) {
    return (
        <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n4}
            override={{ px: Space.n8, h: Size.n28, cursor: "pointer" }}
            rounded={Radius2.sm}
            style={{
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--surface-sunken-bg)" : "transparent"
            }}
        >
            <Icon src={IconSrc} size={IconSize.n14} />
            {label && <Text size={Size.n13}>{label}</Text>}
            {/* {label && <Icon src={ChevronDown} size={IconSize.n10} style={{opacity: 0.5, marginLeft: 2}} />} */}
        </Frame>
    )
}
