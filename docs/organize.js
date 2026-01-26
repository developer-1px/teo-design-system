import fs from 'fs';
import path from 'path';

const docsDir = '/Users/user/Desktop/minimal-design-kit/docs';

async function organizeDocs() {
    try {
        const files = await fs.promises.readdir(docsDir);
        const mdFiles = [];

        // Filter Markdown files and get stats
        for (const file of files) {
            if (!file.endsWith('.md')) continue;

            const filePath = path.join(docsDir, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isFile()) {
                mdFiles.push({
                    name: file,
                    path: filePath,
                    birthtime: stat.birthtime
                });
            }
        }

        // Group by Date
        const filesByDate = {};
        for (const file of mdFiles) {
            const date = file.birthtime.toISOString().split('T')[0];
            if (!filesByDate[date]) {
                filesByDate[date] = [];
            }
            filesByDate[date].push(file);
        }

        // Process each group
        for (const date in filesByDate) {
            const targetDir = path.join(docsDir, date);

            // Create directory if not exists
            if (!fs.existsSync(targetDir)) {
                await fs.promises.mkdir(targetDir, { recursive: true });
            }

            // Sort by creation time
            filesByDate[date].sort((a, b) => a.birthtime - b.birthtime);

            // Move and rename
            for (let i = 0; i < filesByDate[date].length; i++) {
                const file = filesByDate[date][i];
                const prefix = i.toString().padStart(2, '0');
                const newName = `${prefix}-${file.name}`;
                const newPath = path.join(targetDir, newName);

                console.log(`Moving ${file.name} -> ${date}/${newName}`);
                await fs.promises.rename(file.path, newPath);
            }
        }

        console.log('Docs organization complete.');

    } catch (err) {
        console.error('Error organizing docs:', err);
    }
}

organizeDocs();
