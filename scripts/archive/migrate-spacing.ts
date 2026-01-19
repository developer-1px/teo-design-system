/**
 * Migration Script: Frame spacing unification
 *
 * Converts:
 * - gap={Space.nX} → spacing={Space.nX}
 * - p={Space.nX} → spacing={closest Space token after dividing by 1.25}
 * - px/py/pt/pb/pl/pr → moved to override
 *
 * Keeps override props unchanged.
 */

import path from "node:path";
import { type JsxAttribute, Project, SyntaxKind } from "ts-morph";

const FIX_MODE = process.argv.includes("--fix");
const DEBUG = process.env.DEBUG_MIGRATE === "1";

// SpaceScale from token.const.1tier.ts
const SPACE_SCALE = [
  0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44,
  48, 56, 64, 72, 80, 88, 96, 112, 128, 144, 160,
] as const;

/**
 * Build p → spacing conversion table
 * Formula: spacing = round(p / 1.25)
 */
function buildPaddingToSpacingMap(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const pValue of SPACE_SCALE) {
    const spacingValue = pValue / 1.25;

    // Find closest value in SPACE_SCALE
    let closest = SPACE_SCALE[0];
    let minDiff = Math.abs(spacingValue - closest);

    for (const candidate of SPACE_SCALE) {
      const diff = Math.abs(spacingValue - candidate);
      if (diff < minDiff) {
        minDiff = diff;
        closest = candidate;
      }
    }

    map[`n${pValue}`] = `n${closest}`;
  }

  return map;
}

const P_TO_SPACING = buildPaddingToSpacingMap();

if (DEBUG) {
  console.log("📊 P_TO_SPACING mapping:");
  console.log(JSON.stringify(P_TO_SPACING, null, 2));
}

interface MigrationIssue {
  file: string;
  line: number;
  type:
    | "gap-to-spacing"
    | "p-to-spacing"
    | "complex-padding"
    | "gap-p-conflict";
  before: string;
  after: string;
}

/**
 * Extract token name from Space.nX
 */
function extractSpaceToken(text: string): string | null {
  const match = text.match(/Space\.(n\d+)/);
  return match ? match[1] : null;
}

/**
 * Analyze and migrate Frame/Section component props
 */
function analyzeJsxElement(element: any): MigrationIssue[] {
  const issues: MigrationIssue[] = [];
  const tagName = element.getTagNameNode().getText();

  if (tagName !== "Frame" && tagName !== "Section") {
    return issues;
  }

  const attributes = element.getAttributes();
  let gapAttr: JsxAttribute | null = null;
  let pAttr: JsxAttribute | null = null;
  const paddingDirections: JsxAttribute[] = [];
  let overrideAttr: JsxAttribute | null = null;

  // Collect relevant attributes
  for (const attr of attributes) {
    if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;

    const nameNode = (attr as JsxAttribute).getNameNode();
    const name = nameNode.getText();

    if (name === "gap") gapAttr = attr as JsxAttribute;
    else if (name === "p") pAttr = attr as JsxAttribute;
    else if (["px", "py", "pt", "pb", "pl", "pr"].includes(name)) {
      paddingDirections.push(attr as JsxAttribute);
    } else if (name === "override") overrideAttr = attr as JsxAttribute;
  }

  // Skip if already has spacing
  if (
    attributes.some((a: any) => {
      if (a.getKind() !== SyntaxKind.JsxAttribute) return false;
      const nameNode = (a as JsxAttribute).getNameNode();
      return nameNode.getText() === "spacing";
    })
  ) {
    return issues;
  }

  // Skip if inside override (we don't touch override contents)
  // This check is simplified - in real implementation, we'd check the AST parent

  const filePath = element.getSourceFile().getFilePath();
  const line = element.getStartLineNumber();

  // Case 1: Only gap
  if (gapAttr && !pAttr && paddingDirections.length === 0) {
    const gapValue = gapAttr.getInitializer()?.getText().replace(/[{}]/g, "");
    const token = extractSpaceToken(gapValue || "");

    if (token) {
      const before = `gap={Space.${token}}`;
      const after = `spacing={Space.${token}}`;

      issues.push({
        file: filePath,
        line,
        type: "gap-to-spacing",
        before,
        after,
      });

      if (FIX_MODE) {
        const nameNode = gapAttr.getNameNode();
        nameNode.replaceWithText("spacing");
      }
    }
  }

  // Case 2: Only p (no gap, no directional padding)
  else if (!gapAttr && pAttr && paddingDirections.length === 0) {
    const pValue = pAttr.getInitializer()?.getText().replace(/[{}]/g, "");
    const token = extractSpaceToken(pValue || "");

    if (token && P_TO_SPACING[token]) {
      const spacingToken = P_TO_SPACING[token];
      const before = `p={Space.${token}}`;
      const after = `spacing={Space.${spacingToken}}`;

      issues.push({
        file: filePath,
        line,
        type: "p-to-spacing",
        before,
        after,
      });

      if (FIX_MODE) {
        const nameNode = pAttr.getNameNode();
        nameNode.replaceWithText("spacing");

        const initializer = pAttr.getInitializer();
        if (initializer) {
          initializer.replaceWithText(`{Space.${spacingToken}}`);
        }
      }
    }
  }

  // Case 3: gap + p → spacing + override
  else if (gapAttr && pAttr) {
    const gapValue = gapAttr.getInitializer()?.getText().replace(/[{}]/g, "");
    const gapToken = extractSpaceToken(gapValue || "");

    if (gapToken) {
      const before = `gap={Space.${gapToken}} p={...}`;
      const after = `spacing={Space.${gapToken}} override={{ p: ... }}`;

      issues.push({
        file: filePath,
        line,
        type: "gap-p-conflict",
        before,
        after,
      });

      if (FIX_MODE) {
        const nameNode = gapAttr.getNameNode();
        nameNode.replaceWithText("spacing");

        // Add p to override
        const pValue = pAttr.getInitializer()?.getText().replace(/[{}]/g, "");
        if (overrideAttr) {
          // Merge with existing override (complex - skip for now, manual fix)
          console.log(
            `⚠️  Manual fix needed at ${filePath}:${line} - complex override merge`,
          );
        } else {
          const attributes = element.getAttributes();

          // Insert after last attribute
          element.insertAttribute(attributes.length, {
            name: "override",
            initializer: `{{ p: ${pValue} }}`,
          });
        }

        pAttr.remove();
      }
    }
  }

  // Case 4: Directional padding (px, py, etc.) → move to override
  else if (paddingDirections.length > 0) {
    const paddingProps = paddingDirections
      .map((a) => a.getNameNode().getText())
      .join(", ");
    const before = `${paddingProps}={...}`;
    const after = `override={{ ${paddingProps}: ... }}`;

    issues.push({
      file: filePath,
      line,
      type: "complex-padding",
      before,
      after,
    });

    if (FIX_MODE) {
      // Build override object
      const overrideProps: string[] = [];

      for (const attr of paddingDirections) {
        const nameNode = attr.getNameNode();
        const name = nameNode.getText();
        const value = attr.getInitializer()?.getText().replace(/[{}]/g, "");
        overrideProps.push(`${name}: ${value}`);
        attr.remove();
      }

      if (pAttr) {
        const value = pAttr.getInitializer()?.getText().replace(/[{}]/g, "");
        overrideProps.push(`p: ${value}`);
        pAttr.remove();
      }

      if (gapAttr) {
        // Keep gap as spacing
        const nameNode = gapAttr.getNameNode();
        nameNode.replaceWithText("spacing");
      }

      if (overrideAttr) {
        console.log(
          `⚠️  Manual fix needed at ${filePath}:${line} - complex override merge`,
        );
      } else {
        const attributes = element.getAttributes();
        element.insertAttribute(attributes.length, {
          name: "override",
          initializer: `{{ ${overrideProps.join(", ")} }}`,
        });
      }
    }
  }

  return issues;
}

