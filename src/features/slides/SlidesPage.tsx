import { useState } from 'react';
import {
    Play, MousePointer2, Type, Square, Image as ImageIcon,
    MoreHorizontal, LayoutGrid, AlignLeft, AlignCenter, AlignRight,
    Plus, Sun
} from 'lucide-react';
import { vars } from '../../styles/vars.css';
import * as styles from './SlidesPage.css';

export function SlidesPage() {
    const [activeSlide, setActiveSlide] = useState(1);
    const [activeTool, setActiveTool] = useState('select');

    return (
        <div className={styles.layout}>
            {/* Top Bar */}
            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={styles.figmaLogo}></div>
                    <span className={styles.displayTitle}>Untitled Presentation</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className={styles.toolButton} title="Present"><Play size={18} /></button>
                    <button className={styles.shareButton}>Share</button>
                    <button className={styles.toolButton}><div className={styles.profileAvatar}></div></button>
                </div>
            </header>

            {/* Workspace */}
            <div className={styles.workspace}>
                {/* Left Panel: Thumbnails */}
                <aside className={styles.thumbnailPanel}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div
                            key={num}
                            className={`${styles.thumbnailItem} ${activeSlide === num ? styles.activeThumbnail : ''}`}
                            onClick={() => setActiveSlide(num)}
                        />
                    ))}
                </aside>

                {/* Center Canvas */}
                <main className={styles.canvasArea}>
                    <div className={styles.slidePaper}>
                        {/* Mock Content on Slide */}
                        <div className={styles.slideContent}>
                            <h1 className={styles.slideTitle}>
                                Slide {activeSlide}
                            </h1>
                            <p className={styles.slideBody}>
                                Use the floating toolbar below to add content using the design system tokens.
                            </p>

                            {/* Example Element */}
                            <div className={styles.slideElement}>
                                <span className={styles.slideElementText}>Element</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Toolbar */}
                    <div className={styles.floatingToolbar}>
                        <ToolButton
                            icon={MousePointer2}
                            active={activeTool === 'select'}
                            onClick={() => setActiveTool('select')}
                        />
                        <div className={styles.toolbarDivider} />
                        <ToolButton
                            icon={Square}
                            active={activeTool === 'shape'}
                            onClick={() => setActiveTool('shape')}
                        />
                        <ToolButton
                            icon={Type}
                            active={activeTool === 'text'}
                            onClick={() => setActiveTool('text')}
                        />
                        <ToolButton
                            icon={ImageIcon}
                            active={activeTool === 'image'}
                            onClick={() => setActiveTool('image')}
                        />
                        <div className={styles.toolbarDivider} />
                        <ToolButton
                            icon={MoreHorizontal}
                            onClick={() => { }}
                        />
                    </div>
                </main>

                {/* Right Panel: Properties */}
                <aside className={styles.propertiesPanel}>
                    {/* Alignment Row */}
                    <div className={styles.iconButtonRow} style={{ justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${vars.border.subtle}` }}>
                        <button className={styles.toolButton}><AlignLeft size={16} /></button>
                        <button className={styles.toolButton}><AlignCenter size={16} /></button>
                        <button className={styles.toolButton}><AlignRight size={16} /></button>
                        <div style={{ width: 1, height: 16, background: vars.border.default }} />
                        <button className={styles.toolButton}><LayoutGrid size={16} /></button>
                        <button className={styles.toolButton}><MoreHorizontal size={16} /></button>
                    </div>

                    {/* Layout Section */}
                    <div className={styles.sectionTitle}>Layout</div>
                    <div className={styles.propertyGrid}>
                        <span className={styles.label}>X</span>
                        <input className={styles.input} defaultValue="1024" />
                        <span className={styles.label}>Y</span>
                        <input className={styles.input} defaultValue="506" />
                    </div>
                    <div className={styles.propertyGrid}>
                        <span className={styles.label}>W</span>
                        <input className={styles.input} defaultValue="1920" />
                        <span className={styles.label}>H</span>
                        <input className={styles.input} defaultValue="1080" />
                    </div>
                    <div className={styles.propertyGrid}>
                        <span className={styles.label}>R</span>
                        <input className={styles.input} defaultValue="0" />
                        <span className={styles.label}>°</span>
                        <input className={styles.input} defaultValue="0" />
                    </div>

                    {/* Layer Section */}
                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>Layer</div>
                    <div className={styles.propertyGrid}>
                        <span className={styles.label}>Op</span>
                        <input className={styles.input} defaultValue="100%" />
                        <span className={styles.label}>Blend</span>
                        <input className={styles.input} defaultValue="Normal" />
                    </div>

                    {/* Typography Section (Conditional logic could go here, simplified for now) */}
                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>Text</div>
                    <div className={styles.propertyRow}>
                        <input className={styles.input} defaultValue="Inter" style={{ flex: 2 }} />
                        <select className={styles.input} style={{ flex: 1 }}>
                            <option>Regular</option>
                            <option>Medium</option>
                            <option>Bold</option>
                        </select>
                    </div>
                    <div className={styles.propertyGrid}>
                        <input className={styles.input} defaultValue="16" />
                        <select className={styles.input} defaultValue="Auto">
                            <option>Auto</option>
                            <option>1.2</option>
                            <option>1.5</option>
                        </select>
                    </div>
                    <div className={styles.propertyGrid}>
                        <input className={styles.input} defaultValue="0%" title="Letter Spacing" />
                        <input className={styles.input} defaultValue="0" title="Paragraph Spacing" />
                    </div>
                    <div className={styles.iconButtonRow}>
                        <button className={styles.toolButton}><AlignLeft size={14} /></button>
                        <button className={styles.toolButton}><AlignCenter size={14} /></button>
                        <button className={styles.toolButton}><AlignRight size={14} /></button>
                        <div style={{ flex: 1 }} />
                        <button className={styles.toolButton}><AlignLeft size={14} /></button>
                    </div>

                    {/* Fill Section */}
                    <div className={styles.propertyRow} style={{ marginTop: '24px' }}>
                        <div className={styles.sectionTitle} style={{ margin: 0 }}>Fill</div>
                        <button className={styles.toolButton} style={{ width: 24, height: 24 }}><Plus size={14} /></button>
                    </div>
                    <div className={styles.propertyRow}>
                        <div className={styles.colorPreview} />
                        <input className={styles.input} defaultValue="FFFFFF" style={{ flex: 1, marginLeft: 8 }} />
                        <input className={styles.input} defaultValue="100%" style={{ width: 48, marginLeft: 8 }} />
                    </div>

                    {/* Stroke Section */}
                    <div className={styles.propertyRow} style={{ marginTop: '24px' }}>
                        <div className={styles.sectionTitle} style={{ margin: 0 }}>Stroke</div>
                        <button className={styles.toolButton} style={{ width: 24, height: 24 }}><Plus size={14} /></button>
                    </div>

                    {/* Effects Section */}
                    <div className={styles.propertyRow} style={{ marginTop: '24px' }}>
                        <div className={styles.sectionTitle} style={{ margin: 0 }}>Effects</div>
                        <button className={styles.toolButton} style={{ width: 24, height: 24 }}><Plus size={14} /></button>
                    </div>
                    <div className={styles.propertyRow}>
                        <div className={styles.effectPreview} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Drop Shadow</span>
                            <button className={styles.toolButton} style={{ width: 20, height: 20 }}><Sun size={12} /></button>
                        </div>
                    </div>

                    {/* Export Section */}
                    <div className={styles.propertyRow} style={{ marginTop: '24px' }}>
                        <div className={styles.sectionTitle} style={{ margin: 0 }}>Export</div>
                        <button className={styles.toolButton} style={{ width: 24, height: 24 }}><Plus size={14} /></button>
                    </div>
                    <div className={styles.propertyRow}>
                        <button className={styles.input} style={{ justifyContent: 'center', cursor: 'pointer' }}>Export Slide 1</button>
                    </div>

                </aside>
            </div>
        </div>
    );
}

function ToolButton({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick: () => void }) {
    return (
        <button
            className={`${styles.toolButton} ${active ? styles.activeTool : ''}`}
            onClick={onClick}
        >
            <Icon size={20} />
        </button>
    )
}
