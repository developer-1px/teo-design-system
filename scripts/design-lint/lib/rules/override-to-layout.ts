import { extractFrameProps } from "../ast-parser";
import { fixOverrideToLayout } from "../fixers";
import { findPerfectMatch } from "../layout-matcher";
import type { Issue, JsxOpeningElement, JsxSelfClosingElement } from "../types";

const FIX_MODE = process.argv.includes("--fix");

export { checkOverrideToLayout };

/**
 * Check if Frame without layout has override that matches a Layout preset
 * Suggests converting override to layout prop
 */
async function checkOverrideToLayout(
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

  // Only check if:
  // 1. No layout prop exists
  // 2. Override prop exists and is an object
  if (props.layout || !props.override || typeof props.override !== "object")
    return;

  try {
    // Find perfect matching preset
    const matchedPath = findPerfectMatch(props.override);

    if (matchedPath) {
      if (FIX_MODE) {
        // Apply auto-fix: remove override, add layout
        try {
          await fixOverrideToLayout(element, matchedPath);

          issues.push({
            file: filePath,
            line,
            column,
            rule: "Override → Layout (FIXED)",
            message: `Auto-fixed: Converted override to ${matchedPath}`,
            severity: "warn",
            code: elementText.trim(),
            fixable: true,
          });
        } catch (_error) {
          // Skip this fix if AST manipulation fails
          issues.push({
            file: filePath,
            line,
            column,
            rule: "Override → Layout (SKIPPED)",
            message: `Cannot auto-fix override to layout due to AST complexity. Suggested: ${matchedPath}`,
            severity: "warn",
            code: elementText.trim(),
            fixable: false,
          });
        }
      } else {
        // Report fixable issue
        const overrideKeys = Object.keys(props.override).join(", ");
        issues.push({
          file: filePath,
          line,
          column,
          rule: "Override → Layout",
          message: `Can auto-fix: Convert override {{ ${overrideKeys} }} to layout={${matchedPath}} (run with --fix)`,
          severity: "warn",
          code: elementText.trim(),
          fixable: true,
        });
      }
    }
  } catch (_e) {
    // Error during matching, skip
  }
}
