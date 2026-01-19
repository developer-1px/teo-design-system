#!/usr/bin/env tsx
/**
 * Hooks Folder Structure Refactoring Script
 *
 * This script uses ts-morph to safely refactor the hooks directory
 * by moving files to categorized folders and updating all import paths.
 *
 * Usage:
 *   npx tsx scripts/migrate-hooks.ts --dry-run  # Preview changes
 *   npx tsx scripts/migrate-hooks.ts            # Apply changes
 */

import { Project } from "ts-morph";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

// Helper functions for colored output
const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  dim: (msg: string) => console.log(`${colors.dim}${msg}${colors.reset}`),
};

// Category mapping: where each file should be moved
const categoryMap: Record<string, string[]> = {
  components: [
    "useAccordion.ts",
    "useDropdown.ts",
    "useModal.ts",
    "useTabs.ts",
    "useTooltip.ts",
  ],
  data: [
    "useHeadlessTable.ts",
    "useGridSelection.ts",
    "useVirtualScroll.ts",
  ],
  interaction: [
    "useHotKeys.ts",
    "useKeyboardCommand.ts",
    "useCommandSystem.ts",
    "useNavigation.ts",
  ],
  state: [
    "useHistory.ts",
    "useSelection.ts",
  ],
  search: [
    "useClipboard.ts",
    "useFuzzySearch.ts",
  ],
  primitives: [
    "useClickOutside.ts",
    "useControlledState.ts",
    "useFocusTrap.ts",
    "useId.ts",
    "useScrollLock.ts",
  ],
  lib: [
    "CommandManager.ts",
    "keyUtils.ts",
  ],
};

interface MigrationStats {
  filesFound: number;
  filesMoved: number;
  filesNotFound: number;
  importsUpdated: number;
  categoriesCreated: number;
}

class HooksMigrator {
  private project: Project;
  private hooksDir: string;
  private stats: MigrationStats;
  private dryRun: boolean;

  constructor(dryRun = false) {
    this.dryRun = dryRun;
    this.hooksDir = "./src/design-system/hooks";
    this.stats = {
      filesFound: 0,
      filesMoved: 0,
      filesNotFound: 0,
      importsUpdated: 0,
      categoriesCreated: 0,
    };

    // Initialize ts-morph project
    this.project = new Project({
      tsConfigFilePath: "./tsconfig.app.json",
    });

    log.section(`🚀 Hooks Migration Script`);
    log.dim(`Mode: ${dryRun ? "DRY RUN (no changes will be made)" : "LIVE MODE"}`);
    log.dim(`Working directory: ${process.cwd()}`);
    console.log();
  }

  /**
   * Step 1: Create category directories
   */
  private createDirectories(): void {
    log.section("📁 Step 1: Creating category directories");

    Object.keys(categoryMap).forEach((category) => {
      const categoryPath = path.join(this.hooksDir, category);
      const absolutePath = path.resolve(categoryPath);

      if (!fs.existsSync(absolutePath)) {
        if (!this.dryRun) {
          fs.mkdirSync(absolutePath, { recursive: true });
        }
        log.success(`Created directory: ${category}/`);
        this.stats.categoriesCreated++;
      } else {
        log.dim(`Directory already exists: ${category}/`);
      }
    });
  }

  /**
   * Step 2: Move files and track them
   */
  private moveFiles(): Map<string, string> {
    log.section("📦 Step 2: Moving files");

    const movedFiles = new Map<string, string>(); // oldPath -> newPath

    Object.entries(categoryMap).forEach(([category, files]) => {
      files.forEach((fileName) => {
        // Try to find file in multiple locations
        const possiblePaths = [
          `${this.hooksDir}/${fileName}`,
          `${this.hooksDir}/utils/${fileName}`,
          `${this.hooksDir}/logic/${fileName}`,
        ];

        let sourceFile = null;
        let foundPath = "";

        for (const possiblePath of possiblePaths) {
          sourceFile = this.project.getSourceFile(possiblePath);
          if (sourceFile) {
            foundPath = possiblePath;
            break;
          }
        }

        if (sourceFile) {
          this.stats.filesFound++;
          const newPath = `${this.hooksDir}/${category}/${fileName}`;

          // Store the mapping for import updates
          movedFiles.set(foundPath, newPath);

          if (!this.dryRun) {
            // Move the file (this will auto-update imports!)
            sourceFile.move(newPath);
          }

          log.success(`${fileName} → ${category}/`);
          this.stats.filesMoved++;
        } else {
          log.warning(`File not found: ${fileName}`);
          this.stats.filesNotFound++;
        }
      });
    });

    return movedFiles;
  }

