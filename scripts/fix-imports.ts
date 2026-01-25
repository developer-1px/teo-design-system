
import { Project, QuoteKind } from "ts-morph";
import path from "path";

async function fixImports() {
    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), "tsconfig.app.json"),
    });

    const sourceFiles = project.getSourceFiles();
    let count = 0;

    console.log(`Checking ${sourceFiles.length} files for broken design-system imports...`);

    for (const sourceFile of sourceFiles) {
        const imports = sourceFile.getImportDeclarations();
        let modified = false;

        for (const importDecl of imports) {
            const moduleSpecifier = importDecl.getModuleSpecifierValue();

            // Check for relative paths pointing to design-system
            if (moduleSpecifier.includes("design-system")) {
                // match ../../design-system or ../design-system
                if (moduleSpecifier.match(/(\.\.\/)+design-system/)) {
                    const newSpecifier = moduleSpecifier.replace(/(\.\.\/)+design-system/, "@/design-system");
                    importDecl.setModuleSpecifier(newSpecifier);
                    modified = true;
                    count++;
                }
            }
        }

        if (modified) {
            await sourceFile.save();
        }
    }

    console.log(`Fixed ${count} imports.`);
}

fixImports();
