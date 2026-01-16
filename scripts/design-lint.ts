import path from "node:path";
import {
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type JsxAttribute,
  Project,
  SyntaxKind,
  Node,
} from "ts-morph";

// Import runtime functions for CSS calculation
import { frameToSettings } from "../src/design-system/Frame/frameToSettings.ts";
import { resolveLayout } from "../src/design-system/Frame/Layout/Layout.ts";
import type { LayoutToken } from "../src/design-system/Frame/Layout/Layout.ts";
import { Space, Size } from "../src/design-system/token/token.const.1tier.ts";

// Configuration
const TARGET_PATTERN = "src/apps/**/*.tsx";
const FIX_MODE = process.argv.includes("--fix");

// Token mapping tables: CSS value → Token name
const SPACE_VALUES_TO_TOKENS: Record<string, string> = {
  "0px": "Space.n0",
  "2px": "Space.n2",
  "4px": "Space.n4",
  "6px": "Space.n6",
  "8px": "Space.n8",
  "10px": "Space.n10",
  "12px": "Space.n12",
  "14px": "Space.n14",
  "16px": "Space.n16",
  "18px": "Space.n18",
  "20px": "Space.n20",
  "22px": "Space.n22",
  "24px": "Space.n24",
  "26px": "Space.n26",
  "28px": "Space.n28",
  "30px": "Space.n30",
  "32px": "Space.n32",
  "36px": "Space.n36",
  "40px": "Space.n40",
  "44px": "Space.n44",
  "48px": "Space.n48",
  "56px": "Space.n56",
  "64px": "Space.n64",
  "72px": "Space.n72",
  "80px": "Space.n80",
  "88px": "Space.n88",
  "96px": "Space.n96",
  "112px": "Space.n112",
  "128px": "Space.n128",
  "144px": "Space.n144",
  "160px": "Space.n160",
};

const SIZE_VALUES_TO_TOKENS: Record<string, string> = {
  "100%": "Size.fill",
  "100vh": "Size.screen",
  "100vw": "Size.screen",
  "0px": "Size.n0",
  "12px": "Size.n12",
  "16px": "Size.n16",
  "20px": "Size.n20",
  "24px": "Size.n24",
  "28px": "Size.n28",
  "32px": "Size.n32",
  "36px": "Size.n36",
  "40px": "Size.n40",
  "44px": "Size.n44",
  "48px": "Size.n48",
  "56px": "Size.n56",
  "64px": "Size.n64",
  "80px": "Size.n80",
  "96px": "Size.n96",
  "128px": "Size.n128",
  "160px": "Size.n160",
  "192px": "Size.n192",
  "224px": "Size.n224",
  "240px": "Size.n240",
  "256px": "Size.n256",
  "320px": "Size.n320",
  "384px": "Size.n384",
  "448px": "Size.n448",
  "512px": "Size.n512",
  "640px": "Size.n640",
  "768px": "Size.n768",
  "896px": "Size.n896",
  "1024px": "Size.n1024",
  "1200px": "Size.n1200",
};

// CSS property → Override prop mapping
const CSS_TO_OVERRIDE_PROP: Record<string, string> = {
  padding: "p",
  paddingTop: "pt",
  paddingBottom: "pb",
  paddingLeft: "pl",
  paddingRight: "pr",
  paddingInline: "px",
  paddingBlock: "py",
  gap: "gap",
  width: "w",
  height: "h",
  minWidth: "minWidth",
  minHeight: "minHeight",
  maxWidth: "maxWidth",
  maxHeight: "maxHeight",
};

interface Issue {
  file: string;
  line: number;
  column: number;
  rule: string;
  message: string;
  code?: string;
  fixable?: boolean;
}

interface FrameProps {
  surface?: string;
  border?: boolean | string;
  rounded?: string | boolean;
  layout?: string;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  [key: string]: any;
}

interface ComputedCSS {
  hasBackground: boolean;
  hasPadding: boolean;
  hasBorder: boolean;
  hasRadius: boolean;
  isFloating: boolean;
  rawCSS: any;
}

