/**
 * Design Lint - TypeScript-based design system auditing tool
 * Main entry point
 */

import path from "node:path";
import { Project } from "ts-morph";
import { analyzeFile } from "./design-lint/lib/analyzer";
import { TARGET_PATTERNS } from "./design-lint/lib/constants";
import type { Issue } from "./design-lint/lib/types";

const FIX_MODE = process.argv.includes("--fix");

function run() {
  console.log(
    `🔍 Starting TypeScript-based Design Lint${FIX_MODE ? " (Auto-fix mode)" : ""}...\\n`,
  );

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
  });

  // Collect source files from all patterns
  const sourceFiles: any[] = [];
  for (const pattern of TARGET_PATTERNS) {
    sourceFiles.push(...project.getSourceFiles(pattern));
  }

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
        const prefix =
          issue.fixable && FIX_MODE ? "✓" : issue.fixable ? "🔧" : "  ";
        console.log(
          `   ${prefix} L${issue.line} [${issue.rule}]: ${issue.message}`,
        );
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
    console.log(`✅ Auto-fixed ${fixedCount} issue(s).\\n`);
  }

  const remainingIssues = allIssues.filter(
    (issue) => !issue.fixable || !FIX_MODE,
  ).length;
  const fixableIssues = allIssues.filter(
    (issue) => issue.fixable && !FIX_MODE,
  ).length;

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
