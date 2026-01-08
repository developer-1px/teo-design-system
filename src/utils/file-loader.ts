// Load all files from the project (src + docs)
const srcModules = import.meta.glob('/src/**/*.{ts,tsx,js,jsx,json,css,html,md}', {
  query: '?raw',
  import: 'default',
});

const docsModules = import.meta.glob('/docs/**/*.{md,txt}', {
  query: '?raw',
  import: 'default',
});

// Merge both module collections
const modules = { ...srcModules, ...docsModules };

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  icon?: 'code' | 'json' | 'text' | 'markdown' | 'default';
  defaultOpen?: boolean;
}

// Sort function: folders first, then files, both alphabetically
function sortFileNodes(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    // Folders come before files
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;

    // Within same type, sort alphabetically (case-insensitive)
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
}

// Build file tree from glob results
export function buildFileTree(paths: string[]): FileNode[] {
  // Use a nested map structure to track all nodes
  interface TreeMap {
    [key: string]: {
      node: FileNode;
      children: TreeMap;
    };
  }

  const root: TreeMap = {};

  paths.forEach((fullPath) => {
    const parts = fullPath.split('/').filter(Boolean);
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const currentPath = '/' + parts.slice(0, index + 1).join('/');

      // Create entry if it doesn't exist
      if (!currentLevel[part]) {
        // Default open for specific folders: docs, src
        const shouldDefaultOpen = !isFile && (part === 'docs' || part === 'src');

        currentLevel[part] = {
          node: {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            icon: getFileIcon(part),
            children: isFile ? undefined : [],
            defaultOpen: shouldDefaultOpen,
          },
          children: {},
        };
      }

      // Move to next level if not a file
      if (!isFile) {
        currentLevel = currentLevel[part].children;
      }
    });
  });

  // Convert TreeMap to FileNode array recursively
  function convertToNodes(treeMap: TreeMap): FileNode[] {
    const nodes: FileNode[] = [];

    for (const key in treeMap) {
      const entry = treeMap[key];
      const node = { ...entry.node };

      // If it's a folder, recursively convert children
      if (node.type === 'folder') {
        node.children = convertToNodes(entry.children);
      }

      nodes.push(node);
    }

    // Sort: folders first, then files, both alphabetically
    return sortFileNodes(nodes);
  }

  return convertToNodes(root);
}

function getFileIcon(filename: string): 'code' | 'json' | 'text' | 'markdown' | 'default' {
  if (filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.jsx') || filename.endsWith('.js')) {
    return 'code';
  }
  if (filename.endsWith('.json')) {
    return 'json';
  }
  if (filename.endsWith('.md')) {
    return 'markdown';
  }
  if (filename.endsWith('.txt') || filename.endsWith('.css')) {
    return 'text';
  }
  return 'default';
}

// Get all file paths
export function getFilePaths(): string[] {
  return Object.keys(modules);
}

// Load file content
export async function loadFileContent(path: string): Promise<string> {
  const loader = modules[path];
  if (!loader) {
    throw new Error(`File not found: ${path}`);
  }
  const content = await loader();
  return content as string;
}
