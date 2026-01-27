import { useState } from 'react';
import * as styles from './StoryblokLayout.css';
import { Sidebar } from './components/Sidebar';
import { VisualPreview } from './components/VisualPreview';
import { ConfigPanel } from './components/ConfigPanel';
import { type Story, type StoryblokComponent, COMPONENT_TYPES } from './types';
import { ArrowLeft, Play, Globe, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';

const INITIAL_STORY: Story = {
    name: 'Home',
    content: {
        body: [
            { _uid: '123', component: COMPONENT_TYPES.HERO, headline: 'Welcome to Storyblok', subheadline: 'The only Headless CMS with a Visual Editor' },
            { _uid: '456', component: COMPONENT_TYPES.TEASER, headline: 'Visual Bridge', text: 'Click any element to edit it in the sidebar.' },
            { _uid: '789', component: COMPONENT_TYPES.FEATURE, name: 'Real-time Editing', description: 'See your changes instantly as you type.' }
        ]
    }
};

export function StoryblokPage() {
    const navigate = useNavigate();
    const [story, setStory] = useState<Story>(INITIAL_STORY);
    const [selectedId, setSelectedId] = useState<string | null>('123');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [viewportMode, setViewportMode] = useState<string>('desktop');

    const selectedBlock = story.content.body.find(b => b._uid === selectedId);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleUpdateBlock = (key: string, value: any) => {
        if (!selectedId) return;

        setStory(prev => ({
            ...prev,
            content: {
                body: prev.content.body.map(b =>
                    b._uid === selectedId ? { ...b, [key]: value } : b
                )
            }
        }));
    };

    const handleDeleteBlock = (id: string) => {
        setStory(prev => ({
            ...prev,
            content: {
                body: prev.content.body.filter(b => b._uid !== id)
            }
        }));
        if (selectedId === id) setSelectedId(null);
    };

    const handleAddBlock = (type: string) => {
        const newBlock: StoryblokComponent = {
            _uid: Date.now().toString(),
            component: type,
            // Default props based on type
            ...(type === COMPONENT_TYPES.HERO ? { headline: 'New Hero', subheadline: 'Hero Subtitle' } : {}),
            ...(type === COMPONENT_TYPES.TEASER ? { headline: 'New Teaser', text: 'Teaser text' } : {}),
            ...(type === COMPONENT_TYPES.TEXT ? { content: 'New text content' } : {}),
            ...(type === COMPONENT_TYPES.FEATURE ? { name: 'New Feature', description: 'Feature description' } : {}),
        };

        setStory(prev => ({
            ...prev,
            content: {
                body: [...prev.content.body, newBlock]
            }
        }));
        setSelectedId(newBlock._uid);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLogo}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ padding: 0, background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div className={styles.logoBox}>S</div>
                    <span>Storyblok</span>
                    <span className={styles.helperText} style={{ marginLeft: 0 }}>/ {story.name}</span>
                </div>

                <div className={styles.headerCenter}>
                    <SegmentedControl
                        value={viewportMode}
                        onChange={setViewportMode}
                        options={[
                            { value: 'desktop', label: 'Desktop', icon: <Monitor size={14} /> },
                            { value: 'tablet', label: 'Tablet', icon: <Tablet size={14} /> },
                            { value: 'mobile', label: 'Mobile', icon: <Smartphone size={14} /> },
                        ]}
                    />
                </div>

                <div className={styles.headerActions}>
                    <button className={styles.ghostButton}>
                        <Globe size={14} />
                        German
                    </button>
                    <button className={styles.primaryButton}>
                        <Play size={14} fill="currentColor" />
                        Publish
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar
                blocks={story.content.body}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={setHoveredId}
                onAdd={handleAddBlock}
            />

            {/* Visual Preview */}
            <VisualPreview
                blocks={story.content.body}
                selectedId={selectedId}
                hoveredId={hoveredId}
                viewportMode={viewportMode}
                onSelect={handleSelect}
                onHover={setHoveredId}
            />

            {/* Config Panel */}
            <ConfigPanel
                selectedBlock={selectedBlock}
                onChange={handleUpdateBlock}
                onDelete={handleDeleteBlock}
            />
        </div>
    );
}

export default StoryblokPage;
