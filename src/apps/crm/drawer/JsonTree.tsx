import { useState } from "react";
import { Action } from "../../../design-system/Action";
import { Frame } from "../../../design-system/Frame/Frame";
import { Layout } from "../../../design-system/Frame/Layout/Layout";
import { Text } from "../../../design-system/text/Text";
import { Space } from "../../../design-system/token/token.const.1tier";
import { Radius2 } from "../../../design-system/token/token.const.2tier";

interface JsonTreeProps {
    data: unknown;
    name?: string; // Key name if part of an object
    isLast?: boolean; // For trailing commas (optional, maybe skip for cleaner UI)
    depth?: number; // For indentation logic or we can just nest Frames
    initiallyExpanded?: boolean;
}

export function JsonTree({ data, name, depth = 0, initiallyExpanded = false }: JsonTreeProps) {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    const isObject = typeof data === "object" && data !== null;
    const isArray = Array.isArray(data);
    const isComplex = isObject || isArray;

    if (!isComplex) {
        return (
            <Frame layout={Layout.Row.Item.Default} gap={Space.n4}>
                {name && (
                    <Text.Field.Value style={{ color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                        {name}:
                    </Text.Field.Value>
                )}
                <Text.Field.Label style={{ color: getPrimitiveColor(data) }}>
                    {formatPrimitive(data)}
                </Text.Field.Label>
            </Frame>
        );
    }

    // Complex Rendering (Object/Array)
    const keys = Object.keys(data as object);
    const isEmpty = keys.length === 0;
    const sizeLabel = `${keys.length} ${keys.length === 1 ? "item" : "items"}`;

    // Preview for collapsed state
    const preview = isArray ? `[...]` : `{...}`;

    if (isEmpty) {
        return (
            <Frame layout={Layout.Row.Item.Default} gap={Space.n4}>
                {name && (
                    <Text.Field.Value style={{ color: "var(--text-tertiary)" }}>
                        {name}:
                    </Text.Field.Value>
                )}
                <Text.Field.Label style={{ color: "var(--text-tertiary)" }}>
                    {isArray ? "[]" : "{}"}
                </Text.Field.Label>
            </Frame>
        );
    }

    return (
        <Frame layout={Layout.Stack.Content.None}>
            <Action onClick={() => setIsExpanded(!isExpanded)}>
                <Frame layout={Layout.Row.Item.Default} gap={Space.n4} style={{ cursor: "pointer" }}>
                    {/* Caret */}
                    <Text.Field.Value style={{ color: "var(--text-tertiary)", fontSize: "11px", width: "12px" }}>
                        {isExpanded ? "▼" : "▶"}
                    </Text.Field.Value>

                    {name && (
                        <Text.Field.Value style={{ color: "var(--text-tertiary)" }}>
                            {name}:
                        </Text.Field.Value>
                    )}

                    <Text.Field.Label style={{ color: "var(--text-secondary)" }}>
                        {isExpanded ? (isArray ? "[" : "{") : preview}
                    </Text.Field.Label>

                    {!isExpanded && (
                        <Frame
                            override={{ px: Space.n6, py: Space.n2 }}
                            surface="sunken"
                            rounded={Radius2.sm}
                        >
                            <Text.Field.Value style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                                {sizeLabel}
                            </Text.Field.Value>
                        </Frame>
                    )}
                </Frame>
            </Action>

            {/* Children */}
            {isExpanded && (
                <Frame layout={Layout.Stack.Content.None} override={{ pl: Space.n16 }}>
                    {keys.map((key) => {
                        const value = (data as any)[key];
                        return (
                            <JsonTree
                                key={key}
                                name={isArray ? undefined : key} // Don't show index keys for arrays generally, or maybe strictly we should? DBeaver shows indices. Let's start without for cleaner UI, or maybe simple numbering.
                                data={value}
                                depth={depth + 1}
                            />
                        );
                    })}
                    <Text.Field.Label style={{ color: "var(--text-secondary)" }}>
                        {isArray ? "]" : "}"}
                    </Text.Field.Label>
                </Frame>
            )}
        </Frame>
    );
}

// Helpers
function getPrimitiveColor(value: unknown): string {
    if (typeof value === "string") return "var(--text-primary)"; // Strings
    if (typeof value === "number") return "#0969da"; // Blueish for numbers
    if (typeof value === "boolean") return "#1a7f37"; // Greenish for boolean
    return "var(--text-primary)";
}

function formatPrimitive(value: unknown): string {
    if (typeof value === "string") return `"${value}"`;
    return String(value);
}
