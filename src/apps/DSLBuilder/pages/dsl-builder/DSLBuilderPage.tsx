/**
 * DSLBuilderPage - DSL 비주얼 빌더
 *
 * 드래그 앤 드롭으로 DSL 레이아웃 구성
 * 키보드 단축키: cmd+c, cmd+x, cmd+v, delete
 */

import { Check, Code, Download, Play, Upload } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AnyDSLNode,
  BuilderState,
  DSLNodeType,
} from '@/apps/DSLBuilder/lib/dsl-builder/types';
import {
  addChildNode,
  cloneNode,
  createDefaultNode,
  findNodeById,
  generateId,
  moveNode,
  removeNode,
  updateNode,
} from '@/apps/DSLBuilder/lib/dsl-builder/utils';
import { type NodePath, PreviewPanel } from '@/apps/DSLBuilder/widgets/dsl-builder/PreviewPanel';
import { PropertyPanel } from '@/apps/DSLBuilder/widgets/dsl-builder/PropertyPanel';
import { TreeView } from '@/apps/DSLBuilder/widgets/dsl-builder/TreeView';
import { Button } from '@/components/types/Element/Action/role/Button';
// Select removed, using native
import { Kbd } from '@/components/types/Element/Text/role/Kbd';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';

// Import all JSON files from apps/dsl using Vite's glob import
const templateFiles = import.meta.glob('/apps/dsl/*.json', { eager: true });

interface Template {
  id: string;
  name: string;
  data: AnyDSLNode;
}