async function run() {
  console.log(
    `🚀 Starting Frame spacing migration${FIX_MODE ? " (Auto-fix mode)" : " (Dry-run mode)"}...\n`,
  );

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
  });

  const sourceFiles = project.getSourceFiles(["src/**/*.tsx", "src/**/*.ts"]);

  const allIssues: MigrationIssue[] = [];

  for (const sourceFile of sourceFiles) {
    const jsxElements = sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxOpeningElement,
    );
    const selfClosingElements = sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxSelfClosingElement,
    );

    for (const element of [...jsxElements, ...selfClosingElements]) {
      const issues = analyzeJsxElement(element);
      allIssues.push(...issues);
    }

    if (FIX_MODE) {
      sourceFile.saveSync();
    }
  }

  // Group issues by file
  const issuesByFile = new Map<string, MigrationIssue[]>();
  for (const issue of allIssues) {
    const existing = issuesByFile.get(issue.file) || [];
    existing.push(issue);
    issuesByFile.set(issue.file, existing);
  }

  // Print results
  for (const [file, issues] of issuesByFile) {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`📄 ${relativePath}`);

    for (const issue of issues) {
      const icon = FIX_MODE ? "✅" : "🔍";
      const typeLabel = {
        "gap-to-spacing": "gap→spacing",
        "p-to-spacing": "p→spacing",
        "complex-padding": "padding→override",
        "gap-p-conflict": "gap+p→spacing+override",
      }[issue.type];

      console.log(`   ${icon} L${issue.line} [${typeLabel}]`);
      console.log(`      Before: ${issue.before}`);
      console.log(`      After:  ${issue.after}`);
    }
    console.log("");
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total changes: ${allIssues.length}`);

  const typeCount = {
    "gap-to-spacing": 0,
    "p-to-spacing": 0,
    "complex-padding": 0,
    "gap-p-conflict": 0,
  };

  for (const issue of allIssues) {
    typeCount[issue.type]++;
  }

  console.log(`   - gap→spacing: ${typeCount["gap-to-spacing"]}`);
  console.log(`   - p→spacing: ${typeCount["p-to-spacing"]}`);
  console.log(`   - padding→override: ${typeCount["complex-padding"]}`);
  console.log(`   - gap+p conflict: ${typeCount["gap-p-conflict"]}`);

  if (!FIX_MODE && allIssues.length > 0) {
    console.log(`\n💡 Run with --fix to apply changes automatically`);
  }

  if (FIX_MODE) {
    console.log(`\n✅ Migration complete! Please run:`);
    console.log(`   npm run typecheck`);
    console.log(`   npm run build`);
  }
}

run();
