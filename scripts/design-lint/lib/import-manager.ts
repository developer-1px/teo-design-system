/**
 * Import management utilities for ensuring token and layout imports
 */

import type { SourceFile } from "./types";

/**
 * Ensure required token imports exist in the source file
 * Adds missing imports to token.const.1tier.ts
 *
 * @param sourceFile - Source file to add imports to
 * @param requiredTokens - Set of required token names (e.g., ["Space", "Size", "ZIndex"])
 */
export function ensureTokenImports(
  sourceFile: SourceFile,
  requiredTokens: Set<string>,
): void {
  // Find the token import statement
  const importDecl = sourceFile.getImportDeclaration((imp: any) =>
    imp.getModuleSpecifierValue().includes("token.const.1tier"),
  );

  if (!importDecl) {
    // No token import exists - need to add one
    // Calculate relative path from source file to token file
    const sourceFilePath = sourceFile.getFilePath();
    const depth = sourceFilePath.split("/src/")[1]?.split("/").length - 1 || 0;
    const relativePath = `${"../".repeat(depth)}design-system/token/token.const.1tier`;

    sourceFile.addImportDeclaration({
      namedImports: Array.from(requiredTokens),
      moduleSpecifier: relativePath,
    });
    return;
  }

  // Import exists - check what's already imported
  const existingImports = new Set(
    importDecl.getNamedImports().map((ni: any) => ni.getName()),
  );

  // Add missing tokens
  const tokensToAdd = Array.from(requiredTokens).filter(
    (token) => !existingImports.has(token),
  );

  if (tokensToAdd.length > 0) {
    for (const token of tokensToAdd) {
      importDecl.addNamedImport(token);
    }
  }
}

/**
 * Ensure Layout import exists in the source file
 * Adds Layout import from Frame/Layout/Layout.ts if missing
 *
 * @param sourceFile - Source file to add import to
 */
export function ensureLayoutImport(sourceFile: SourceFile): void {
  // First, check if Layout is already imported from ANY source
  const allImports = sourceFile.getImportDeclarations();
  for (const imp of allImports) {
    const hasLayout = imp
      .getNamedImports()
      .some((ni: any) => ni.getName() === "Layout");
    if (hasLayout) {
      // Layout is already imported, don't add duplicate
      return;
    }
  }

  // Check if there's an existing Frame/Layout import declaration (without Layout imported)
  const layoutImport = sourceFile.getImportDeclaration((imp: any) => {
    const specifier = imp.getModuleSpecifierValue();
    return (
      specifier.includes("Frame/Layout/Layout") ||
      specifier.endsWith("Frame/Layout/Layout.ts")
    );
  });

  if (layoutImport) {
    // Add Layout to existing Frame/Layout import
    layoutImport.addNamedImport("Layout");
    return;
  }

  // Check if there's an existing Frame import to use as reference for path
  const frameImport = sourceFile.getImportDeclaration((imp: any) => {
    const specifier = imp.getModuleSpecifierValue();
    return specifier.includes("Frame/Frame");
  });

  let relativePath: string;

  if (frameImport) {
    // Use Frame import path as reference
    // e.g., "../../design-system/Frame/Frame.tsx" → "../../design-system/Frame/Layout/Layout.ts"
    const frameSpecifier = frameImport.getModuleSpecifierValue();

    if (frameSpecifier.endsWith("/Frame.tsx")) {
      relativePath = frameSpecifier.replace("/Frame.tsx", "/Layout/Layout.ts");
    } else if (frameSpecifier.endsWith("/Frame")) {
      relativePath = frameSpecifier.replace(/\/Frame$/, "/Layout/Layout.ts");
    } else {
      // Fallback: calculate from source file
      const sourceFilePath = sourceFile.getFilePath();
      const depth =
        sourceFilePath.split("/src/")[1]?.split("/").length - 1 || 0;
      relativePath = `${"../".repeat(depth)}design-system/Frame/Layout/Layout.ts`;
    }
  } else {
    // Calculate relative path from source file to Layout file
    const sourceFilePath = sourceFile.getFilePath();
    const depth = sourceFilePath.split("/src/")[1]?.split("/").length - 1 || 0;
    relativePath = `${"../".repeat(depth)}design-system/Frame/Layout/Layout.ts`;
  }

  // Add new import declaration
  sourceFile.addImportDeclaration({
    namedImports: ["Layout"],
    moduleSpecifier: relativePath,
  });
}