  /**
   * Step 3: Update index.ts exports
   */
  private updateIndexFile(): void {
    log.section("📝 Step 3: Updating index.ts");

    const indexFile = this.project.getSourceFile(`${this.hooksDir}/index.ts`);
    if (!indexFile) {
      log.error("index.ts not found!");
      return;
    }

    if (this.dryRun) {
      log.dim("Would update index.ts export paths");
      return;
    }

    // Get all export declarations
    const exportDeclarations = indexFile.getExportDeclarations();

    exportDeclarations.forEach((exportDecl) => {
      const moduleSpecifier = exportDecl.getModuleSpecifierValue();

      if (!moduleSpecifier) return;

      // Update exports from old locations
      Object.entries(categoryMap).forEach(([category, files]) => {
        files.forEach((fileName) => {
          const fileNameWithoutExt = fileName.replace(/\.ts$/, "");

          // Match exports like: export { useAccordion } from "./useAccordion"
          if (moduleSpecifier === `./${fileNameWithoutExt}`) {
            exportDecl.setModuleSpecifier(`./${category}/${fileNameWithoutExt}`);
            this.stats.importsUpdated++;
            log.success(`Updated export: ./${fileNameWithoutExt} → ./${category}/${fileNameWithoutExt}`);
          }

          // Match exports from utils/: export { useId } from "./utils/useId"
          if (moduleSpecifier === `./utils/${fileNameWithoutExt}`) {
            exportDecl.setModuleSpecifier(`./${category}/${fileNameWithoutExt}`);
            this.stats.importsUpdated++;
            log.success(`Updated export: ./utils/${fileNameWithoutExt} → ./${category}/${fileNameWithoutExt}`);
          }

          // Match exports from logic/: export { CommandManager } from "./logic/CommandManager"
          if (moduleSpecifier === `./logic/${fileNameWithoutExt}`) {
            exportDecl.setModuleSpecifier(`./${category}/${fileNameWithoutExt}`);
            this.stats.importsUpdated++;
            log.success(`Updated export: ./logic/${fileNameWithoutExt} → ./${category}/${fileNameWithoutExt}`);
          }
        });
      });
    });
  }

  /**
   * Step 4: Clean up old directories
   */
  private cleanupOldDirectories(): void {
    log.section("🗑️  Step 4: Cleaning up old directories");

    const oldDirs = ["utils", "logic"];

    oldDirs.forEach((dir) => {
      const dirPath = path.resolve(this.hooksDir, dir);

      if (!fs.existsSync(dirPath)) {
        log.dim(`Directory doesn't exist: ${dir}/`);
        return;
      }

      const files = fs.readdirSync(dirPath);

      if (files.length === 0) {
        if (!this.dryRun) {
          fs.rmdirSync(dirPath);
        }
        log.success(`Removed empty directory: ${dir}/`);
      } else {
        log.warning(`Directory not empty (skipped): ${dir}/`);
        log.dim(`  Remaining files: ${files.join(", ")}`);
      }
    });
  }

  /**
   * Step 5: Save all changes
   */
  private async saveChanges(): Promise<void> {
    if (this.dryRun) {
      log.section("✨ Dry run completed - no changes were made");
      return;
    }

    log.section("💾 Step 5: Saving all changes");
    log.dim("This will update all import paths automatically...");

    try {
      await this.project.save();
      log.success("All changes saved successfully!");
    } catch (error) {
      log.error(`Failed to save changes: ${error}`);
      throw error;
    }
  }

  /**
   * Step 6: Print statistics
   */
  private printStats(): void {
    log.section("📊 Migration Statistics");
    console.log();
    console.log(`  Categories created:  ${colors.cyan}${this.stats.categoriesCreated}${colors.reset}`);
    console.log(`  Files found:         ${colors.cyan}${this.stats.filesFound}${colors.reset}`);
    console.log(`  Files moved:         ${colors.green}${this.stats.filesMoved}${colors.reset}`);
    console.log(`  Files not found:     ${this.stats.filesNotFound > 0 ? colors.yellow : colors.cyan}${this.stats.filesNotFound}${colors.reset}`);
    console.log(`  Exports updated:     ${colors.cyan}${this.stats.importsUpdated}${colors.reset}`);
    console.log();
  }

  /**
   * Step 7: Next steps guide
   */
  private printNextSteps(): void {
    if (this.dryRun) {
      log.section("📋 Next Steps");
      console.log();
      console.log(`  1. Review the changes above`);
      console.log(`  2. Run without --dry-run to apply changes:`);
      console.log(`     ${colors.cyan}npx tsx scripts/migrate-hooks.ts${colors.reset}`);
      console.log();
    } else {
      log.section("📋 Next Steps");
      console.log();
      console.log(`  1. Verify the changes:`);
      console.log(`     ${colors.cyan}git diff${colors.reset}`);
      console.log();
      console.log(`  2. Run type checking:`);
      console.log(`     ${colors.cyan}npm run typecheck${colors.reset}`);
      console.log();
      console.log(`  3. Run build:`);
      console.log(`     ${colors.cyan}npm run build${colors.reset}`);
      console.log();
      console.log(`  4. If everything looks good, commit:`);
      console.log(`     ${colors.cyan}git add .${colors.reset}`);
      console.log(`     ${colors.cyan}git commit -m "refactor(hooks): categorize into purpose-based folders"${colors.reset}`);
      console.log();
    }
  }

  /**
   * Main migration flow
   */
  public async run(): Promise<void> {
    try {
      this.createDirectories();
      this.moveFiles();
      this.updateIndexFile();
      this.cleanupOldDirectories();
      await this.saveChanges();
      this.printStats();
      this.printNextSteps();

      if (!this.dryRun) {
        log.section("🎉 Migration completed successfully!");
      }
    } catch (error) {
      log.error(`Migration failed: ${error}`);
      console.error(error);
      process.exit(1);
    }
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  const migrator = new HooksMigrator(dryRun);
  await migrator.run();
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
