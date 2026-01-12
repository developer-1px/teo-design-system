const fs = require('fs');
const path = require('path');

const rolesToReplace = [
    'Stack',
    'Row',
    'Grid',
    'Center',
    'Spacer',
    'Container',
    'Inline',
    'Group',
];

const roleToFrame = {
    'Stack': 'Frame.Stack',
    'Row': 'Frame.Row',
    'Grid': 'Frame.Grid',
    'Center': 'Frame.Center',
    'Spacer': 'Frame.Spacer',
    'Container': 'Frame.Column',
    'Inline': 'Frame.Inline',
    'Group': 'Frame.Stack',
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // This is a naive parser but better than simple regex
    // It looks for <Block role="Role" ... > and matching </Block>

    rolesToReplace.forEach(role => {
        const frameTag = roleToFrame[role];

        // Look for <Block role="Role" ...>
        // We'll replace them one by one to handle nested ones if we can
        let index = 0;
        while (true) {
            const openingRegex = new RegExp(`<Block\\s+([^>]*?)role="${role}"([^>]*?)>`, 'g');
            openingRegex.lastIndex = index;
            const match = openingRegex.exec(content);
            if (!match) break;

            changed = true;
            const openingTag = match[0];
            const openingIndex = match.index;

            let props = (match[1] + match[2]).trim();
            if (role === 'Grid') {
                const specMatch = props.match(/spec={{ columns: (\d+) }}/);
                if (specMatch) {
                    props = props.replace(/spec={{ columns: \d+ }}/, `columns={${specMatch[1]}}`);
                }
            }

            const newOpeningTag = `<${frameTag} ${props}>`.replace(/\s+/g, ' ').replace(' >', '>');

            // Now find the matching </Block>
            // We look for the next </Block> that isn't preceded by another <Block
            // This is still naive but works for simple cases

            // Actually, let's just replace the opening tag and see how many </Block> remain.
            // OR: replace all <Block role="Role"> with <Frame.Role> and </Block> with </Frame.Role>
            // ONLY if it's the only Role in the file? No.

            // Let's try to find the balancing </Block>
            let subContent = content.substring(openingIndex + openingTag.length);
            let depth = 1;
            let searchIndex = 0;
            let closingIndex = -1;

            while (depth > 0) {
                const nextOpen = subContent.indexOf('<Block', searchIndex);
                const nextClose = subContent.indexOf('</Block>', searchIndex);

                if (nextClose === -1) break; // Should not happen in valid JSX

                if (nextOpen !== -1 && nextOpen < nextClose) {
                    depth++;
                    searchIndex = nextOpen + 1;
                } else {
                    depth--;
                    if (depth === 0) {
                        closingIndex = nextClose;
                    }
                    searchIndex = nextClose + 1;
                }
            }

            if (closingIndex !== -1) {
                // Replace both
                content = content.substring(0, openingIndex) +
                    newOpeningTag +
                    subContent.substring(0, closingIndex) +
                    `</${frameTag}>` +
                    subContent.substring(closingIndex + 8);

                // Continue search from after the replaced tags
                index = openingIndex + newOpeningTag.length;
            } else {
                // Self-closing?
                if (openingTag.endsWith('/>')) {
                    const selfClosingTag = `<${frameTag} ${props} />`.replace(/\s+/g, ' ').replace(' /', ' /');
                    content = content.substring(0, openingIndex) + selfClosingTag + content.substring(openingIndex + openingTag.length);
                    index = openingIndex + selfClosingTag.length;
                } else {
                    // Fallback: just replace opening
                    content = content.substring(0, openingIndex) + newOpeningTag + content.substring(openingIndex + openingTag.length);
                    index = openingIndex + newOpeningTag.length;
                }
            }
        }
    });

    if (changed) {
        if (!content.includes("import { Frame }") && !content.includes("import {Frame}")) {
            const importLine = "import { Frame } from '@/components/dsl/shared/Frame';\n";
            content = importLine + content;
        }
        fs.writeFileSync(filePath, content);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                walk(fullPath);
            }
        } else if (file.endsWith('.tsx')) {
            processFile(fullPath);
        }
    });
}

walk(process.argv[2] || './src');
