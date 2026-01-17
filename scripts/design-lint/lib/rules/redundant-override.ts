import { extractFrameProps } from "../ast-parser";
import { fixRedundantOverride } from "../fixers";
import type { Issue, JsxOpeningElement, JsxSelfClosingElement } from "../types";
import { isEqual } from "../utils";

const FIX_MODE = process.argv.includes("--fix");

export { checkRedundantOverride };

/**
 * Check if override prop contains values that are redundant with layout preset
 * Only flags values that are exactly the same (different values are intentional overrides)
 */
async function checkRedundantOverride(
  element: JsxOpeningElement | JsxSelfClosingElement,
  issues: Issue[],
  filePath: string,
): Promise<void> {
  const tagName = element.getTagNameNode().getText();
  if (tagName !== "Frame") return;

  const sourceFile = element.getSourceFile();
  const { line, column } = sourceFile.getLineAndColumnAtPos(element.getStart());
  const elementText = element.getText().split("\n")[0];

  // Extract all props
  const props = extractFrameProps(element);

  // Only check if both layout and override exist
  if (!props.layout || !props.override) return;

  try {
    // Parse layout string to get actual layout preset object
    let layoutSettings: any;

    if (typeof props.layout === "string") {
      // Parse layout path (e.g., "Layout.Stack.Content.Default")
      const layoutPath = props.layout.split(".");
      if (layoutPath[0] !== "Layout") return; // Not a Layout reference

      // Dynamically import Layout to avoid circular dependency
      // Note: In strict linter environment, we might catch missing modules here.
      try {
        const { Layout } = await import(
          "../../../../src/design-system/Frame/Layout/Layout"
        );

        // Navigate the Layout object
        let current: any = Layout;
        for (let i = 1; i < layoutPath.length; i++) {
          current = current[layoutPath[i]];
          if (!current) return;
        }
        layoutSettings = current;
      } catch (e) {
        // Cannot import layout, skip check
        return;
      }
    } else {
      // Direct object usage invalidates heuristic without resolveLayout
      return;
    }

    // Find redundant keys (same key, same value)
    const redundantKeys: string[] = [];

    for (const key of Object.keys(props.override)) {
      if (!(key in layoutSettings)) continue;

      const isRedundant = isEqual(layoutSettings[key], props.override[key]);
      if (isRedundant) {
        redundantKeys.push(key);
      }
    }

    // Report if redundant keys found
    if (redundantKeys.length > 0) {
      if (FIX_MODE) {
        // Apply auto-fix: remove redundant override props
        try {
          fixRedundantOverride(element, redundantKeys);

          issues.push({
            file: filePath,
            line,
            column,
            rule: "Redundant override (FIXED)",
            message: `Auto-fixed: Removed redundant override props: ${redundantKeys.join(", ")}`,
            severity: "warn", // Cleanup is a warning/suggestion
            code: elementText.trim(),
            fixable: true,
          });
        } catch (_error) {
          issues.push({
            file: filePath,
            line,
            column,
            rule: "Redundant override (SKIPPED)",
            message: `Cannot auto-fix redundant override due to AST complexity. Manual fix required: ${redundantKeys.join(", ")}`,
            severity: "warn",
            code: elementText.trim(),
            fixable: false,
          });
        }
      } else {
        // Report fixable issue
        issues.push({
          file: filePath,
          line,
          column,
          rule: "Redundant override",
          message: `Can auto-fix: Remove redundant override props already in layout preset: ${redundantKeys.join(", ")} (run with --fix)`,
          severity: "warn",
          code: elementText.trim(),
          fixable: true,
        });
      }
    }
  } catch (_e) {
    // Layout token not recognized or other error, skip
  }
}
