import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const files = getAllFiles(srcDir);
let hasError = false;

console.log('🔍 Checking for invalid Vanilla Extract usage...');

files.forEach(file => {
    // Check only .ts and .tsx files
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;

    // Ignore .css.ts files (these are valid)
    if (file.endsWith('.css.ts')) return;

    const content = fs.readFileSync(file, 'utf-8');

    // Check for Vanilla Extract imports
    // Matches: import ... from '@vanilla-extract/css'
    if (content.includes('@vanilla-extract/css')) {
        console.error(`\n❌ Error in: ${path.relative(process.cwd(), file)}`);
        console.error('   Reason: Vanilla Extract styles must be defined in *.css.ts files.');
        console.error('   Found import from "@vanilla-extract/css" in a standard TS/TSX file.');
        hasError = true;
    }
});

if (hasError) {
    console.log('\n💥 Validation failed! Fix the errors above.');
    process.exit(1);
} else {
    console.log('\n✅ No invalid Vanilla Extract usage found.');
}
