import { checkFrameDesignRules } from "./rules/frame-design-rules";
import { checkFrameStyleUsage } from "./rules/frame-style-usage";
import { checkDesignHints } from "./rules/design-hints";
import { checkOverrideToLayout } from "./rules/override-to-layout";
import { checkRedundantOverride } from "./rules/redundant-override";
import type { ComputedCSS, FrameProps, Issue, Project } from "./types";
import { SyntaxKind } from "./types";

export { computeFinalCSS, analyzeFile };
// Simplified CSS computation without runtime resolution
function computeFinalCSS(props: FrameProps): ComputedCSS {
  // Fallback: basic prop-based detection
  return {
    hasBackground: !!props.surface,
    hasPadding: !!props.p || !!props.px || !!props.py,
    hasBorder: !!props.border,
    hasRadius: !!props.rounded,
    isFloating: false,
    rawCSS: {},
  };
}

/**
 * Extract all Frame props from JSX element using AST

 */
async function analyzeFile(
  project: Project,
  filePath: string,
): Promise<Issue[]> {
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) return [];

  const issues: Issue[] = [];

  // Find all JSX elements
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
  const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement,
  );

  // Check JSX opening elements (from JsxElement)
  for (const jsxElement of jsxElements) {
    const openingElement = jsxElement.getOpeningElement();
    checkFrameStyleUsage(openingElement, issues, filePath);
    checkFrameDesignRules(openingElement, issues, filePath);
    checkDesignHints(openingElement, issues, filePath);
    await checkOverrideToLayout(openingElement, issues, filePath);
    await checkRedundantOverride(openingElement, issues, filePath);
  }

  // Check self-closing elements
  for (const selfClosingElement of jsxSelfClosingElements) {
    checkFrameStyleUsage(selfClosingElement, issues, filePath);
    checkFrameDesignRules(selfClosingElement, issues, filePath);
    checkDesignHints(selfClosingElement, issues, filePath);
    await checkOverrideToLayout(selfClosingElement, issues, filePath);
    await checkRedundantOverride(selfClosingElement, issues, filePath);
  }

  return issues;
}
