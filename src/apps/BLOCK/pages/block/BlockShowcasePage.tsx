import { Block } from '@/components/types/Block/Block';
import { ROLE_CONFIGS } from '@/components/types/Block/role-config';
import { BlockRole } from '@/components/types/Block/Block.types';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { BlockSectionContextDemo } from './examples/BlockSectionContextDemo';

// Categorize roles for display
const CATEGORIES: Record<string, BlockRole[]> = {
    'Layout / Container': ['Card', 'Stack', 'Grid', 'ScrollArea', 'Collapsible', 'Splitter', 'AspectRatio', 'Container', 'Group', 'Row', 'Inline', 'Spacer'],
    'List / Collection': ['List', 'Menu', 'ContextMenu', 'CommandPalette', 'Combobox', 'TreeView', 'DataTable', 'VirtualList', 'Carousel', 'Timeline', 'ListItem', 'SortableList', 'Dropdown'],
    'Navigation': ['Tabs', 'TabPanel', 'Toolbar', 'Breadcrumbs', 'Pagination', 'Stepper', 'NavigationMenu', 'Sidebar', 'AppBar', 'Steps', 'ScrollMenu', 'Navigator', 'FloatingToolbar', 'ToolbarDivider'],
    'Forms': ['Form', 'FieldGroup', 'RadioGroup', 'CheckboxGroup', 'ToggleGroup', 'InputGroup', 'FormActions', 'Fieldset'],
    'Overlay / Modal': ['Dialog', 'AlertDialog', 'Sheet', 'Drawer', 'Popover', 'Tooltip', 'HoverCard', 'DropdownMenu', 'Toast', 'Notification'],
    'Data Display': ['Accordion', 'DescriptionList', 'Stats', 'Avatar', 'AvatarGroup', 'Badge', 'Tag', 'EmptyState', 'Skeleton', 'Calendar', 'Chart', 'ColorIndicator', 'PreviewContainer', 'PreviewCard', 'SectionHighlight'],
    'Feedback': ['Alert', 'Progress', 'Spinner', 'Banner', 'Callout'],
    'Interaction': ['DragDropZone', 'Sortable', 'Resizable', 'SelectionArea'],
    'Testing': ['Mock', 'DeviceFrame']
};

