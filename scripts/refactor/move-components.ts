import { Project, QuoteKind } from "ts-morph";
import path from "path";
import fs from "fs";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const PROJECT_ROOT = path.resolve(__dirname, "../../");
const TS_CONFIG_PATH = path.join(PROJECT_ROOT, "tsconfig.app.json"); // Use app config for src
const SRC_PATH = path.join(PROJECT_ROOT, "src");
const COMPONENTS_UI_PATH = path.join(SRC_PATH, "components/ui");

// Target directories
const PRIMITIVES_DIR = "src/components/primitives";
const COMPOSITES_DIR = "src/components/composites";
const LAYOUT_DIR = "src/components/layout";

// Classification Map
const PRIMITIVES = new Set([
    "Button", "Badge", "StatusBadge", "Avatar", "Checkbox", "Radio", "Switch",
    "TextInput", "TextArea", "Progress", "Spinner", "Icon", "Label"
]);

const COMPOSITES = new Set([
    "SearchFilterBar", "SearchBar", "Alert", "EmptyState", "Combobox", "Select",
    "Table", "Tabs", "Toolbar", "Tree", "Resizable", "ResizablePanel", "Accordion"
]);

const LAYOUT = new Set([
    // If we decide to move layout generic components here
]);

// --- Main ---

async function main() {
    console.log("🚀 Starting Component Refactoring...");

    const project = new Project({
        tsConfigFilePath: TS_CONFIG_PATH,
        manipulationSettings: {
            quoteKind: QuoteKind.Single,
        },
    });

    // Ensure target directories exist
    [PRIMITIVES_DIR, COMPOSITES_DIR, LAYOUT_DIR].forEach(dir => {
        const fullPath = path.join(PROJECT_ROOT, dir);
        if (!fs.existsSync(fullPath)) {
            console.log(`Creating directory: ${dir}`);
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });

    const sourceFiles = project.getSourceFiles([
        `${COMPONENTS_UI_PATH}/**/*.tsx`,
        `${COMPONENTS_UI_PATH}/**/*.ts`
    ]);

    console.log(`Found ${sourceFiles.length} files in components/ui to process.`);

    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();
        const baseName = sourceFile.getBaseName();
        const nameWithoutExt = baseName.replace(/\.(tsx|ts|css\.ts)$/, "").replace(".css", "");

        // Check if it's a styles file or main component file
        // Strategy: We classify based on the "Component Name".
        // If file is `Button.css.ts`, we check "Button".

        let classification = "unknown";

        // Simple heuristic: check if filename starts with any known key
        // This handles Component.tsx and Component.css.ts
        const matchedPrimitive = Array.from(PRIMITIVES).find(k => nameWithoutExt === k || nameWithoutExt.startsWith(k + "."));
        const matchedComposite = Array.from(COMPOSITES).find(k => nameWithoutExt === k || nameWithoutExt.startsWith(k + "."));

        // Override logic for known prefixes if needed, but strict matching is safer.
        // Let's refine: strict match for component name, or component name + suffix
        const isPrimitive = matchedPrimitive;
        const isComposite = matchedComposite;

        let targetDir = "";

        if (isPrimitive) {
            targetDir = PRIMITIVES_DIR;
        } else if (isComposite) {
            targetDir = COMPOSITES_DIR;
        } else {
            console.log(`⚠️  Skipping unclassified: ${baseName}`);
            continue;
        }

        const relativePath = path.relative(PROJECT_ROOT, filePath);
        const newPath = path.join(PROJECT_ROOT, targetDir, path.basename(filePath));

        console.log(`🚚 Moving: ${baseName} -> ${targetDir}`);

        // Move the file
        sourceFile.move(newPath);
    }

    console.log("💾 Saving project changes (updating imports)...");
    await project.save();
    console.log("✅ Component Refactoring Complete!");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
