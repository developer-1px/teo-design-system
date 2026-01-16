import path from "node:path";
import {
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type JsxAttribute,
  Project,
  SyntaxKind,
  Node,
} from "ts-morph";

// Configuration
const TARGET_PATTERN = "src/apps/**/*.tsx";
const FIX_MODE = process.argv.includes("--fix");

interface Issue {
  file: string;
  line: number;
  column: number;
  rule: string;
  message: string;
  code?: string;
  fixable?: boolean;
}

/**
 * Parse style attribute value to extract CSS properties
 */
function parseStyleObject(styleAttr: JsxAttribute): Record<string, string> | null {
  const initializer = styleAttr.getInitializer();
  if (!initializer) return null;

  const text = initializer.getText();
  // Extract object literal: {{ ... }}
  const match = text.match(/\{\s*\{([^}]+)\}\s*\}/);
  if (!match) return null;

  const styleObj: Record<string, string> = {};
  const properties = match[1].split(",");

  for (const prop of properties) {
    const [key, ...valueParts] = prop.split(":");
    if (!key || valueParts.length === 0) continue;

    const cleanKey = key.trim();
    const cleanValue = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
    styleObj[cleanKey] = cleanValue;
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
 * Apply auto-fix: convert style={{ border: "..." }} to border prop
 * Uses ts-morph AST manipulation only
 */
function fixBorderStyle(
  element: JsxOpeningElement | JsxSelfClosingElement,
  styleAttr: JsxAttribute,
  styleObj: Record<string, string>,
  borderType: string,
): void {
  // Step 1: Remove the border property from style object
  delete styleObj[borderType];

  // Step 2: Update or remove style attribute
  if (Object.keys(styleObj).length === 0) {
    // No remaining styles - remove the entire style attribute
    styleAttr.remove();
  } else {
    // Rebuild the style initializer with remaining properties
    const newStyleProps = Object.entries(styleObj)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(", ");

    // Use ts-morph's setInitializer method
    styleAttr.setInitializer(`{{ ${newStyleProps} }}`);
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
    const { fixable, borderType } = styleObj ? isBorderStyleFixable(styleObj) : { fixable: false, borderType: null };

    if (fixable && borderType && FIX_MODE) {
      // Apply auto-fix
      fixBorderStyle(element, styleAttribute, styleObj!, borderType);

      issues.push({
        file: filePath,
        line,
        column,
        rule: "Frame Border Style → Prop (FIXED)",
        message: `Auto-fixed: style={{ ${borderType}: "..." }} → border${borderType === "border" ? "" : `="${borderType.replace("border", "").toLowerCase()}"`}`,
        code: elementText.trim(),
        fixable: true,
      });
    } else {
      issues.push({
        file: filePath,
        line,
        column,
        rule: fixable ? "Frame Border Style → Prop" : "Frame Style Usage",
        message: fixable
          ? `Can auto-fix: style={{ ${borderType}: "..." }} → border prop (run with --fix)`
          : "Frame component should use semantic props instead of style prop",
        code: elementText.trim(),
        fixable,
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
    checkFrameStyleUsage(element, issues, filePath);
  });

  // Find all JSX self-closing elements (e.g., <Frame ... />)
  const selfClosingElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement,
  );
  selfClosingElements.forEach((element) => {
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
