

import { useState } from 'react';
import {
    Play, MousePointer2, Type, Square, Image as ImageIcon,
    MoreHorizontal, LayoutGrid, AlignLeft, AlignCenter, AlignRight,
    Sun, User
} from 'lucide-react';
import { vars } from '../../styles/vars.css';
import * as styles from './SlidesPage.css';
import { Shell } from '../../components/layout/Shell';
import { Panel } from '../../components/layout/Panel';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { Select } from '../../components/ui/Select';

export function SlidesPage() {
    const [activeSlide, setActiveSlide] = useState(1);
    const [activeTool, setActiveTool] = useState('select');

    return (
        <Shell>
            <Shell.Navbar>
                <TopBar
                    left={
                        <div className={styles.headerTitleGroup}>
                            <div className={styles.figmaLogo}></div>
                            <span className={styles.displayTitle}>Untitled Presentation</span>
                        </div>
                    }
                    right={
                        <div className={styles.headerActionsGroup}>
                            <Button variant="ghost" size="icon" title="Present"><Play size={18} /></Button>
                            <Button variant="solid" color="primary" size="sm">Share</Button>
                            <Button variant="ghost" size="icon"><User size={18} /></Button>
                        </div>
                    }
                />
            </Shell.Navbar>

            <Shell.Sidebar>
                <Panel surface="base">
                    <Panel.Body>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div
                                key={num}
                                className={`${styles.thumbnailItem} ${activeSlide === num ? styles.activeThumbnail : ''}`}
                                onClick={() => setActiveSlide(num)}
                            />
                        ))}
                    </Panel.Body>
                </Panel>
            </Shell.Sidebar>

            <Shell.AuxPanel>
                <Panel surface="base" side="right">
                    <Panel.Body>
                        {/* Alignment Row */}
                        <div className={styles.alignmentToolbar}>
                            <Button variant="ghost" size="icon"><AlignLeft size={16} /></Button>
                            <Button variant="ghost" size="icon"><AlignCenter size={16} /></Button>
                            <Button variant="ghost" size="icon"><AlignRight size={16} /></Button>
                            <div className={styles.verticalSeparator} />
                            <Button variant="ghost" size="icon"><LayoutGrid size={16} /></Button>
                            <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                        </div>

                        {/* Layout Section */}
                        <Panel.Section label="Layout">
                            <div className={styles.propertyGrid}>
                                <span className={styles.label}>X</span>
                                <TextInput size="compact" defaultValue="1024" />
                                <span className={styles.label}>Y</span>
                                <TextInput size="compact" defaultValue="506" />
                            </div>
                            <div className={styles.propertyGrid}>
                                <span className={styles.label}>W</span>
                                <TextInput size="compact" defaultValue="1920" />
                                <span className={styles.label}>H</span>
                                <TextInput size="compact" defaultValue="1080" />
                            </div>
                            <div className={styles.propertyGrid}>
                                <span className={styles.label}>R</span>
                                <TextInput size="compact" defaultValue="0" />
                                <span className={styles.label}>°</span>
                                <TextInput size="compact" defaultValue="0" />
                            </div>
                        </Panel.Section>

                        {/* Layer Section */}
                        <Panel.Section label="Layer">
                            <div className={styles.propertyGrid}>
                                <span className={styles.label}>Op</span>
                                <TextInput size="compact" defaultValue="100%" />
                                <span className={styles.label}>Blend</span>
                                <TextInput size="compact" defaultValue="Normal" />
                            </div>
                        </Panel.Section>

                        {/* Typography Section */}
                        <Panel.Section label="Text">
                            <div className={styles.propertyRow}>
                                <div style={{ flex: 2 }}>
                                    <TextInput size="compact" defaultValue="Inter" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Select size="compact">
                                        <option>Regular</option>
                                        <option>Medium</option>
                                        <option>Bold</option>
                                    </Select>
                                </div>
                            </div>
                            <div className={styles.propertyGrid}>
                                <TextInput size="compact" defaultValue="16" />
                                <Select size="compact" defaultValue="Auto">
                                    <option>Auto</option>
                                    <option>1.2</option>
                                    <option>1.5</option>
                                </Select>
                            </div>
                            <div className={styles.propertyGrid}>
                                <TextInput size="compact" defaultValue="0%" title="Letter Spacing" />
                                <TextInput size="compact" defaultValue="0" title="Paragraph Spacing" />
                            </div>
                            <div className={styles.iconButtonRow}>
                                <Button variant="ghost" size="icon"><AlignLeft size={14} /></Button>
                                <Button variant="ghost" size="icon"><AlignCenter size={14} /></Button>
                                <Button variant="ghost" size="icon"><AlignRight size={14} /></Button>
                                <div style={{ flex: 1 }} />
                                <Button variant="ghost" size="icon"><AlignLeft size={14} /></Button>
                            </div>
                        </Panel.Section>

                        {/* Fill Section */}
                        <Panel.Section label="Fill">
                            <div className={styles.propertyRow}>
                                <div className={styles.colorPreview} />
                                <div style={{ flex: 1 }}>
                                    <TextInput size="compact" defaultValue="FFFFFF" />
                                </div>
                                <div style={{ width: 48 }}>
                                    <TextInput size="compact" defaultValue="100%" />
                                </div>
                            </div>
                        </Panel.Section>

                        {/* Effects Section */}
                        <Panel.Section label="Effects">
                            <div className={styles.propertyRow}>
                                <div className={styles.effectPreview}>
                                    <span>Drop Shadow</span>
                                    <Button variant="ghost" size="icon"><Sun size={12} /></Button>
                                </div>
                            </div>
                        </Panel.Section>

                        {/* Export Section */}
                        <Panel.Section label="Export">
                            <div className={styles.propertyRow}>
                                <Button variant="outline" size="sm" style={{ width: '100%' }}>Export Slide 1</Button>
                            </div>
                        </Panel.Section>
                    </Panel.Body>
                </Panel>
            </Shell.AuxPanel>

            <Shell.Main>
                {/* Center Canvas Area */}
                <div className={styles.canvasContainer}>
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
                </div>
            </Shell.Main>
        </Shell>
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


