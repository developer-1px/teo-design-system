import React, { useState, useMemo, useEffect, useRef } from "react";
import { Frame } from "../Frame/Frame";
import { Text } from "../text/Text";
import { Icon } from "../Icon";
import { Layout } from "../Frame/Layout/Layout";
import { Space, FontSize, IconSize, Size, ZIndex } from "../token/token.const.1tier";
import { useHeadlessList } from "../hooks/data/useHeadlessList";
import { Search, Command, ArrowRight } from "lucide-react";
import { Radius2 } from "../token/radius2";

export interface PaletteItem {
    id: string;
    label: string;
    description?: string;
    icon?: React.ElementType;
    onSelect: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    items: PaletteItem[];
}

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredItems = useMemo(() => {
        if (!search) return items;
        const lowSearch = search.toLowerCase();
        return items.filter(item =>
            item.label.toLowerCase().includes(lowSearch) ||
            item.description?.toLowerCase().includes(lowSearch)
        );
    }, [items, search]);

    const {
        state: { focusedIndex },
        actions: { setFocusedIndex },
        listProps,
        getItemProps
    } = useHeadlessList({
        items: filteredItems,
        loop: true,
        onSelect: (item) => {
            item.onSelect();
            onClose();
            setSearch("");
        }
    });

    // Auto-focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Frame
            override={{
                zIndex: ZIndex.n200,
                p: Space.n0,
                w: Size.screen,
                h: Size.screen,
            }}
            layout={Layout.Col.Center.Center}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
        >
            <Frame
                onClick={e => e.stopPropagation()}
                w={Size.n512}
                override={{
                    maxHeight: "80vh",
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
                rounded={Radius2.lg}
                surface="base"
            >
                {/* Search Input Area */}
                <Frame
                    override={{ p: Space.n16, gap: Space.n12 }}
                    layout={Layout.Row.Middle}
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                    <Icon src={Search} size={IconSize.n20} color="var(--text-tertiary)" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") onClose();
                            else listProps.onKeyDown(e);
                        }}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "var(--text-primary)",
                            fontSize: "16px",
                            fontFamily: "inherit"
                        }}
                    />
                    <Frame
                        override={{ p: Space.n4, px: Space.n8 }}
                        rounded={Radius2.sm}
                        surface="sunken"
                    >
                        <Text size={FontSize.n10} color="var(--text-tertiary)">ESC</Text>
                    </Frame>
                </Frame>

                {/* Results Area */}
                <Frame
                    override={{
                        p: Space.n8,
                        h: Size.fill,
                        gap: Space.n2
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100px",
                        maxHeight: "400px",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}
                >
                    {filteredItems.length === 0 ? (
                        <Frame override={{ p: Space.n32 }} layout={Layout.Col.Center.Center}>
                            <Text color="var(--text-tertiary)">No results found for "{search}"</Text>
                        </Frame>
                    ) : (
                        filteredItems.map((item, index) => {
                            const props = getItemProps(index);
                            const isFocused = focusedIndex === index;

                            return (
                                <Frame
                                    key={item.id}
                                    onClick={props.onClick}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    override={{
                                        p: Space.n10,
                                        px: Space.n12,
                                        gap: Space.n12,
                                    }}
                                    layout={Layout.Row.Middle}
                                    rounded={Radius2.md}
                                    surface={isFocused ? "sunken" : "ghost"}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.1s ease"
                                    }}
                                >
                                    <Frame
                                        w={Size.n32}
                                        h={Size.n32}
                                        layout={Layout.Row.Middle.Center}
                                        rounded={Radius2.sm}
                                        surface={isFocused ? "base" : "sunken"}
                                    >
                                        <Icon src={item.icon || Command} size={IconSize.n16} />
                                    </Frame>

                                    <Frame override={{ flex: 1 }} layout={Layout.Col}>
                                        <Text weight="medium">{item.label}</Text>
                                        {item.description && (
                                            <Text size={FontSize.n12} color="var(--text-tertiary)">
                                                {item.description}
                                            </Text>
                                        )}
                                    </Frame>

                                    {isFocused && (
                                        <Icon src={ArrowRight} size={IconSize.n16} color="var(--primary-bg)" />
                                    )}
                                </Frame>
                            );
                        })
                    )}
                </Frame>

                {/* Footer area */}
                <Frame
                    override={{ p: Space.n8, px: Space.n16 }}
                    layout={Layout.Row.Middle.Between}
                    style={{ borderTop: "1px solid var(--border-subtle)" }}
                >
                    <Frame layout={Layout.Row.Middle} override={{ gap: Space.n12 }}>
                        <Frame layout={Layout.Row.Middle} override={{ gap: Space.n4 }}>
                            <Frame rounded={Radius2.sm} surface="sunken" override={{ p: Space.n2, px: Space.n4 }}>
                                <Text size={FontSize.n10}>↑↓</Text>
                            </Frame>
                            <Text size={FontSize.n10} color="var(--text-tertiary)">Navigate</Text>
                        </Frame>
                        <Frame layout={Layout.Row.Middle} override={{ gap: Space.n4 }}>
                            <Frame rounded={Radius2.sm} surface="sunken" override={{ p: Space.n2, px: Space.n4 }}>
                                <Text size={FontSize.n10}>Enter</Text>
                            </Frame>
                            <Text size={FontSize.n10} color="var(--text-tertiary)">Select</Text>
                        </Frame>
                    </Frame>
                    <Text size={FontSize.n10} color="var(--text-tertiary)">
                        {filteredItems.length} commands available
                    </Text>
                </Frame>
            </Frame>
        </Frame>
    );
}
