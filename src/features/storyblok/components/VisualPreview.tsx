import * as styles from '../StoryblokLayout.css';
import { type StoryblokComponent, COMPONENT_TYPES } from '../types';
import { VisualFrame } from '../../../components/primitives/VisualFrame';

interface VisualPreviewProps {
    blocks: StoryblokComponent[];
    selectedId: string | null;
    hoveredId: string | null;
    viewportMode: string;
    onSelect: (id: string) => void;
    onHover: (id: string | null) => void;
}

export function VisualPreview({ blocks, selectedId, hoveredId, viewportMode, onSelect, onHover }: VisualPreviewProps) {
    return (
        <main className={styles.mainContent}>
            {/* 
               Pass data-viewport to trigger CSS width transition.
               TypeScript might complain about data-viewport not being on div props if not typed strictly, 
               but standard React supports data- attributes.
            */}
            <div className={styles.previewFrame} data-viewport={viewportMode}>
                {blocks.map(block => (
                    <VisualFrame
                        key={block._uid}
                        label={block.component}
                        isSelected={selectedId === block._uid}
                        isHovered={hoveredId === block._uid}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(block._uid);
                        }}
                        onMouseEnter={() => onHover(block._uid)}
                        onMouseLeave={() => onHover(null)}
                    >
                        <BlockRenderer block={block} />
                    </VisualFrame>
                ))}

                {blocks.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center' }} className={styles.helperText}>
                        Story is empty. Add a block from the sidebar.
                    </div>
                )}
            </div>
        </main>
    );
}

// Simple Renderer Registry
function BlockRenderer({ block }: { block: StoryblokComponent }) {
    switch (block.component) {
        case COMPONENT_TYPES.HERO:
            return (
                <div style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #eee'
                }}>
                    <h1 style={{ fontSize: '42px', marginBottom: '16px', color: '#111' }}>{block.headline || 'Hero Headline'}</h1>
                    <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>{block.subheadline || 'Hero Subheadline goes here...'}</p>
                </div>
            );

        case COMPONENT_TYPES.TEASER:
            return (
                <div style={{ padding: '40px 20px', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{block.headline || 'Teaser Headline'}</h2>
                    <p style={{ color: '#555' }}>{block.text || 'Teaser text content...'}</p>
                </div>
            );

        case COMPONENT_TYPES.GRID:
            return (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    padding: '40px 20px',
                    borderBottom: '1px solid #eee'
                }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Column {i}</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>Grid item placeholder content.</div>
                        </div>
                    ))}
                </div>
            );

        case COMPONENT_TYPES.FEATURE:
            return (
                <div style={{ padding: '30px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontWeight: 'bold' }}>
                        Icon
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{block.name || 'Feature Name'}</h3>
                        <p style={{ fontSize: '14px', color: '#666' }}>{block.description || 'Feature description details...'}</p>
                    </div>
                </div>
            );

        case COMPONENT_TYPES.TEXT:
            return (
                <div style={{ padding: '20px', maxWidth: '65ch', margin: '0 auto', fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
                    {block.content || 'Start typing your text content here...'}
                </div>
            );

        default:
            return <div style={{ padding: '20px', color: 'red' }}>Unknown Block: {block.component}</div>;
    }
}
