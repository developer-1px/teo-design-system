
import { Project, StructureKind } from "ts-morph";
import path from "path";

async function fixRadius2Imports() {
    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
    });

    const sourceFiles = project.getSourceFiles();
    let count = 0;

    console.log(`Checking ${sourceFiles.length} files for Radius2 imports...`);

    for (const sourceFile of sourceFiles) {
        const imports = sourceFile.getImportDeclarations();
        let modified = false;

        for (const importDecl of imports) {
            const moduleSpecifier = importDecl.getModuleSpecifierValue();

            // Look for imports from token.const.2tier
            if (moduleSpecifier.includes("token.const.2tier")) {
                const namedImports = importDecl.getNamedImports();
                const radius2Import = namedImports.find(ni => ni.getName() === "Radius2");

                if (radius2Import) {
                    // Found Radius2 import

                    // 1. Remove Radius2 from the existing import
                    radius2Import.remove();

                    // If existing import is now empty, remove it entirely
                    if (importDecl.getNamedImports().length === 0) {
                        importDecl.remove();
                    }

                    // 2. Add new import for Radius2
                    // Determine the new module specifier
                    let newModuleSpecifier = moduleSpecifier.replace("token.const.2tier", "radius2");

                    // If the original was importing via index/barrel that re-exported 2tier? 
                    // No, usually direct imports or via alias.

                    // Check if we already have an import from radius2 (unlikely but possible)
                    const existingRadiusImport = sourceFile.getImportDeclaration(decl =>
                        decl.getModuleSpecifierValue() === newModuleSpecifier
                    );

                    if (existingRadiusImport) {
                        existingRadiusImport.addNamedImport("Radius2");
                    } else {
                        sourceFile.addImportDeclaration({
                            moduleSpecifier: newModuleSpecifier,
                            namedImports: ["Radius2"],
                        });
                    }

                    modified = true;
                    count++;
                }
            }
        }

        if (modified) {
            await sourceFile.save();
        }
    }

    console.log(`Fixed Radius2 imports in ${count} files.`);
}

fixRadius2Imports();
