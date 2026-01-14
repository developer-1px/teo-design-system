import React from "react";

export function formatPropValue(value: any): string {
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "number") return `{${value}}`;
    if (value === true) return ""; // implicit true
    if (value === false) return `{false}`;
    if (typeof value === "function") return `{() => {}}`;
    if (React.isValidElement(value)) return `{<Element />}`;
    if (typeof value === "object" && value !== null) {
        try {
            return `{${JSON.stringify(value)}}`;
        } catch {
            return `{{ ... }}`;
        }
    }
    return `"${String(value)}"`;
}

export function generateJSX(targetName: string, props: Record<string, any>): string {
    // Extract clean component name: "File.tsx:12(Component)" -> "Component"
    let componentName = targetName;
    if (targetName.includes("(")) {
        componentName = targetName.split("(").pop()?.replace(")", "") || targetName;
    }

    const propStrings = Object.entries(props).map(([key, value]) => {
        const valStr = formatPropValue(value);
        // If valStr is empty (implicit true), just return key
        return valStr === "" ? key : `${key}=${valStr}`;
    });

    const propsStr = propStrings.length > 0 ? " " + propStrings.join(" ") : "";
    return `<${componentName}${propsStr}>\n  {/* children */}\n</${componentName}>`;
}
