import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "../../");
const SRC_PATH = path.join(PROJECT_ROOT, "src");

const CORE_DIRS = ["hooks", "utils", "types"];

console.log("🚀 Initializing Core Logic Layers...");

CORE_DIRS.forEach(dir => {
    const fullPath = path.join(SRC_PATH, dir);
    if (!fs.existsSync(fullPath)) {
        console.log(`Creating directory: src/${dir}`);
        fs.mkdirSync(fullPath);
        // Add a .gitkeep so git tracks it
        fs.writeFileSync(path.join(fullPath, ".gitkeep"), "");
    } else {
        console.log(`Directory already exists: src/${dir}`);
    }
});

console.log("✅ Core Logic Layers Initialized!");