export function BlockShowcasePage() {
    return (
        <ShowcasePage title="Block Showcase" description="Function-centric Block components (IDDL v4.0)">
            {/* Section Context Awareness Demo (v5.2) */}
            <BlockSectionContextDemo />
            <Block role="Divider" className="my-12" />

            {/* Document Editing Demo (Notion-style) */}
            <Block role="Stack" density="Comfortable" className="mb-12">
                <h2 className="text-xl font-bold border-b border-border-default pb-2">Document Editing Experience</h2>
                <Block role="Card" prominence="Standard" className="max-w-3xl mx-auto w-full min-h-[500px] bg-white border border-border-default shadow-sm p-12">
                    <Block role="Stack" gap={4}>
                        {/* Title */}
                        <Block role="Group" gap={2}>
                            <h1 className="text-4xl font-bold text-gray-900">Project Proposal</h1>
                            <Block role="Row" gap={2} className="text-sm text-gray-500">
                                <span className="flex items-center gap-1">@User</span>
                                <span>•</span>
                                <span>Updated today</span>
                            </Block>
                        </Block>

                        {/* Divider */}
                        <Block role="Divider" />

                        {/* Content Blocks */}
                        <Block role="Callout" prominence="Subtle" className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                            <Block role="Row" gap={2}>
                                <span className="text-xl">💡</span>
                                <Block role="Stack" gap={1}>
                                    <span className="font-bold text-blue-900">Key Objective</span>
                                    <span className="text-blue-800">To demonstrate the seamless vertical assembly of IDDL blocks.</span>
                                </Block>
                            </Block>
                        </Block>

                        <p className="text-gray-700 leading-relaxed">
                            This document showcases how disparate <strong>Block</strong> components can be stacked vertically to create a rich, document-like editing experience similar to Notion. Each block handles its own internal layout while respecting the global vertical rhythm.
                        </p>

                        <Block role="Stack" gap={2}>
                            <h2 className="text-2xl font-semibold text-gray-800 mt-4">1. Features</h2>
                            <Block role="List" className="list-disc pl-5 space-y-1 text-gray-700">
                                <Block role="ListItem"><strong>Modular Architecture:</strong> Every paragraph, list, or image is a Block.</Block>
                                <Block role="ListItem"><strong>Consistent Spacing:</strong> Controlled by the <code>density</code> prop.</Block>
                                <Block role="ListItem"><strong>Rich Interactions:</strong> Blocks can be draggable (SortableList) or interactive.</Block>
                            </Block>
                        </Block>

                        <Block role="Stack" gap={2}>
                            <h2 className="text-2xl font-semibold text-gray-800 mt-4">2. Code Example</h2>
                            <Block role="Card" prominence="Subtle" className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                {`const Document = () => (
  <Block role="Stack" gap={4}>
    <Block role="Heading">Hello World</Block>
    <Block role="Text">This is a paragraph.</Block>
  </Block>
);`}
                            </Block>
                        </Block>

                        <Block role="Stack" gap={4}>
                            <h2 className="text-2xl font-semibold text-gray-800 mt-4">3. Layouts</h2>
                            <Block role="Grid" spec={{ columns: 2 }} gap={4}>
                                <Block role="Card" className="p-4 bg-gray-50 border border-gray-200 rounded">
                                    <h3 className="font-bold mb-2">Column A</h3>
                                    <p className="text-sm text-gray-600">Grid blocks can be nested directly within the document flow.</p>
                                </Block>
                                <Block role="Card" className="p-4 bg-gray-50 border border-gray-200 rounded">
                                    <h3 className="font-bold mb-2">Column B</h3>
                                    <p className="text-sm text-gray-600">They automatically adapt to the available width.</p>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </Block>

            <Block role="Divider" className="my-12" />

            {/* Main container: Large spacing between categories */}
            <Block role="Stack" density="Comfortable">
                {Object.entries(CATEGORIES).map(([category, roles]) => (
                    <Block key={category} role="Stack" density="Standard">
                        <h2 className="text-xl font-bold border-b border-border-default pb-2">{category}</h2>

                        {/* Stack container: Vertical list of blocks (Notion-style) */}
                        <Block role="Stack" density="Comfortable" gap={6}>
                            {roles.map(role => {
                                const config = ROLE_CONFIGS[role as BlockRole];
                                if (!config) return null;

                                // Extract config properties with defaults
                                const { description, htmlTag, renderer = undefined } = config as typeof config & { renderer?: any };

                                return (
                                    // Render as a "Block Row" in the document flow
                                    <Block
                                        key={role}
                                        role="Group"
                                        className="border-b border-border-muted pb-6 last:border-0"
                                    >
                                        {/* Block Metadata (Side or Top) */}
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="font-bold text-sm bg-surface-raised px-2 py-0.5 rounded border border-border-default">{role}</span>
                                            <span className="text-xs text-text-subtle">{description}</span>
                                        </div>

                                        {/* Block Preview */}
                                        <div className="w-full">
                                            <Block role={role as BlockRole} prominence="Standard" density="Standard">
                                                {!renderer && (role === 'Grid' ? (
                                                    <Block role="Grid" spec={{ columns: 2 }} gap={4}>
                                                        <div className="bg-primary/10 p-4 rounded text-center text-sm border border-primary/20">Grid Item A</div>
                                                        <div className="bg-primary/10 p-4 rounded text-center text-sm border border-primary/20">Grid Item B</div>
                                                    </Block>
                                                ) : role === 'DataTable' ? (
                                                    <div className="border border-border-default rounded overflow-hidden">
                                                        <table className="w-full text-sm text-left">
                                                            <thead className="bg-surface-subtle text-text-subtle font-medium">
                                                                <tr><th className="p-2">Header 1</th><th className="p-2">Header 2</th></tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-border-muted">
                                                                <tr><td className="p-2">Cell 1</td><td className="p-2">Cell 2</td></tr>
                                                                <tr><td className="p-2">Cell 3</td><td className="p-2">Cell 4</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 border-2 border-dashed border-border-muted rounded bg-surface-subtle/30 flex items-center justify-center text-text-subtle text-sm">
                                                        Visual Preview for {role}
                                                    </div>
                                                ))}
                                            </Block>
                                        </div>
                                    </Block>
                                );
                            })}
                        </Block>
                    </Block>
                ))}
            </Block>
        </ShowcasePage>
    );
}
