import { parseStyleObject } from "../ast-parser";
import { fixBorderStyle, fixCenterToPack, fixStyleToOverride } from "../fixers";
import { ensureTokenImports } from "../import-manager";
import {
  detectTokenizableStyles,
  isBorderStyleFixable,
  isCenterPackFixable,
} from "../token-detector";
import type { Issue, JsxOpeningElement, JsxSelfClosingElement } from "../types";

const FIX_MODE = process.argv.includes("--fix");

export { checkFrameStyleUsage };
function checkFrameStyleUsage(
  element: JsxOpeningElement | JsxSelfClosingElement,
  issues: Issue[],
  filePath: string,
): void {
  const tagName = element.getTagNameNode().getText();

  if (tagName !== "Frame") return;

  const styleAttribute = element.getAttribute("style");

  if (styleAttribute && styleAttribute.getKind() === 267) {
    const sourceFile = element.getSourceFile();
    const { line, column } = sourceFile.getLineAndColumnAtPos(
      element.getStart(),
    );
    const elementText = element.getText().split("\n")[0]; // First line only

    // Parse style object to check if auto-fixable
    const styleObj = parseStyleObject(styleAttribute as any);

    if (!styleObj) return;

    // Check 0: Center Pack (alignItems + justifyContent both "center")
    const centerPackFixable = isCenterPackFixable(styleObj);

    if (centerPackFixable && FIX_MODE) {
      // Apply auto-fix: style={{ alignItems: "center", justifyContent: "center" }} → pack
      try {
        fixCenterToPack(element, styleAttribute as any, styleObj);

        issues.push({
          file: filePath,
          line,
          column,
          rule: "Center Alignment → pack (FIXED)",
          message:
            'Auto-fixed: style={{ alignItems: "center", justifyContent: "center" }} → pack',
          severity: "error",
          code: elementText.trim(),
          fixable: true,
        });
        return; // Don't check other styles if we converted center pack
      } catch (_error) {
        // Skip this fix if AST manipulation fails
        issues.push({
          file: filePath,
          line,
          column,
          rule: "Center Alignment → pack (SKIPPED)",
          message:
            "Cannot auto-fix center pack due to AST complexity. Manual fix required.",
          severity: "error",
          code: elementText.trim(),
          fixable: false,
        });
        return;
      }
    }

    // Check 1: Tokenizable styles (padding, gap, width, etc.)
    const { fixable: tokenFixable, conversions } =
      detectTokenizableStyles(styleObj);

    if (tokenFixable && FIX_MODE) {
      // Apply auto-fix: style → override
      try {
        // Extract required token imports from conversions
        const requiredTokens = new Set<string>();
        for (const { tokenValue } of conversions) {
          // Extract token type from "Space.n12", "Size.fill", "Opacity.n50", "ZIndex.n200"
          const tokenType = tokenValue.split(".")[0];
          if (["Space", "Size", "Opacity", "ZIndex"].includes(tokenType)) {
            requiredTokens.add(tokenType);
          }
        }

        // Ensure imports are added
        const sourceFile = element.getSourceFile();
        ensureTokenImports(sourceFile, requiredTokens);

        fixStyleToOverride(element, styleAttribute as any, conversions);

        const propsConverted = conversions
          .map(
            (c) =>
              `${c.cssProp}: "${c.cssValue}" → ${c.overrideProp}: ${c.tokenValue}`,
          )
          .join(", ");
        issues.push({
          file: filePath,
          line,
          column,
          rule: "Style → Override (FIXED)",
          message: `Auto-fixed: ${propsConverted}`,
          severity: "error",
          code: elementText.trim(),
          fixable: true,
        });
        return; // Don't check border if we already converted
      } catch (_error) {
        // Skip this fix if AST manipulation fails (e.g., comments in style object)
        const propsConverted = conversions
          .map((c) => `${c.cssProp} → override.${c.overrideProp}`)
          .join(", ");
        issues.push({
          file: filePath,
          line,
          column,
          rule: "Style → Override (SKIPPED)",
          message: `Cannot auto-fix due to AST complexity (comments in style?): ${propsConverted}. Manual fix required.`,
          severity: "error",
          code: elementText.trim(),
          fixable: false,
        });
        return;
      }
    }

    // Check 2: Border styles
    const { fixable: borderFixable, borderType } =
      isBorderStyleFixable(styleObj);

    if (borderFixable && borderType && FIX_MODE) {
      // Apply auto-fix: border
      try {
        fixBorderStyle(element, styleAttribute as any, styleObj, borderType);

        issues.push({
          file: filePath,
          line,
          column,
          rule: "Frame Border Style → Prop (FIXED)",
          message: `Auto-fixed: style={{ ${borderType}: "..." }} → border${borderType === "border" ? "" : `="${borderType.replace("border", "").toLowerCase()}"`}`,
          severity: "error",
          code: elementText.trim(),
          fixable: true,
        });
      } catch (_error) {
        // Skip this fix if AST manipulation fails
        issues.push({
          file: filePath,
          line,
          column,
          rule: "Frame Border Style → Prop (SKIPPED)",
          message: `Cannot auto-fix border due to AST complexity. Manual fix required.`,
          severity: "error",
          code: elementText.trim(),
          fixable: false,
        });
      }
    } else if (tokenFixable || borderFixable) {
      // Report fixable issue
      let message = "";
      if (tokenFixable) {
        const propsConverted = conversions
          .map((c) => `${c.cssProp} → override.${c.overrideProp}`)
          .join(", ");
        message = `Can auto-fix tokenizable styles: ${propsConverted} (run with --fix)`;
      } else if (borderFixable) {
        message = `Can auto-fix: style={{ ${borderType}: "..." }} → border prop (run with --fix)`;
      }

      issues.push({
        file: filePath,
        line,
        column,
        rule: tokenFixable ? "Style → Override" : "Frame Border Style → Prop",
        message,
        severity: "error",
        code: elementText.trim(),
        fixable: true,
      });
    } else if (centerPackFixable) {
      // Report fixable center pack issue
      issues.push({
        file: filePath,
        line,
        column,
        rule: "Center Alignment → pack",
        message:
          'Can auto-fix: style={{ alignItems: "center", justifyContent: "center" }} → pack (run with --fix)',
        severity: "error",
        code: elementText.trim(),
        fixable: true,
      });
    } else {
      // Not auto-fixable
      issues.push({
        file: filePath,
        line,
        column,
        rule: "Frame Style Usage",
        message:
          "Frame component should use semantic props instead of style prop",
        severity: "error",
        code: elementText.trim(),
        fixable: false,
      });
    }
  }
}
