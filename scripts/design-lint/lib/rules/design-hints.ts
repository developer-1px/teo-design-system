import { SyntaxKind } from "ts-morph";
import type { Issue } from "../types";

/**
 * Check for design hints and heuristics
 * 1. Layout.Col.Left for Frame -> suggest Stretch
 * 2. Hardcoded colors
 * 3. className usages
 */
export function checkDesignHints(
    jsxElement: any,
    issues: Issue[],
    filePath: string,
) {
    const tagName = jsxElement.getTagNameNode().getText();
    if (tagName !== "Frame") return;

    const props = jsxElement.getAttributes();

    let hasLayout = false;

    for (const prop of props) {
        // Safe cast to JsxAttribute
        const attr = prop.asKind(SyntaxKind.JsxAttribute);
        if (!attr) continue;

        // Use getNameNode().getText() as consistent with ast-parser
        const propName = attr.getNameNode().getText();

        // Rule: className
        if (propName === "className") {
            issues.push({
                file: filePath,
                line: attr.getStartLineNumber(),
                column: attr.getStart(),
                rule: "no-classname",
                message: "Do not use 'className'. Use 'override' or 'style' for custom styling.",
                severity: "error",
            });
        }

        // Heuristic: Layout.Col.Left
        if (propName === "layout") {
            hasLayout = true;
            const initializer = attr.getInitializer();
            if (initializer && initializer.getKind() === SyntaxKind.JsxExpression) {
                const expression = initializer.getExpression();
                if (expression) {
                    const text = expression.getText();
                    if (text.includes("Layout.Col.Left")) {
                        issues.push({
                            file: filePath,
                            line: attr.getStartLineNumber(),
                            column: attr.getStart(),
                            rule: "heuristic-layout-stretch",
                            message: "Consider using 'Layout.Col.Stretch' for structural containers to ensure children fill the width.",
                            severity: "warn",
                        });
                    }
                }
            }
        }

        // Hint: Hardcoded colors in override or style
        if (propName === "override" || propName === "style") {
            const initializer = attr.getInitializer();
            if (initializer) {
                const text = initializer.getText();
                // Simple regex for hex or rgb strings
                if (/#([0-9a-fA-F]{3}){1,2}|rgb\s*\(|rgba\s*\(/.test(text)) {
                    issues.push({
                        file: filePath,
                        line: attr.getStartLineNumber(),
                        column: attr.getStart(),
                        rule: "no-hardcoded-colors",
                        message: `Hardcoded color detected in '${propName}'. Use semantic tokens (var(--surface-...), var(--text-...)) instead.`,
                        severity: "warn",
                    });
                }
            }
        }
    }
}