// Default initial tree (fallback)
const getDefaultTree = (): AnyDSLNode => ({
  id: generateId(),
  type: 'page',
  children: [
    {
      id: generateId(),
      type: 'region',
      role: 'main',
      children: [
        {
          id: generateId(),
          type: 'section',
          prominence: 'Standard',
          children: [
            {
              id: generateId(),
              type: 'group',
              role: 'Container',
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  role: 'Title',
                  prominence: 'Hero',
                  content: 'Welcome to DSL Builder',
                },
                {
                  id: generateId(),
                  type: 'text',
                  role: 'Body',
                  prominence: 'Standard',
                  content: 'Drag and drop to build your layout!',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export const DSLBuilderPage = () => {
  // Parse templates from glob import
  const templates = useMemo<Template[]>(() => {
    const result: Template[] = [];

    Object.entries(templateFiles).forEach(([path, module]) => {
      const fileName = path.split('/').pop()?.replace('.json', '') || '';

      // Skip index.json (metadata file)
      if (fileName === 'index') return;

      // Convert filename to display name
      const name = fileName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      result.push({
        id: fileName,
        name,
        data: (module as any).default as AnyDSLNode,
      });
    });

    // Sort by complexity (dashboard first, then others alphabetically)
    return result.sort((a, b) => {
      if (a.id === 'dashboard') return -1;
      if (b.id === 'dashboard') return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  // Get initial template (most complex one - dashboard)
  const initialTemplate = templates.find((t) => t.id === 'dashboard') || templates[0];

  const [state, setState] = useState<BuilderState>({
    tree: initialTemplate?.data || getDefaultTree(),
    selectedNodeId: null,
    clipboard: null,
    clipboardAction: null,
  });

  const [currentTemplateId, setCurrentTemplateId] = useState<string>(
    initialTemplate?.id || templates[0]?.id || 'default'
  );
  const [showPreview, setShowPreview] = useState(true);
  const [clickedNodePath, setClickedNodePath] = useState<NodePath[] | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Load template by ID
  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setState((prev) => ({
        ...prev,
        tree: template.data,
        selectedNodeId: null,
      }));
      setCurrentTemplateId(templateId);
    }
  };

  // Import from file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        setState((prev) => ({
          ...prev,
          tree: data as AnyDSLNode,
          selectedNodeId: null,
        }));
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Get selected node
  const selectedNode = state.selectedNodeId ? findNodeById(state.tree, state.selectedNodeId) : null;

  // Handle node selection
  const handleSelect = (id: string) => {
    setState((prev) => ({ ...prev, selectedNodeId: id }));
  };

  // Handle adding child
  const handleAddChild = (parentId: string, type: DSLNodeType) => {
    const newNode = createDefaultNode(type);
    const newTree = addChildNode(state.tree, parentId, newNode);

    setState((prev) => ({
      ...prev,
      tree: newTree,
      selectedNodeId: newNode.id,
    }));
  };

  // Handle node update
  const handleUpdateNode = (updates: Partial<AnyDSLNode>) => {
    if (!state.selectedNodeId) return;

    const newTree = updateNode(state.tree, state.selectedNodeId, updates);
    setState((prev) => ({ ...prev, tree: newTree }));
  };

  // Handle node move (drag & drop)
  const handleMove = (nodeId: string, newParentId: string) => {
    // Prevent moving node into itself or its children
    if (nodeId === newParentId) return;

    const newTree = moveNode(state.tree, nodeId, newParentId);
    setState((prev) => ({ ...prev, tree: newTree }));
  };

  // Handle node click in preview
  const handleNodeClick = (node: AnyDSLNode, path: NodePath[]) => {
    setClickedNodePath(path);
    handleSelect(node.id);
  };

  // Format hierarchy path for clipboard
  const formatHierarchyPath = (path: NodePath[]): string => {
    return path
      .map((node) => {
        let formatted = node.type.charAt(0).toUpperCase() + node.type.slice(1);

        // Add role/purpose in brackets
        if (node.role) {
          formatted += `[${node.role}]`;
        } else if (node.role) {
          formatted += `[${node.role}]`;
        }

        // Add prominence if exists
        if (node.prominence) {
          formatted += `(p${node.prominence})`;
        }

        // Add ID
        formatted += ` {${node.id}}`;

        return formatted;
      })
      .join(' > ');
  };

  // Copy hierarchy to clipboard
  const copyHierarchyToClipboard = useCallback(async () => {
    if (!clickedNodePath || clickedNodePath.length === 0) {
      return;
    }

    const hierarchyText = formatHierarchyPath(clickedNodePath);

    try {
      await navigator.clipboard.writeText(hierarchyText);

      // Show success indicator
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy hierarchy:', error);
      alert('Failed to copy to clipboard');
    }
  }, [clickedNodePath]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // cmd+shift+c - Copy hierarchy to clipboard
      if (cmdKey && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        copyHierarchyToClipboard();
        return;
      }

      // cmd+c - Copy node
      if (cmdKey && e.key === 'c' && !e.shiftKey) {
        if (selectedNode && selectedNode.type !== 'page') {
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            clipboard: selectedNode,
            clipboardAction: 'copy',
          }));
        }
      }

      // cmd+x - Cut
      if (cmdKey && e.key === 'x' && !e.shiftKey) {
        if (selectedNode && selectedNode.type !== 'page') {
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            clipboard: selectedNode,
            clipboardAction: 'cut',
          }));
        }
      }

      // cmd+v - Paste
      if (cmdKey && e.key === 'v' && !e.shiftKey) {
        if (state.clipboard && selectedNode) {
          e.preventDefault();

          let nodeToAdd: AnyDSLNode;

          if (state.clipboardAction === 'copy') {
            // Clone the node
            nodeToAdd = cloneNode(state.clipboard);
          } else {
            // Cut: use original node
            nodeToAdd = state.clipboard;
          }

          // Add to selected node
          let newTree = state.tree;

          // If cut, remove from original position first
          if (state.clipboardAction === 'cut') {
            const removed = removeNode(state.tree, state.clipboard.id);
            if (removed) {
              newTree = removed;
            }
          }

          // Add to new position
          newTree = addChildNode(newTree, selectedNode.id, nodeToAdd);

          setState((prev) => ({
            ...prev,
            tree: newTree,
            clipboard: state.clipboardAction === 'copy' ? prev.clipboard : null,
            clipboardAction: state.clipboardAction === 'copy' ? prev.clipboardAction : null,
            selectedNodeId: nodeToAdd.id,
          }));
        }
      }

      // Delete or Backspace - Delete node
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.metaKey && !e.ctrlKey) {
        if (selectedNode && selectedNode.type !== 'page') {
          e.preventDefault();

          const newTree = removeNode(state.tree, selectedNode.id);
          if (newTree) {
            setState((prev) => ({
              ...prev,
              tree: newTree,
              selectedNodeId: null,
            }));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, state.clipboard, state.clipboardAction, state.tree, copyHierarchyToClipboard]);

  // Export as JSON
  const handleExport = () => {
    const json = JSON.stringify(state.tree, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsl-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page title="Showcase" role="Application" layout="Studio" density="Compact">
      {/* Left Sidebar - Tree View */}
      <Section role="PrimarySidebar" className="flex flex-col">
        {/* Header */}
        <div className="p-2 border-b border-border">
          <h2 className="text-sm font-semibold text-text">DSL Builder</h2>
          <p className="text-xs text-text-tertiary mt-0.5">Drag & drop to build layouts</p>

          {/* Template Selector */}
          <div className="mt-2 space-y-1">
            <label className="text-xs font-medium text-text-secondary">Template</label>
            <select
              className="w-full text-sm bg-layer-2 border border-border rounded px-2 py-1.5 focus:outline-none focus:border-accent"
              value={currentTemplateId}
              onChange={(e) => loadTemplate(e.target.value)}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Import Button */}
          <div className="mt-2">
            <label htmlFor="import-dsl-file" className="block">
              <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-md font-medium text-xs h-8 px-3 bg-transparent text-text hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer border border-border">
                <Upload size={14} />
                Import JSON
              </div>
            </label>
            <input
              id="import-dsl-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Shortcuts Help */}
        <div className="px-2 py-1.5 bg-layer-1 text-xs text-text-secondary border-b border-border">
          <div className="flex justify-between">
            <span>Copy</span>
            <Kbd size="sm">⌘C</Kbd>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Cut</span>
            <Kbd size="sm">⌘X</Kbd>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Paste</span>
            <Kbd size="sm">⌘V</Kbd>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Delete</span>
            <Kbd size="sm">⌫</Kbd>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Copy Hierarchy</span>
            <Kbd size="sm">⌘⇧C</Kbd>
          </div>
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-hidden">
          <TreeView
            tree={state.tree}
            selectedId={state.selectedNodeId}
            onSelect={handleSelect}
            onAddChild={handleAddChild}
            onMove={handleMove}
          />
        </div>
      </Section>

      {/* Center - Preview or Properties */}
      <Section role="Editor" className="flex flex-col">
        {/* Toolbar */}
        <div className="h-10 bg-layer-2 border-b border-border flex items-center justify-between px-3">
          <div className="flex items-center gap-1">
            <Button
              variant={showPreview ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              <Play size={14} />
              Preview
            </Button>
            <Button
              variant={!showPreview ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              <Code size={14} />
              Properties
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download size={14} />
            Export JSON
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {showPreview ? (
            <PreviewPanel
              tree={state.tree}
              selectedId={state.selectedNodeId}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <PropertyPanel node={selectedNode} onUpdate={handleUpdateNode} />
            </div>
          )}
        </div>
      </Section>

      {/* Right Sidebar - Properties (when preview is shown) */}
      {showPreview && (
        <Section role="SecondarySidebar" className="overflow-y-auto">
          <div className="p-2 border-b border-border">
            <h3 className="text-xs font-semibold text-text">Properties</h3>
          </div>
          <PropertyPanel node={selectedNode} onUpdate={handleUpdateNode} />
        </Section>
      )}

      {/* Copy Success Toast */}
      {showCopySuccess && (
        <div className="fixed bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <Check size={16} />
          <span className="text-sm font-medium">Hierarchy copied to clipboard!</span>
        </div>
      )}
    </Page>
  );
};
