/**
 * Import management utilities for ensuring token imports
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
    imp.getModuleSpecifierValue().includes("token.const.1tier")
  );

  if (!importDecl) {
    // No token import exists - need to add one
    // Calculate relative path from source file to token file
    const sourceFilePath = sourceFile.getFilePath();
    const depth = sourceFilePath.split("/src/")[1]?.split("/").length - 1 || 0;
    const relativePath = "../".repeat(depth) + "design-system/token/token.const.1tier";

    sourceFile.addImportDeclaration({
      namedImports: Array.from(requiredTokens),
      moduleSpecifier: relativePath,
    });
    return;
  }

  // Import exists - check what's already imported
  const existingImports = new Set(
    importDecl.getNamedImports().map((ni: any) => ni.getName())
  );

  // Add missing tokens
  const tokensToAdd = Array.from(requiredTokens).filter(
    token => !existingImports.has(token)
  );

  if (tokensToAdd.length > 0) {
    for (const token of tokensToAdd) {
      importDecl.addNamedImport(token);
    }
  }
}