/**
 * Compute final CSS properties by executing runtime logic
 * This simulates what Frame component actually renders
 */
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
 * ⚠️ CRITICAL: NO REGEX ALLOWED - Use AST only!
 */
function extractFrameProps(element: JsxOpeningElement | JsxSelfClosingElement): FrameProps {
  const props: FrameProps = {};

  for (const attr of element.getAttributes()) {
    if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;

    const jsxAttr = attr.asKind(SyntaxKind.JsxAttribute);
    if (!jsxAttr) continue;

    const nameNode = jsxAttr.getNameNode();
    const name = nameNode.getText();
    const initializer = jsxAttr.getInitializer();

    if (!initializer) {
      // Boolean prop (e.g., border, fill)
      props[name] = true;
      continue;
    }

    // Get value from different node types
    if (Node.isStringLiteral(initializer)) {
      props[name] = initializer.getLiteralValue();
    } else if (Node.isJsxExpression(initializer)) {
      const expression = initializer.getExpression();
      if (!expression) continue;

      if (Node.isStringLiteral(expression)) {
        props[name] = expression.getLiteralValue();
      } else if (Node.isNumericLiteral(expression)) {
        props[name] = expression.getLiteralValue();
      } else if (Node.isTrueLiteral(expression)) {
        props[name] = true;
      } else if (Node.isFalseLiteral(expression)) {
        props[name] = false;
      } else if (Node.isPropertyAccessExpression(expression)) {
        // e.g., Layout.Stack.Content or Space.n12
        props[name] = expression.getText();
      } else {
        // Complex expression, store as text
        props[name] = expression.getText();
      }
    }
  }

  return props;
}

/**
 * Parse style attribute value to extract CSS properties
 * ⚠️ CRITICAL: NO REGEX ALLOWED - Use AST only!
 */
function parseStyleObject(styleAttr: JsxAttribute): Record<string, string> | null {
  const initializer = styleAttr.getInitializer();
  if (!initializer) return null;

  // Get the JsxExpression node
  const jsxExpression = initializer.asKind(SyntaxKind.JsxExpression);
  if (!jsxExpression) return null;

  // Get the inner expression (the object literal)
  const expression = jsxExpression.getExpression();
  if (!expression) return null;

  // Check if it's an ObjectLiteralExpression
  const objectLiteral = expression.asKind(SyntaxKind.ObjectLiteralExpression);
  if (!objectLiteral) return null;

  const styleObj: Record<string, string> = {};

  // Iterate through properties using AST
  for (const prop of objectLiteral.getProperties()) {
    // Only handle PropertyAssignment (e.g., border: "...")
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

    const propertyAssignment = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
    const name = propertyAssignment.getName();
    const initializer = propertyAssignment.getInitializer();

    if (!initializer) continue;

    // Get the literal value (string, number, etc.)
    let value: string | null = null;

    if (Node.isStringLiteral(initializer)) {
      value = initializer.getLiteralValue();
    } else if (Node.isNumericLiteral(initializer)) {
      value = initializer.getLiteralValue().toString();
    } else if (Node.isNoSubstitutionTemplateLiteral(initializer)) {
      value = initializer.getLiteralValue();
    } else {
      // For complex expressions (ternary, function calls, etc.), get the text representation
      value = initializer.getText();
    }

    if (value !== null) {
      styleObj[name] = value;
    }
  }

  return styleObj;
}

/**
 * Check if style can be converted to border prop
 */
function isBorderStyleFixable(styleObj: Record<string, string>): {
  fixable: boolean;
  borderType: "border" | "borderTop" | "borderBottom" | "borderLeft" | "borderRight" | null;
} {
  const borderProps = ["border", "borderTop", "borderBottom", "borderLeft", "borderRight"];

  for (const prop of borderProps) {
    if (styleObj[prop] === "1px solid var(--border-color)") {
      return { fixable: true, borderType: prop as any };
    }
  }

  return { fixable: false, borderType: null };
}

/**
 * Detect tokenizable styles that can be converted to override prop
 * ⚠️ NO REGEX - AST only
 */
