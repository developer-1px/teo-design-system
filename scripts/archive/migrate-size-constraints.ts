/**
 * Migration Script: Frame size constraints to override
 *
 * Converts:
 * - minWidth={...} → override={{ minWidth: ... }}
 * - minHeight={...} → override={{ minHeight: ... }}
 * - maxWidth={...} → override={{ maxWidth: ... }}
 * - maxHeight={...} → override={{ maxHeight: ... }}
 *
 * Merges with existing override if present.
 */

import path from "node:path";
import { type JsxAttribute, Project, SyntaxKind } from "ts-morph";

const FIX_MODE = process.argv.includes("--fix");
const DEBUG = process.env.DEBUG_MIGRATE === "1";

const SIZE_CONSTRAINT_PROPS = [
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
];

interface MigrationIssue {
  file: string;
  line: number;
  type: "size-constraints-to-override";
  before: string;
  after: string;
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
  const sizeConstraintAttrs: JsxAttribute[] = [];
  let overrideAttr: JsxAttribute | null = null;

  // Collect size constraint attributes
  for (const attr of attributes) {
    if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;

    const nameNode = (attr as JsxAttribute).getNameNode();
    const name = nameNode.getText();

    if (SIZE_CONSTRAINT_PROPS.includes(name)) {
      sizeConstraintAttrs.push(attr as JsxAttribute);
    } else if (name === "override") {
      overrideAttr = attr as JsxAttribute;
    }
  }

  // Skip if no size constraints found
  if (sizeConstraintAttrs.length === 0) {
    return issues;
  }

  const filePath = element.getSourceFile().getFilePath();
  const line = element.getStartLineNumber();

  // Build prop strings
  const propNames = sizeConstraintAttrs
    .map((a) => a.getNameNode().getText())
    .join(", ");
  const before = `${propNames}={...}`;
  const after = `override={{ ${propNames}: ... }}`;

  issues.push({
    file: filePath,
    line,
    type: "size-constraints-to-override",
    before,
    after,
  });

  if (FIX_MODE) {
    // Collect size constraint props BEFORE removing
    const overrideProps: string[] = [];

    for (const attr of sizeConstraintAttrs) {
      const nameNode = attr.getNameNode();
      const name = nameNode.getText();
      const value = attr.getInitializer()?.getText().replace(/[{}]/g, "");
      overrideProps.push(`${name}: ${value}`);
    }

    // Merge with existing override or create new one
    if (overrideAttr) {
      // Get existing override initializer
      const initializer = overrideAttr.getInitializer();
      if (initializer && initializer.getKind() === SyntaxKind.JsxExpression) {
        const expr = initializer.asKindOrThrow(SyntaxKind.JsxExpression);
        const objectLiteral = expr.getExpression();

        if (objectLiteral) {
          const currentOverride = objectLiteral.getText();

          // Simple merge: remove outer braces, trailing commas, and combine
          const cleanedCurrent = currentOverride
            .replace(/^\{|\}$/g, "") // Remove outer braces
            .trim()
            .replace(/,\s*$/, ""); // Remove trailing comma
          const newProps = overrideProps.join(", ");
          const merged = cleanedCurrent
            ? `{{ ${cleanedCurrent}, ${newProps} }}`
            : `{{ ${newProps} }}`;

          initializer.replaceWithText(merged);
        }
      }
    } else {
      // Create new override attribute
      const attributes = element.getAttributes();
      element.insertAttribute(attributes.length, {
        name: "override",
        initializer: `{{ ${overrideProps.join(", ")} }}`,
      });
    }

    // Remove size constraint attributes AFTER creating/updating override
    for (const attr of sizeConstraintAttrs) {
      attr.remove();
    }
  }

  return issues;
}

async function run() {
  console.log(
    `🚀 Starting size constraints migration${FIX_MODE ? " (Auto-fix mode)" : " (Dry-run mode)"}...\n`,
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
      const typeLabel = "size→override";

      console.log(`   ${icon} L${issue.line} [${typeLabel}]`);
      console.log(`      Before: ${issue.before}`);
      console.log(`      After:  ${issue.after}`);
    }
    console.log("");
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total changes: ${allIssues.length}`);

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
