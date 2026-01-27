import { Project } from 'ts-morph';
import path from 'path';

async function renameTypography() {
    console.log('🚀 Starting refactoring: typography -> textStyle');

    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    });

    project.addSourceFilesAtPaths("src/**/*.ts");
    const utilsFile = project.getSourceFileOrThrow('src/styles/utils.ts');
    const typographyExport = utilsFile.getExportedDeclarations().get('typography')?.[0];

    if (!typographyExport) {
        console.error('❌ Could not find "typography" export in src/styles/utils.ts');
        process.exit(1);
    }

    if ('getName' in typographyExport && 'rename' in typographyExport) {
        // Safe check for rename-able node
        console.log(`Found export: ${typographyExport.getName()}`);

        // This handles renaming the declaration AND all references across the project
        typographyExport.rename('textStyle');

        console.log('✅ Renamed "typography" to "textStyle" in utils.ts and all references.');
    } else {
        console.error('❌ Export is not a rename-able declaration');
        process.exit(1);
    }

    await project.save();
    console.log('💾 Changes saved.');
}

renameTypography().catch(err => {
    console.error(err);
    process.exit(1);
});