function detectTokenizableStyles(styleObj: Record<string, string>): {
  fixable: boolean;
  conversions: Array<{ cssProp: string; cssValue: string; overrideProp: string; tokenValue: string }>;
} {
  const conversions: Array<{ cssProp: string; cssValue: string; overrideProp: string; tokenValue: string }> = [];

  for (const [cssProp, cssValue] of Object.entries(styleObj)) {
    // Skip non-tokenizable properties
    if (!CSS_TO_OVERRIDE_PROP[cssProp]) continue;

    const overrideProp = CSS_TO_OVERRIDE_PROP[cssProp];
    let tokenValue: string | null = null;

    // Try Space tokens first (for padding, gap)
    if (["padding", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "paddingInline", "paddingBlock", "gap"].includes(cssProp)) {
      tokenValue = SPACE_VALUES_TO_TOKENS[cssValue] || null;
    }

    // Try Size tokens (for width, height)
    if (!tokenValue && ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"].includes(cssProp)) {
      tokenValue = SIZE_VALUES_TO_TOKENS[cssValue] || null;
    }

    // Also check for var(--space-*) or var(--size-*) format
    // Extract number from "var(--space-n12)" → "Space.n12"
    if (!tokenValue && cssValue.startsWith("var(--space-n")) {
      const numPart = cssValue.slice("var(--space-n".length, -1); // Remove "var(--space-n" and ")"
      if (numPart && !numPart.includes("-")) { // Ensure it's just a number
        tokenValue = `Space.n${numPart}`;
      }
    }

    if (!tokenValue && cssValue.startsWith("var(--size-n")) {
      const numPart = cssValue.slice("var(--size-n".length, -1);
      if (numPart && !numPart.includes("-")) {
        tokenValue = `Size.n${numPart}`;
      }
    }

    if (tokenValue) {
      conversions.push({ cssProp, cssValue, overrideProp, tokenValue });
    }
  }

  return {
    fixable: conversions.length > 0,
    conversions,
  };
}

/**
 * Apply auto-fix: convert style to override prop
 * ⚠️ CRITICAL: NO STRING TEMPLATES - Use AST node manipulation only!
 */
function fixStyleToOverride(
  element: JsxOpeningElement | JsxSelfClosingElement,
  styleAttr: JsxAttribute,
  conversions: Array<{ cssProp: string; cssValue: string; overrideProp: string; tokenValue: string }>,
): void {
  // Step 1: Get or create override attribute
  let overrideAttr = element.getAttribute("override");

  // Step 2: Remove converted properties from style
  const initializer = styleAttr.getInitializer();
  const jsxExpression = initializer?.asKind(SyntaxKind.JsxExpression);
  const objectLiteral = jsxExpression?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

  if (objectLiteral) {
    // Find and remove converted properties from style AST
    const properties = objectLiteral.getProperties();
    for (const prop of properties) {
      if (prop.getKind() === SyntaxKind.PropertyAssignment) {
        const assignment = prop.asKind(SyntaxKind.PropertyAssignment);
        const propName = assignment?.getName();

        // Check if this property is being converted
        const isConverted = conversions.some(c => c.cssProp === propName);
        if (isConverted && assignment) {
          assignment.remove();
        }
      }
    }

    // If style object is now empty, remove the entire style attribute
    if (objectLiteral.getProperties().length === 0) {
      styleAttr.remove();
    }
  }

  // Step 3: Add or update override attribute
  if (!overrideAttr) {
    // Create new override={{ ... }}
    const overrideProps = conversions.map(c => `${c.overrideProp}: ${c.tokenValue}`).join(", ");
    const insertIndex = element.getAttributes().length;
    element.insertAttribute(insertIndex, {
      name: "override",
      initializer: `{{ ${overrideProps} }}`,
    });
  } else {
    // Merge with existing override
    const overrideInit = overrideAttr.getInitializer();
    const overrideExpr = overrideInit?.asKind(SyntaxKind.JsxExpression);
    const overrideObj = overrideExpr?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

    if (overrideObj) {
      // Add new properties to existing override object
      for (const { overrideProp, tokenValue } of conversions) {
        overrideObj.addPropertyAssignment({
          name: overrideProp,
          initializer: tokenValue,
        });
      }
    }
  }
}

