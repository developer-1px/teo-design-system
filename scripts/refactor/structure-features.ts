import { Project, QuoteKind } from "ts-morph";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const PROJECT_ROOT = path.resolve(__dirname, "../../");
const TS_CONFIG_PATH = path.join(PROJECT_ROOT, "tsconfig.app.json");
const FEATURES_PATH = path.join(PROJECT_ROOT, "src/features");

// --- Main ---

async function main() {
    console.log("🚀 Starting Feature Restructuring...");

    const project = new Project({
        tsConfigFilePath: TS_CONFIG_PATH,
        manipulationSettings: {
            quoteKind: QuoteKind.Single,
        },
    });

    if (!fs.existsSync(FEATURES_PATH)) {
        console.log("No features directory found.");
        return;
    }

    const featureDirs = fs.readdirSync(FEATURES_PATH, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    console.log(`Found features: ${featureDirs.join(", ")}`);

    for (const featureName of featureDirs) {
        const featurePath = path.join(FEATURES_PATH, featureName);
        const componentsDir = path.join(featurePath, "components");

        // Check if components dir already exists to avoid double-nesting if run twice
        // But we will proceed to verify file locations.
        if (!fs.existsSync(componentsDir)) {
            console.log(`[${featureName}] Creating 'components' directory...`);
            fs.mkdirSync(componentsDir);
        }

        // Get all files in the feature root (not recursive, only immediate children)
        const sourceFiles = project.getSourceFiles([
            `${featurePath}/*.tsx`,
            `${featurePath}/*.ts`
        ]).filter(sf => {
            // Exclude index.ts if it acts as the barrel file for the feature
            // Exclude already created directories (though getSourceFiles uses glob)
            const dir = path.dirname(sf.getFilePath());
            return dir === featurePath && sf.getBaseName() !== "index.ts";
        });

        console.log(`[${featureName}] Processing ${sourceFiles.length} files...`);

        for (const sourceFile of sourceFiles) {
            const baseName = sourceFile.getBaseName();
            // Heuristic: If it ends in .tsx or .css.ts logic, move to components.
            // We will assume mostly everything in a Flat Feature is a component for now.
            // Files that look like hooks (use...) or types should technically go elsewhere,
            // but for this specific "Mail" feature audit, they were all UI components.

            let targetSubDir = "components";

            // Simple heuristic for other types (can be expanded)
            if (baseName.startsWith("use")) targetSubDir = "hooks";
            else if (baseName.includes("types") || baseName.includes("model")) targetSubDir = "model";

            const targetDirPath = path.join(featurePath, targetSubDir);
            if (!fs.existsSync(targetDirPath)) fs.mkdirSync(targetDirPath);

            const newPath = path.join(targetDirPath, baseName);
            console.log(`  - Moving ${baseName} to ${targetSubDir}/`);
            sourceFile.move(newPath);
        }
    }

    console.log("💾 Saving project changes...");
    await project.save();
    console.log("✅ Feature Restructuring Complete!");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
