import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { LAYOUT_CONFIG } from "../layout.config.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// HELPER TYPES & MAPPINGS
// -----------------------------------------------------------------------------

// Main Axis: CSS Terms (Start, Center, End, Between) -> pack
// Cross Axis: Physical Terms
//   Row: Top, Middle, Bottom, Stretch -> align
//   Col: Left, Center, Right, Stretch -> align

function resolveToken(token: string, flow: string, index: number): any {
  // Index 0 is Flow (already handled)

  // 1. Cross Axis (Index 1)
  if (index === 1) {
    if (flow === "Row") {
      switch (token) {
        case "Top":
          return { align: "start" };
        case "Middle":
          return { align: "center" };
        case "Bottom":
          return { align: "end" };
        case "Stretch":
          return { align: "stretch" };
      }
    }
    if (flow === "Col") {
      switch (token) {
        case "Left":
          return { align: "start" };
        case "Center":
          return { align: "center" };
        case "Right":
          return { align: "end" };
        case "Stretch":
          return { align: "stretch" };
      }
    }
  }

  // 2. Main Axis (Index 2)
  if (index === 2) {
    switch (token) {
      case "Start":
        return { pack: "start" };
      case "Center":
        return { pack: "center" };
      case "End":
        return { pack: "end" };
      case "Between":
        return { pack: "space" };
    }
  }

  return {};
}

// -----------------------------------------------------------------------------
// STRUCTURAL GENERATOR
// -----------------------------------------------------------------------------

interface LayoutNode {
  path: string; // "Row_Center_Gap12"
  props: any;
  children: Record<string, LayoutNode>;
}

const ROOT: LayoutNode = {
  path: "root",
  props: {},
  children: {},
};

for (const entry of LAYOUT_CONFIG) {
  const fullPath = entry;
  const flow = fullPath[0]; // "Row" or "Col"

  let currentNode = ROOT;
  let accumulatedProps: any = {
    ...(flow === "Row" ? { row: true } : {}), // Inline FLOW_MAP logic
  };

  for (let i = 0; i < fullPath.length; i++) {
    const token = fullPath[i];

    // Calculate path ID for variable name
    const isRoot = currentNode === ROOT;
    const nextPath = isRoot ? token : `${currentNode.path}_${token}`;

    // Create node if missing
    if (!currentNode.children[token]) {
      currentNode.children[token] = {
        path: nextPath,
        props: {},
        children: {},
      };
    }
    currentNode = currentNode.children[token];

    // Accumulate props
    accumulatedProps = { ...accumulatedProps, ...resolveToken(token, flow, i) };

    // Assign cumulative props
    currentNode.props = { ...accumulatedProps };
  }
}

// -----------------------------------------------------------------------------
// VARIABLE DEFINITIONS BUILDER
// -----------------------------------------------------------------------------

const variableDefinitions: string[] = [];

function traverseAndGenerateVars(
  node: LayoutNode,
  parentProps: any,
  parentVar: string | null,
) {
  if (node !== ROOT) {
    const varName = `_${node.path.replace(/[.]/g, "_")}`;

    // Calculate Diff
    const diff: any = {};
    const nodeKeys = Object.keys(node.props);

    // If no parent, all props are diff
    if (!parentVar) {
      Object.assign(diff, node.props);
    } else {
      // Compare with parent
      // If value is same, skip. If different or new, add.
      for (const key of nodeKeys) {
        if (
          JSON.stringify(node.props[key]) !== JSON.stringify(parentProps[key])
        ) {
          diff[key] = node.props[key];
        }
      }
    }

    // Stringify diff
    const diffParts = [];
    for (const [k, v] of Object.entries(diff)) {
      if (k === "style") {
        diffParts.push(`${k}: ${v}`);
      } else if (
        typeof v === "string" &&
        (v.startsWith("Space.") || v.startsWith("Size.") || v.startsWith('"'))
      ) {
        diffParts.push(`${k}: ${v}`);
      } else if (typeof v === "string") {
        diffParts.push(`${k}: "${v}"`);
      } else {
        diffParts.push(`${k}: ${v}`);
      }
    }

    const diffString = diffParts.join(", ");

    let defLine = "";
    if (!parentVar) {
      defLine = `const ${varName} = { ${diffString} };`;
    } else {
      if (diffString) {
        defLine = `const ${varName} = { ...${parentVar}, ${diffString} };`;
      } else {
        defLine = `const ${varName} = ${parentVar};`;
      }
    }
    variableDefinitions.push(defLine);

    // Recurse
    for (const child of Object.values(node.children)) {
      traverseAndGenerateVars(child, node.props, varName);
    }
  } else {
    // Root: just recurse
    for (const child of Object.values(node.children)) {
      traverseAndGenerateVars(child, {}, null);
    }
  }
}

// Run the generation
traverseAndGenerateVars(ROOT, {}, null);

// Recursively print the tree referencing variables
function printTree(node: LayoutNode, indent: number = 2): string {
  const spaces = " ".repeat(indent);
  const lines = [];

  for (const [key, childNode] of Object.entries(node.children)) {
    const varName = `_${childNode.path.replace(/[.]/g, "_")}`;

    // 2. Prepare Children String
    const childrenBlock = printTree(childNode, indent + 2);

    if (childrenBlock.trim() === "") {
      // Leaf (or just props)
      lines.push(`${spaces}${key}: defineLayout(${varName}),`);
    } else {
      // Has children
      lines.push(`${spaces}${key}: defineLayout(${varName}, {`);
      lines.push(childrenBlock);
      lines.push(`${spaces}}),`);
    }
  }
  return lines.join("\n");
}

const OUTPUT = `/**
 * ✨ AUTOMATICALLY GENERATED - DO NOT EDIT ✨
 * 
 * Generated by scripts/generate-layout.ts
 * Source: layout.config.ts
 */

import type React from "react";
import type { FrameOverrides } from "../FrameProps.ts";

/**
 * 🔒 Layout Type Guardrails
 */
declare const LayoutTokenBrand: unique symbol;

export type LayoutToken = FrameOverrides & { 
  readonly [LayoutTokenBrand]: true;
  style?: React.CSSProperties;
};

/**
 * Variable Definitions (Hoisted)
 * Flattened chain of property objects to reduce duplication.
 */
${variableDefinitions.join("\n")}

/**
 * Internal Factory ensures safe casting.
 */
function defineLayout<P, C>(props: P, children: C = {} as C): P & C & LayoutToken {
  return { ...props, ...children } as P & C & LayoutToken;
}

export const Layout = {
${printTree(ROOT)}
} as const;
`;

const TARGET_PATH = path.resolve(
  __dirname,
  "../src/design-system/Frame/Layout/Layout.ts",
);
fs.writeFileSync(TARGET_PATH, OUTPUT);

console.log(`✅ Generated Layout.ts at ${TARGET_PATH}`);