/**
 * Apply auto-fix: convert style={{ border: "..." }} to border prop
 * ⚠️ CRITICAL: NO STRING TEMPLATES - Use AST node manipulation only!
 */
function fixBorderStyle(
  element: JsxOpeningElement | JsxSelfClosingElement,
  styleAttr: JsxAttribute,
  styleObj: Record<string, string>,
  borderType: string,
): void {
  // Step 1: Remove the border property from style object
  delete styleObj[borderType];

  // Step 2: Update or remove style attribute using AST
  if (Object.keys(styleObj).length === 0) {
    // No remaining styles - remove the entire style attribute
    styleAttr.remove();
  } else {
    // Get the existing object literal expression
    const initializer = styleAttr.getInitializer();
    const jsxExpression = initializer?.asKind(SyntaxKind.JsxExpression);
    const objectLiteral = jsxExpression?.getExpression()?.asKind(SyntaxKind.ObjectLiteralExpression);

    if (objectLiteral) {
      // Find and remove the border property from AST
      const properties = objectLiteral.getProperties();
      for (const prop of properties) {
        if (prop.getKind() === SyntaxKind.PropertyAssignment) {
          const assignment = prop.asKind(SyntaxKind.PropertyAssignment);
          if (assignment && assignment.getName() === borderType) {
            assignment.remove();
            break;
          }
        }
      }
    }
  }

  // Step 3: Add border prop using ts-morph's insertAttribute
  const insertIndex = element.getAttributes().length;

  if (borderType === "border") {
    // Boolean prop: <Frame border>
    element.insertAttribute(insertIndex, {
      name: "border",
    });
  } else {
    // String prop: <Frame border="top">
    const direction = borderType.replace("border", "").toLowerCase();
    element.insertAttribute(insertIndex, {
      name: "border",
      initializer: `"${direction}"`,
    });
  }
}

/**
 * Check design system rules on Frame component
 */
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
      message: `surface="${props.surface}" requires padding for visual breathing room. Add p={3} or use Layout.Stack.Section`,
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
      message: "Floating surfaces with borders must have border-radius. Add rounded=\"md\"",
      code: elementText.trim(),
      fixable: false,
    });
  }

  // Rule 3: Hardcoded background (detect style={{ background: ... }})
  const styleAttr = element.getAttribute("style");
  if (styleAttr) {
    const styleObj = parseStyleObject(styleAttr);
    if (styleObj && (styleObj.background || styleObj.backgroundColor) && !props.surface) {
      issues.push({
        file: filePath,
        line,
        column,
        rule: "Hardcoded background",
        message: "Use surface token instead of hardcoded background. Replace with surface=\"raised\" or similar",
        code: elementText.trim(),
        fixable: false,
      });
    }
  }
}

