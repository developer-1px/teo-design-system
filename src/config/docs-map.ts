
export interface DocSpace {
    id: string;
    label: string;
    icon: string;
    folders: string[];
}

export const DOCS_SPACES: DocSpace[] = [
    {
        id: 'guide',
        label: 'Guide',
        icon: 'Book',
        folders: [
            '01-Overview',
            '02-Planning',
            '03-Design-System',
            '04-Patterns',
            '06-Design-Lint',
            'examples', // Adding examples to Guide for now
            'Uncategorized' // Catch-all
        ]
    },
    {
        id: 'components',
        label: 'Components',
        icon: 'Component',
        folders: ['05-Primitives']
    }
];

export function getSpaceForFolder(folder: string): string {
    const space = DOCS_SPACES.find(s => s.folders.includes(folder));
    return space ? space.id : 'guide'; // Default to guide
}
