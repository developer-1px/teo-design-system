import type { FrameProps, ComputedCSS, Issue, Project } from "./types";
import { SyntaxKind } from "./types";
import { frameToSettings } from "../../../src/design-system/Frame/frameToSettings";
import { resolveLayout } from "../../../src/design-system/Frame/Layout/Layout";
import type { LayoutToken } from "../../../src/design-system/Frame/Layout/Layout";
import { extractFrameProps } from "./ast-parser";
import { checkFrameDesignRules } from "./rules/frame-design-rules";
import { checkFrameStyleUsage } from "./rules/frame-style-usage";

export { computeFinalCSS, analyzeFile };
function computeFinalCSS(props: FrameProps): ComputedCSS {
  try {
    // Step 1: Resolve layout preset if exists
    let layoutSettings: any = {};
    if (props.layout) {
      try {
        layoutSettings = resolveLayout(props.layout as LayoutToken);
      } catch (e) {
        // Layout token not recognized, skip
      }
    }

    // Step 2: Merge props (explicit > layout > override)
    const mergedProps = {
      ...layoutSettings,
      ...props,
    };

    // Step 3: Execute frameToSettings
    const { className, style } = frameToSettings(mergedProps as any);

    // Step 4: Analyze computed CSS
    const hasBackground =
      !!props.surface ||
      !!style.background ||
      !!style.backgroundColor;

    const hasPadding =
      !!props.p ||
      !!props.px ||
      !!props.py ||
      !!props.pt ||
      !!props.pb ||
      !!props.pl ||
      !!props.pr ||
      !!layoutSettings.p ||
      !!layoutSettings.px ||
      !!layoutSettings.py ||
      !!style.padding ||
      !!style.paddingTop ||
      !!style.paddingBottom ||
      !!style.paddingLeft ||
      !!style.paddingRight;

    const hasBorder =
      !!props.border ||
      !!style.border ||
      !!style.borderWidth;

    const hasRadius =
      !!props.rounded ||
      !!style.borderRadius;

    // Floating: has centering (maxWidth/margin) but not fill
    const isFloating =
      (!!style.maxWidth || !!style.margin) &&
      !props.fill;

    return {
      hasBackground,
      hasPadding,
      hasBorder,
      hasRadius,
      isFloating,
      rawCSS: style,
    };
  } catch (error) {
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
}

/**
 * Extract all Frame props from JSX element using AST

 */
function analyzeFile(project: Project, filePath: string): Issue[] {
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) return [];

  const issues: Issue[] = [];

  // Find all JSX elements
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
  const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

  // Check JSX opening elements (from JsxElement)
  for (const jsxElement of jsxElements) {
    const openingElement = jsxElement.getOpeningElement();
    checkFrameStyleUsage(openingElement, issues, filePath);
    checkFrameDesignRules(openingElement, issues, filePath);
  }

  // Check self-closing elements
  for (const selfClosingElement of jsxSelfClosingElements) {
    checkFrameStyleUsage(selfClosingElement, issues, filePath);
    checkFrameDesignRules(selfClosingElement, issues, filePath);
  }

  return issues;
}