function checkFrameStyleUsage(
  element: JsxOpeningElement | JsxSelfClosingElement,
  issues: Issue[],
  filePath: string,
): void {
  const tagName = element.getTagNameNode().getText();

  if (tagName !== "Frame") return;

  const styleAttribute = element.getAttribute("style");

  if (styleAttribute) {
    const sourceFile = element.getSourceFile();
    const { line, column } = sourceFile.getLineAndColumnAtPos(
      element.getStart(),
    );
    const elementText = element.getText().split("\n")[0]; // First line only

    // Parse style object to check if auto-fixable
    const styleObj = parseStyleObject(styleAttribute);

    if (!styleObj) return;

    // Check 1: Tokenizable styles (padding, gap, width, etc.)
    const { fixable: tokenFixable, conversions } = detectTokenizableStyles(styleObj);

    if (tokenFixable && FIX_MODE) {
      // Apply auto-fix: style → override
      fixStyleToOverride(element, styleAttribute, conversions);

      const propsConverted = conversions.map(c => `${c.cssProp}: "${c.cssValue}" → ${c.overrideProp}: ${c.tokenValue}`).join(", ");
      issues.push({
        file: filePath,
        line,
        column,
        rule: "Style → Override (FIXED)",
        message: `Auto-fixed: ${propsConverted}`,
        code: elementText.trim(),
        fixable: true,
      });
      return; // Don't check border if we already converted
    }

    // Check 2: Border styles
    const { fixable: borderFixable, borderType } = isBorderStyleFixable(styleObj);

    if (borderFixable && borderType && FIX_MODE) {
      // Apply auto-fix: border
      fixBorderStyle(element, styleAttribute, styleObj, borderType);

      issues.push({
        file: filePath,
        line,
        column,
        rule: "Frame Border Style → Prop (FIXED)",
        message: `Auto-fixed: style={{ ${borderType}: "..." }} → border${borderType === "border" ? "" : `="${borderType.replace("border", "").toLowerCase()}"`}`,
        code: elementText.trim(),
        fixable: true,
      });
    } else if (tokenFixable || borderFixable) {
      // Report fixable issue
      let message = "";
      if (tokenFixable) {
        const propsConverted = conversions.map(c => `${c.cssProp} → override.${c.overrideProp}`).join(", ");
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
        message: "Frame component should use semantic props instead of style prop",
        code: elementText.trim(),
        fixable: false,
      });
    }
  }
}

function analyzeFile(project: Project, filePath: string): Issue[] {
  const issues: Issue[] = [];
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) return issues;

  // Find all JSX opening elements (e.g., <Frame ...>)
  const openingElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxOpeningElement,
  );
  openingElements.forEach((element) => {
    checkFrameDesignRules(element, issues, filePath);
    checkFrameStyleUsage(element, issues, filePath);
  });

  // Find all JSX self-closing elements (e.g., <Frame ... />)
  const selfClosingElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement,
  );
  selfClosingElements.forEach((element) => {
    checkFrameDesignRules(element, issues, filePath);
    checkFrameStyleUsage(element, issues, filePath);
  });

  return issues;
}

function run() {
  console.log(`🔍 Starting TypeScript-based Design Lint${FIX_MODE ? " (Auto-fix mode)" : ""}...\n`);

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
  });

  const sourceFiles = project.getSourceFiles(TARGET_PATTERN);
  const allIssues: Issue[] = [];
  let fixedCount = 0;

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    const issues = analyzeFile(project, filePath);

    if (issues.length > 0) {
      allIssues.push(...issues);

      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`📄 ${relativePath}`);

      for (const issue of issues) {
        const prefix = issue.fixable && FIX_MODE ? "✓" : issue.fixable ? "🔧" : "  ";
        console.log(`   ${prefix} L${issue.line} [${issue.rule}]: ${issue.message}`);
        if (issue.code) {
          console.log(`      Code: ${issue.code}`);
        }

        if (issue.fixable && FIX_MODE) {
          fixedCount++;
        }
      }
      console.log("");
    }

    // Save file immediately after processing if fixes were applied
    if (FIX_MODE && issues.some((i) => i.fixable)) {
      sourceFile.saveSync();
    }
  }

  if (FIX_MODE && fixedCount > 0) {
    console.log(`✅ Auto-fixed ${fixedCount} issue(s).\n`);
  }

  const remainingIssues = allIssues.filter((issue) => !issue.fixable || !FIX_MODE).length;
  const fixableIssues = allIssues.filter((issue) => issue.fixable && !FIX_MODE).length;

  console.log(`📊 Summary:`);
  console.log(`   Total issues: ${allIssues.length}`);
  if (FIX_MODE) {
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Remaining: ${remainingIssues}`);
  } else {
    console.log(`   Auto-fixable: ${fixableIssues} (run with --fix to apply)`);
    console.log(`   Manual fixes needed: ${remainingIssues}`);
  }

  // Exit with error code if issues found (and not all fixed)
  if (!FIX_MODE && allIssues.length > 0) {
    process.exit(1);
  }
  if (FIX_MODE && remainingIssues > 0) {
    process.exit(1);
  }
}

run();
