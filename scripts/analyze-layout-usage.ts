/**
 * Layout Usage Analyzer
 * Analyzes Frame components in the codebase to find common override patterns
 */

import path from "node:path";
import { Project } from "ts-morph";
import { extractFrameProps } from "./design-lint/lib/ast-parser";
import { TARGET_PATTERNS } from "./design-lint/lib/constants";
import { SyntaxKind } from "./design-lint/lib/types";

interface OverrideCombination {
  signature: string; // Normalized string representation
  props: Record<string, any>; // Original props
  count: number;
  files: string[]; // Files where this combination is used
}

/**
 * Normalize token value to simple string
 * e.g., "Space.n12" → "12", "var(--space-n12)" → "12", "Space.n8" → "8"
 */
function normalizeTokenValue(value: any): string {
  if (typeof value !== "string") return String(value);

  // Extract number from token reference
  // Space.n12 → 12
  const tokenMatch = value.match(/\.n(\d+)/);
  if (tokenMatch) return tokenMatch[1];

  // var(--space-n12) → 12
  const cssVarMatch = value.match(/var\(--\w+-n(\d+)\)/);
  if (cssVarMatch) return cssVarMatch[1];

  // Direct number in var
  const directMatch = value.match(/(\d+)/);
  if (directMatch) return directMatch[1];

  return value;
}

/**
 * Generate a normalized signature from override props
 * Follows order: Direction > Alignment > Gap > Padding > Sizing > Visual
 */
function generateSignature(override: Record<string, any>): string {
  const parts: string[] = [];

  // 1. Direction
  if (override.row) parts.push("Row");
  else if (override.grid) parts.push("Grid");
  else parts.push("Stack");

  // 2. Alignment
  if (override.pack) {
    const packValue =
      override.pack === true || override.pack === "center"
        ? "center"
        : override.pack;
    parts.push(packValue);
  }
  if (override.align && override.align !== "start") {
    // start is default for Stack
    parts.push(override.align);
  }

  // 3. Gap
  if (override.gap !== undefined) {
    const gapValue = normalizeTokenValue(override.gap);
    parts.push(`gap${gapValue}`);
  }

  // 4. Padding
  if (override.p !== undefined) {
    const pValue = normalizeTokenValue(override.p);
    parts.push(`p${pValue}`);
  }
  if (override.px !== undefined) {
    const pxValue = normalizeTokenValue(override.px);
    parts.push(`px${pxValue}`);
  }
  if (override.py !== undefined) {
    const pyValue = normalizeTokenValue(override.py);
    parts.push(`py${pyValue}`);
  }
  if (override.pt !== undefined) {
    const ptValue = normalizeTokenValue(override.pt);
    parts.push(`pt${ptValue}`);
  }
  if (override.pb !== undefined) {
    const pbValue = normalizeTokenValue(override.pb);
    parts.push(`pb${pbValue}`);
  }
  if (override.pl !== undefined) {
    const plValue = normalizeTokenValue(override.pl);
    parts.push(`pl${plValue}`);
  }
  if (override.pr !== undefined) {
    const prValue = normalizeTokenValue(override.pr);
    parts.push(`pr${prValue}`);
  }

  // 5. Sizing
  if (override.w !== undefined) {
    const wValue = normalizeTokenValue(override.w);
    parts.push(`w${wValue}`);
  }
  if (override.h !== undefined) {
    const hValue = normalizeTokenValue(override.h);
    parts.push(`h${hValue}`);
  }
  if (override.minWidth !== undefined) {
    const minWValue = normalizeTokenValue(override.minWidth);
    parts.push(`minW${minWValue}`);
  }
  if (override.minHeight !== undefined) {
    const minHValue = normalizeTokenValue(override.minHeight);
    parts.push(`minH${minHValue}`);
  }
  if (override.maxWidth !== undefined) {
    const maxWValue = normalizeTokenValue(override.maxWidth);
    parts.push(`maxW${maxWValue}`);
  }
  if (override.maxHeight !== undefined) {
    const maxHValue = normalizeTokenValue(override.maxHeight);
    parts.push(`maxH${maxHValue}`);
  }

  // 6. Visual
  if (override.rounded !== undefined) {
    const roundedValue =
      typeof override.rounded === "boolean"
        ? override.rounded
          ? "md"
          : "none"
        : normalizeTokenValue(override.rounded);
    parts.push(`r${roundedValue}`);
  }
  if (override.border === true) {
    parts.push("border");
  }
  if (override.shadow !== undefined) {
    parts.push(`shadow${normalizeTokenValue(override.shadow)}`);
  }

  return parts.join(".");
}

/**
 * Analyze all Frame components and collect override combinations
 */
function analyzeLayoutUsage() {
  console.log("🔍 Analyzing Frame override usage patterns...\n");

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
  });

  // Collect source files
  const sourceFiles: any[] = [];
  for (const pattern of TARGET_PATTERNS) {
    sourceFiles.push(...project.getSourceFiles(pattern));
  }

  const combinations = new Map<string, OverrideCombination>();

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(process.cwd(), filePath);

    // Find all JSX elements
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
    const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxSelfClosingElement,
    );

    const allElements = [
      ...jsxElements.map((el) => el.getOpeningElement()),
      ...jsxSelfClosingElements,
    ];

    for (const element of allElements) {
      const tagName = element.getTagNameNode().getText();
      if (tagName !== "Frame") continue;

      const props = extractFrameProps(element);

      // Only analyze Frames without layout but with override
      if (props.layout || !props.override || typeof props.override !== "object")
        continue;

      // Generate signature
      const signature = generateSignature(props.override);

      // Update combination count
      if (combinations.has(signature)) {
        const combo = combinations.get(signature)!;
        combo.count++;
        if (!combo.files.includes(relativePath)) {
          combo.files.push(relativePath);
        }
      } else {
        combinations.set(signature, {
          signature,
          props: props.override,
          count: 1,
          files: [relativePath],
        });
      }
    }
  }

  // Sort by count (descending)
  const sorted = Array.from(combinations.values()).sort(
    (a, b) => b.count - a.count,
  );

  // Print results
  console.log("📊 Layout Override Usage Patterns\n");
  console.log(`Total unique combinations: ${sorted.length}\n`);
  console.log("=".repeat(80));
  console.log("\n");

  sorted.forEach((combo, index) => {
    console.log(
      `${index + 1}. ${combo.signature} (${combo.count} occurrences)`,
    );
    console.log(
      `   Props: ${JSON.stringify(combo.props, null, 2).replace(/\n/g, "\n   ")}`,
    );
    console.log(
      `   Files: ${combo.files.slice(0, 3).join(", ")}${combo.files.length > 3 ? ` +${combo.files.length - 3} more` : ""}`,
    );
    console.log("");
  });

  console.log("=".repeat(80));
  console.log(
    `\n✨ Top ${Math.min(20, sorted.length)} combinations can be converted to Layout presets\n`,
  );

  // Suggest preset code
  console.log("💡 Suggested Layout Presets:\n");
  sorted.slice(0, 20).forEach((combo) => {
    const presetName = combo.signature;
    console.log(`  "${presetName}": ${JSON.stringify(combo.props)},`);
  });
}

analyzeLayoutUsage();
