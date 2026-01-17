import { computeFinalCSS } from "../analyzer";
import { extractFrameProps, parseStyleObject } from "../ast-parser";
import type { Issue, JsxOpeningElement, JsxSelfClosingElement } from "../types";

export { checkFrameDesignRules };
function checkFrameDesignRules(
  element: JsxOpeningElement | JsxSelfClosingElement,
  issues: Issue[],
  filePath: string,
): void {
  const tagName = element.getTagNameNode().getText();
  if (tagName !== "Frame") return;

  const sourceFile = element.getSourceFile();
  const { line, column } = sourceFile.getLineAndColumnAtPos(element.getStart());
  const elementText = element.getText().split("\n")[0];

  // Extract all props
  const props = extractFrameProps(element);

  // Compute final CSS
  const computed = computeFinalCSS(props);

  // Rule 1: Surface without padding (HIGHEST PRIORITY)
  if (computed.hasBackground && !computed.hasPadding) {
    issues.push({
      file: filePath,
      line,
      column,
      rule: "Surface without padding",
      message: `surface="${props.surface}" requires padding for visual breathing room.`,
      severity: "error",
      code: elementText.trim(),
      fixable: false,
    });
  }

  // Rule 2: Border without radius on floating
  if (computed.hasBorder && !computed.hasRadius && computed.isFloating) {
    issues.push({
      file: filePath,
      line,
      column,
      rule: "Floating Flat Surface",
      message:
        'Floating surfaces with borders must have border-radius. Add rounded="md"',
      severity: "error",
      code: elementText.trim(),
      fixable: false,
    });
  }

  // Rule 3: Hardcoded background (detect style={{ background: ... }})
  const styleAttr = element.getAttribute("style");
  if (styleAttr && styleAttr.getKind() === 267) { // SyntaxKind.JsxAttribute = 267
    // Cast strict type
    const styleObj = parseStyleObject(styleAttr as any);
    if (
      styleObj &&
      (styleObj.background || styleObj.backgroundColor) &&
      !props.surface
    ) {
      issues.push({
        file: filePath,
        line,
        column,
        rule: "Hardcoded background",
        message:
          'Use surface token instead of hardcoded background. Replace with surface="raised" or similar',
        severity: "error",
        code: elementText.trim(),
        fixable: false,
      });
    }
  }
}
