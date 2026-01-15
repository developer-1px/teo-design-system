const fs = require('fs');
const path = require('path');

// Configuration
const TARGET_DIR = path.join(process.cwd(), 'src/apps');
const IGNORE_FILES = ['.DS_Store'];

// Regex Patterns
// Detects hardcoded pixels in style or props (e.g. "13px", "317px")
const HARDCODED_PIXEL_REGEX = /:\s*["']\d+px["']|width={["']\d+px["']}|height={["']\d+px["']}/g;
// Detects loose numbers in overrides that aren't typical tokens (simplified check)
// We look for numbers that trigger "why is this here?"
const SUSPICIOUS_NUMBER_REGEX = /gap:\s*\d+|p:\s*\d+|m:\s*\d+/g;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach((f) => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (!IGNORE_FILES.includes(f) && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
                callback(dirPath);
            }
        }
    });
}

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let issues = [];

    // Stack to track hierarchy: { indent, tag, hasGap, line }
    let stack = [];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('{/*')) return;

        // Calculate indent (spaces)
        const indentMatch = line.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1].length : 0;

        // Pop stack items that are deeper or equal indent (sibling or end of scope)
        // Heuristic: If indent is <= top of stack, we popped back up.
        // But JSX props are often indented further. We need to distinguish tag start vs props.
        // Simple heuristic: tags start with <.

        if (trimmed.startsWith('<')) {
            // New component start
            // Clean up stack: remove items with >= indentation
            while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
                stack.pop();
            }

            const frameMatch = trimmed.match(/<Frame/);
            const menuItemMatch = trimmed.match(/<MenuItem/);

            // Check for Touching Surfaces Violation
            // If current is MenuItem, check parent
            if (menuItemMatch) {
                const parent = stack[stack.length - 1];
                if (parent && parent.tag === 'Frame' && !parent.hasGap) {
                    issues.push({
                        line: lineNum,
                        type: 'Touching Surfaces',
                        value: 'MenuItem inside Frame with no gap',
                        content: trimmed
                    });
                }
            }

            // Capture Frame props
            if (frameMatch) {
                // If it's a self-closing Frame in one line, check props immediately
                // But usually we care about block frames.
                // We'll optimistically push to stack, assuming it might have children.
                // We need to parse props on this line AND subsequent lines until >
                // For this simple script, we'll assume crucial props like 'gap' or 'override' appear in the opening block
                // OR we check if the stack top is this Frame and we see props.

                // Simplified: Just check current line for gap/override. 
                // Detection across multiple lines is hard without full parser.
                // We'll set a flag "checkingProps" if the tag isn't closed.

                const hasGap = line.includes('gap:') || line.includes('gap={') || line.includes('space-y') || line.includes('layout=');
                stack.push({
                    indent,
                    tag: 'Frame',
                    hasGap: hasGap,
                    line: lineNum
                });
            } else {
                // Push generic tag
                stack.push({
                    indent,
                    tag: 'Other',
                    hasGap: false,
                    line: lineNum
                });
            }
        } else {
            // Continuation line (props)
            if (stack.length > 0) {
                const current = stack[stack.length - 1];
                // If we find gap prop here, update the current stack item
                if (line.includes('gap:') || line.includes('gap={')) {
                    current.hasGap = true;
                }
                // Update surface checking?

            }
        }


        // Original Checks
        const pixelMatches = line.match(HARDCODED_PIXEL_REGEX);
        if (pixelMatches) {
            pixelMatches.forEach(match => {
                if (!match.includes('1px') && !match.includes('0px')) {
                    issues.push({
                        line: lineNum,
                        type: 'Hardcoded Pixel',
                        value: match.trim(),
                        content: trimmed
                    });
                }
            });
        }
    });

    return issues;
}

console.log("🔍 Starting Design System Audit...\n");

let totalIssues = 0;
walkDir(TARGET_DIR, (filePath) => {
    const issues = auditFile(filePath);
    if (issues.length > 0) {
        console.log(`📄 ${path.relative(process.cwd(), filePath)}`);
        issues.forEach(issue => {
            console.log(`   L${issue.line} [${issue.type}]: ${issue.value}`);
            console.log(`      Code: ${issue.content}`);
        });
        console.log('');
        totalIssues += issues.length;
    }
});

console.log(`✅ Audit Complete. Found ${totalIssues} potential anomalies.`);
