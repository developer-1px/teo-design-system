
import { Project, SyntaxKind } from "ts-morph";
import path from "path";

async function globalRadius2Fix() {
    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
    });

    const sourceFiles = project.getSourceFiles();
    let addCount = 0;

    console.log(`Checking ${sourceFiles.length} files for Radius2 usage without import...`);

    for (const sourceFile of sourceFiles) {
        const text = sourceFile.getFullText();

        // Check if Radius2 is used in the text
        if (text.includes("Radius2")) {
            const imports = sourceFile.getImportDeclarations();
            const hasRadius2Import = imports.some(imp =>
                imp.getNamedImports().some(ni => ni.getName() === "Radius2")
            );

            if (!hasRadius2Import) {
                // Find existing token.const.1tier import to prepend/append to
                const tier1Import = sourceFile.getImportDeclaration(imp =>
                    imp.getModuleSpecifierValue().includes("token.const.1tier")
                );

                if (tier1Import) {
                    // Determine relative path to radius2.ts from current file
                    // Simplified: if is under src/apps or elsewhere, we can use alias or relative
                    // But most files use @/ tokens.

                    sourceFile.addImportDeclaration({
                        moduleSpecifier: "@/design-system/token/radius2",
                        namedImports: ["Radius2"],
                    });

                    console.log(`Added Radius2 import to ${sourceFile.getFilePath()}`);
                    addCount++;
                    await sourceFile.save();
                } else {
                    // If no tier1 import, but Radius2 is used, it might be a component file
                    // Let's try to add it anyway if it looks like a design-system related file
                    sourceFile.addImportDeclaration({
                        moduleSpecifier: "@/design-system/token/radius2",
                        namedImports: ["Radius2"],
                    });
                    console.log(`Added Radius2 import (no tier1 base) to ${sourceFile.getFilePath()}`);
                    addCount++;
                    await sourceFile.save();
                }
            }
        }
    }

    console.log(`Fixed Radius2 usage in ${addCount} files.`);
}

globalRadius2Fix();
