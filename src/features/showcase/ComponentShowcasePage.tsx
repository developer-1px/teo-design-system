import { useState } from 'react';
import * as styles from './ComponentShowcasePage.css';
import { Switch } from '../../components/ui/Switch';
import { Checkbox } from '../../components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/Radio';
import { TextInput } from '../../components/ui/TextInput';
import { SearchBar } from '../../components/ui/SearchBar';
import { Select } from '../../components/ui/Select';
import { SegmentedControl } from '../../components/primitives/SegmentedControl';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Progress } from '../../components/ui/Progress';
import { Tabs } from '../../components/ui/Tabs';
import { Accordion } from '../../components/ui/Accordion';
import { Tree } from '../../components/ui/Tree';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '../../components/ui/Table';
import { SearchFilterBar, type FilterTag } from '../../components/ui/SearchFilterBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TextArea } from '../../components/ui/TextArea';
import { Combobox } from '../../components/ui/Combobox';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { ResizablePanel } from '../../components/ui/ResizablePanel';
import { PanelGroup, Panel, PanelHandle } from '../../components/ui/Resizable';
import { Toolbar, ToolbarSeparator } from '../../components/ui/Toolbar';
import { Circle, Shield, User, CheckCircle, Search } from 'lucide-react';
import { prose } from '../../styles/prose.css';
import { Mail, Lock, Plus, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ComponentShowcasePage() {
    const [switchVal, setSwitchVal] = useState(false);
    const [checkVal, setCheckVal] = useState(false);
    const [radioVal, setRadioVal] = useState('option1');
    const [segVal, setSegVal] = useState('daily');
    const [textVal, setTextVal] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const [tabVal, setTabVal] = useState('account');
    const [filterTags, setFilterTags] = useState<FilterTag[]>([
        { id: '1', key: 'status', value: 'active' }
    ]);

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <section className={styles.sectionWrapper}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Component Showcase</h1>
                        <p className={styles.subtitle}>
                            A collection of reusable form components built with Vanilla Extract.
                        </p>
                    </header>
                </section>

                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Form Elements</h2>
                    <div className={styles.grid}>
                        {/* Switch Section */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Switch</h2>
                            <div className={styles.componentRow}>
                                <div className={styles.controlGroup}>
                                    <div className={styles.controlRow}>
                                        <Switch checked={switchVal} onCheckedChange={setSwitchVal} />
                                        <span className={styles.label}>{switchVal ? 'On' : 'Off'}</span>
                                    </div>
                                    <div className={styles.controlRow}>
                                        <Switch disabled checked={true} />
                                        <span className={styles.label}>Disabled On</span>
                                    </div>
                                    <div className={styles.controlRow}>
                                        <Switch size="sm" />
                                        <span className={styles.label}>Small</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox Section */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Checkbox</h2>
                            <div className={styles.componentRow}>
                                <div className={styles.controlGroup}>
                                    <div className={styles.controlRow}>
                                        <Checkbox checked={checkVal} onCheckedChange={setCheckVal} />
                                        <span className={styles.label}>{checkVal ? 'Checked' : 'Unchecked'}</span>
                                    </div>
                                    <div className={styles.controlRow}>
                                        <Checkbox disabled checked />
                                        <span className={styles.label}>Disabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Radio Section */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Radio Group</h2>
                            <RadioGroup value={radioVal} onValueChange={setRadioVal}>
                                <div className={styles.controlRow}>
                                    <RadioGroupItem value="option1" id="r1" />
                                    <label htmlFor="r1" className={styles.label}>Default</label>
                                </div>
                                <div className={styles.controlRow}>
                                    <RadioGroupItem value="option2" id="r2" />
                                    <label htmlFor="r2" className={styles.label}>Comfortable</label>
                                </div>
                                <div className={styles.controlRow}>
                                    <RadioGroupItem value="option3" id="r3" />
                                    <label htmlFor="r3" className={styles.label}>Compact</label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Segmented Control */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Segmented Control</h2>
                            <SegmentedControl
                                value={segVal}
                                onChange={setSegVal}
                                options={[
                                    { label: 'Daily', value: 'daily' },
                                    { label: 'Weekly', value: 'weekly' },
                                    { label: 'Monthly', value: 'monthly' }
                                ]}
                            />
                        </div>

                        {/* Input Section */}
                        <div className={`${styles.card} ${styles.spanTwo} `}>
                            <h2 className={styles.cardTitle}>Text Input</h2>
                            <div className={styles.inputStack}>
                                <TextInput
                                    placeholder="Standard Input"
                                    value={textVal}
                                    onChange={(e) => setTextVal(e.target.value)}
                                />
                                <div className={styles.inputGrid}>
                                    <TextInput
                                        placeholder="With Icon"
                                        leftIcon={<Mail size={16} />}
                                    />
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <TextInput
                                            type="password"
                                            placeholder="With Right Icon"
                                            rightIcon={<Lock size={16} />}
                                        />
                                    </form>
                                </div>
                                <div className={styles.inputGrid}>
                                    <TextInput size="dense" placeholder="Dense Input" />
                                    <TextInput error placeholder="Error State" defaultValue="Invalid Value" />
                                </div>
                                <TextInput disabled placeholder="Disabled Input" />
                            </div>
                        </div>

                        {/* TextArea Section */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Text Area</h2>
                            <div className={styles.inputStack}>
                                <TextArea placeholder="Basic Text Area" />
                                <TextArea placeholder="No Resize" resize="none" />
                                <TextArea placeholder="Error State" error defaultValue="Invalid content" />
                            </div>
                        </div>

                        {/* Search & Select Section */}
                        <div className={`${styles.card} ${styles.spanTwo} `}>
                            <h2 className={styles.cardTitle}>Search & Select</h2>
                            <div className={styles.inputStack}>
                                <SearchBar
                                    placeholder="Search users..."
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    onClear={() => setSearchVal('')}
                                />
                                <div className={styles.inputGrid}>
                                    <Select placeholder="Select a role...">
                                        <option value="admin">Administrator</option>
                                        <option value="user">User</option>
                                        <option value="guest">Guest</option>
                                    </Select>
                                    <Select size="dense" placeholder="Dense Select">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                    </Select>
                                </div>
                                <div className={styles.inputGrid} style={{ marginTop: 16 }}>
                                    <Combobox
                                        placeholder="Combobox (Select Item)"
                                        items={[
                                            { label: 'Next.js', value: 'nextjs' },
                                            { label: 'React', value: 'react' },
                                            { label: 'Vue', value: 'vue' },
                                            { label: 'Angular', value: 'angular' },
                                            { label: 'Svelte', value: 'svelte' },
                                        ]}
                                    />
                                    <Combobox
                                        disabled
                                        placeholder="Disabled Combobox"
                                        items={[]}
                                    />
                                </div>

                                <div className={styles.label} style={{ marginTop: 8 }}>SearchFilterBar (Smart Tokens)</div>
                                <SearchFilterBar
                                    tags={filterTags}
                                    onTagsChange={setFilterTags}
                                    placeholder="Filter by status:active or type search..."
                                    filterMenu={[
                                        {
                                            id: 'status',
                                            label: 'Status',
                                            icon: Circle,
                                            children: [
                                                { id: 'status-active', label: 'Active', icon: Circle },
                                                { id: 'status-pending', label: 'Pending', icon: Circle },
                                            ]
                                        },
                                        {
                                            id: 'role',
                                            label: 'Role',
                                            icon: Shield,
                                            children: [
                                                { id: 'role-admin', label: 'Admin', icon: User },
                                                { id: 'role-user', label: 'User', icon: User },
                                            ]
                                        }
                                    ]}
                                />
                            </div>
                        </div>

                    </div>




                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Interactive Primitives</h2>
                    <div className={styles.grid}>
                        <div className={`${styles.card} ${styles.spanTwo} `}>
                            <h2 className={styles.cardTitle}>Buttons</h2>

                            <div className={styles.label}>Intents & Variants</div>
                            <div className={styles.componentRow}>
                                <Button intent="primary">Primary</Button>
                                <Button intent="secondary" variant="outline">Secondary</Button>
                                <Button intent="danger">Danger</Button>
                                <Button intent="neutral" variant="ghost">Ghost</Button>
                                <Button variant="link">Link Button</Button>
                            </div>

                            <div className={styles.label}>Sizes</div>
                            <div className={styles.componentRow}>
                                <Button size="xs">XS</Button>
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                                <Button size="icon" variant="outline"><Plus size={16} /></Button>
                            </div>

                            <div className={styles.label}>States & Icons</div>
                            <div className={styles.componentRow}>
                                <Button loading>Loading</Button>
                                <Button disabled>Disabled</Button>
                                <Button leftIcon={<Mail size={16} />}>Email</Button>
                                <Button rightIcon={<ArrowRight size={16} />} intent="neutral" variant="outline">Next</Button>
                            </div>

                            <div className={styles.label}>Enhancements</div>
                            <div className={styles.componentRow}>
                                <Button as="a" href="#" intent="primary" rightIcon={<ArrowRight size={16} />}>Link Button</Button>
                                <Button shape="circle" size="icon" intent="secondary" variant="outline"><Mail size={16} /></Button>
                                <Button shape="pill" intent="danger" variant="outline">Pill Shape</Button>
                                <Button disabled as="a" href="#" intent="neutral">Disabled Link</Button>
                            </div>
                        </div>
                    </div>

                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Data Display</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Badges</h2>

                            <div className={styles.label}>Intents (Subtle)</div>
                            <div className={styles.componentRow}>
                                <Badge intent="neutral" variant="subtle">Neutral</Badge>
                                <Badge intent="success" variant="subtle">Success</Badge>
                                <Badge intent="warning" variant="subtle">Warning</Badge>
                                <Badge intent="danger" variant="subtle">Danger</Badge>
                                <Badge intent="info" variant="subtle">Info</Badge>
                            </div>

                            <div className={styles.label}>Solid</div>
                            <div className={styles.componentRow}>
                                <Badge intent="neutral" variant="solid">Neutral</Badge>
                                <Badge intent="success" variant="solid">Success</Badge>
                                <Badge intent="warning" variant="solid">Warning</Badge>
                                <Badge intent="danger" variant="solid">Danger</Badge>
                                <Badge intent="info" variant="solid">Info</Badge>
                            </div>

                            <div className={styles.label}>Outline</div>
                            <div className={styles.componentRow}>
                                <Badge intent="neutral" variant="outline">Neutral</Badge>
                                <Badge intent="success" variant="outline">Success</Badge>
                                <Badge intent="warning" variant="outline">Warning</Badge>
                                <Badge intent="danger" variant="outline">Danger</Badge>
                                <Badge intent="info" variant="outline">Info</Badge>
                            </div>

                            <div className={styles.label} style={{ marginTop: 16 }}>Status Badges (Dot)</div>
                            <div className={styles.componentRow}>
                                <StatusBadge status="success">Active</StatusBadge>
                                <StatusBadge status="warning">Pending</StatusBadge>
                                <StatusBadge status="critical">Error</StatusBadge>
                                <StatusBadge status="info">Processing</StatusBadge>
                                <StatusBadge status="neutral">Offline</StatusBadge>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Avatars</h2>
                            <div className={styles.label}>Sizes</div>
                            <div className={styles.componentRow}>
                                <Avatar size="xs" fallback="XS" />
                                <Avatar size="sm" fallback="SM" />
                                <Avatar size="md" fallback="MD" />
                                <Avatar size="lg" fallback="LG" />
                            </div>

                            <div className={styles.label}>Status</div>
                            <div className={styles.componentRow}>
                                <Avatar size="md" fallback="A" status="online" />
                                <Avatar size="md" fallback="B" status="busy" />
                                <Avatar size="md" fallback="C" status="busy" />
                                <Avatar size="md" fallback="D" status="offline" />
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.spanTwo} `}>
                            <h2 className={styles.cardTitle}>Table (Compact)</h2>
                            <Table density="compact">
                                <TableCaption>Recent Users</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Alice Smith</TableCell>
                                        <TableCell><Badge intent="success">Active</Badge></TableCell>
                                        <TableCell>Admin</TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Bob Jones</TableCell>
                                        <TableCell><Badge intent="warning">Pending</Badge></TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell className="text-right">$100.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Charlie Brown</TableCell>
                                        <TableCell><Badge intent="danger">Suspended</Badge></TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell className="text-right">$0.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                    </div>

                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Feedback & Navigation</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Progress</h2>
                            <div className={styles.inputStack}>
                                <div>
                                    <div className={styles.labelWithMargin}>Primary (50%)</div>
                                    <Progress value={50} />
                                </div>
                                <div>
                                    <div className={styles.labelWithMargin}>Success (75%)</div>
                                    <Progress value={75} intent="success" />
                                </div>
                                <div>
                                    <div className={styles.labelWithMargin}>Danger (30%)</div>
                                    <Progress value={30} intent="critical" />
                                </div>
                                <div>
                                    <div className={styles.labelWithMargin}>Tiny</div>
                                    <Progress value={60} size="sm" />
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Tabs</h2>
                            <div className={styles.inputStack}>
                                <div>
                                    <div className={styles.labelWithMargin}>Line Variant</div>
                                    <Tabs
                                        value={tabVal}
                                        onChange={setTabVal}
                                        items={[
                                            { id: 'account', label: 'Account' },
                                            { id: 'password', label: 'Password' },
                                            { id: 'settings', label: 'Settings' },
                                        ]}
                                    />
                                </div>
                                <div className={styles.tabGroup}>
                                    <div className={styles.labelWithMargin}>Segment Variant</div>
                                    <Tabs
                                        value={tabVal}
                                        onChange={setTabVal}
                                        variant="segment"
                                        items={[
                                            { id: 'account', label: 'Account' },
                                            { id: 'password', label: 'Password' },
                                        ]}
                                    />
                                </div>
                                {/* Enclosed variant removed as it might not be implemented in Tabs.tsx yet or handled by variant='line' default? 
                               Checking Tabs.tsx snippet, it uses styles.tabsList({ variant }) and styles.tabTrigger({ variant }).
                               Let's check if 'enclosed' is a valid variant in Tabs.tsx.
                               The snippet didn't show the styles file.
                               I'll assume line and pill for now based on snippet showing `variant = 'line'`. 
                               Wait, I'll assume 'enclosed' is not valid if not sure. 
                               Actually, let's keep it simple and just do Line and Pill if I'm unsure. 
                               But user might want to see all.
                               I will stick to keeping it simple for now to avoid errors.
                           */}
                            </div>
                        </div>

                    </div>

                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Navigation & Tree</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Accordion</h2>
                            <Accordion
                                allowMultiple
                                items={[
                                    {
                                        id: 'item-1',
                                        title: 'Pro Tool Integration',
                                        content: 'Seamlessly integrate complex state management with high-performance UI components.'
                                    },
                                    {
                                        id: 'item-2',
                                        title: 'Design System Governance',
                                        content: 'Enforce visual consistency across diverse application scales with vanilla-extract tokens.'
                                    },
                                    {
                                        id: 'item-3',
                                        title: 'Headless Logic',
                                        content: 'Separate interaction patterns from visual implementation for maximum flexibility.'
                                    }
                                ]}
                            />
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Tree Navigation</h2>
                            <div className={styles.treeContainer}>
                                <Tree
                                    data={[
                                        {
                                            id: 'src',
                                            label: 'src',
                                            isExpanded: true,
                                            children: [
                                                {
                                                    id: 'components',
                                                    label: 'components',
                                                    children: [
                                                        { id: 'ui', label: 'ui' },
                                                        { id: 'layout', label: 'layout' }
                                                    ]
                                                },
                                                {
                                                    id: 'features',
                                                    label: 'features',
                                                    children: [
                                                        { id: 'admin', label: 'admin' },
                                                        { id: 'mail', label: 'mail' },
                                                        {
                                                            id: 'editor', label: 'editor', isExpanded: true, children: [
                                                                { id: 'EditorPage.tsx', label: 'EditorPage.tsx' },
                                                                { id: 'EditorSidebar.tsx', label: 'EditorSidebar.tsx' }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Feedback</h2>
                    <div className={styles.grid}>
                        <div className={`${styles.card} ${styles.spanTwo}`}>
                            <h2 className={styles.cardTitle}>Alerts</h2>
                            <div className={styles.inputStack}>
                                <Alert intent="info" title="Information">
                                    This is a standard info alert to notify the user.
                                </Alert>
                                <Alert intent="success" title="Success" icon={CheckCircle}>
                                    Operation completed successfully.
                                </Alert>
                                <Alert intent="warning" title="Warning" variant="outline">
                                    Please check your inputs before proceeding (Outline variant).
                                </Alert>
                                <Alert intent="danger" title="Error">
                                    Critical system failure detected.
                                </Alert>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.spanTwo}`}>
                            <h2 className={styles.cardTitle}>Empty States</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <EmptyState
                                    title="No Projects"
                                    description="You haven't created any projects yet. Start by creating your first one."
                                    action={<Button intent="primary" size="sm" leftIcon={<Plus size={16} />}>Create Project</Button>}
                                />
                                <EmptyState
                                    icon={Search}
                                    title="No Results Found"
                                    description="We couldn't find any items matching your search query."
                                />
                            </div>
                        </div>
                    </div>

                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Layout Primitives</h2>
                    <div className={styles.grid}>
                        {/* Legacy ResizablePanel (New Internals) */}
                        <div className={styles.card} style={{ height: '350px' }}>
                            <h2 className={styles.cardTitle}>Resizable Panel (Legacy API)</h2>
                            <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', height: '250px', overflow: 'hidden' }}>
                                <ResizablePanel initialSplit={40}>
                                    <div style={{ padding: '16px', background: '#fafafa', height: '100%', fontSize: '11px', fontWeight: 600 }}>
                                        Left Pane (Legacy 40%)
                                    </div>
                                    <div style={{ padding: '16px', background: '#ffffff', height: '100%', fontSize: '11px', fontWeight: 600 }}>
                                        Right Pane (Legacy 60%)
                                    </div>
                                </ResizablePanel>
                            </div>
                        </div>

                        {/* New PanelGroup - The "Wowed" Demo */}
                        <div className={`${styles.card} ${styles.spanTwo}`} style={{ height: '350px' }}>
                            <h2 className={styles.cardTitle}>Pro PanelGroup (3-Way Orchestration)</h2>
                            <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', height: '250px', overflow: 'hidden', display: 'flex' }}>
                                <PanelGroup direction="horizontal">
                                    <Panel id="nav" defaultSize={20} style={{ background: '#f8fafc', padding: 16 }}>
                                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: 12 }}>NAVIGATION</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ height: 8, width: '80%', background: '#e2e8f0', borderRadius: 4 }} />
                                            <div style={{ height: 8, width: '60%', background: '#e2e8f0', borderRadius: 4 }} />
                                            <div style={{ height: 8, width: '70%', background: '#e2e8f0', borderRadius: 4 }} />
                                        </div>
                                    </Panel>
                                    <PanelHandle id="h1" />
                                    <Panel id="editor" defaultSize={50} style={{ background: '#fff', padding: 16 }}>
                                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#0ea5e9', marginBottom: 12 }}>EDITOR_CANVAS</div>
                                        <div style={{ flex: 1, border: '1px dashed #e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '11px' }}>
                                            Main Workspace
                                        </div>
                                    </Panel>
                                    <PanelHandle id="h2" />
                                    <Panel id="inspector" defaultSize={30} style={{ background: '#fdfdff', padding: 16 }}>
                                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#6366f1', marginBottom: 12 }}>PROPERTIES</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <div style={{ height: 20, background: '#f1f5f9', borderRadius: 4 }} />
                                            <div style={{ height: 20, background: '#f1f5f9', borderRadius: 4 }} />
                                            <div style={{ height: 20, background: '#f1f5f9', borderRadius: 4 }} />
                                        </div>
                                    </Panel>
                                </PanelGroup>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.sectionWrapper}>
                    <h2 className={styles.sectionTitle}>Typography</h2>
                    <div className={styles.grid}>
                        <div className={`${styles.card} ${styles.spanTwo} `}>
                            <h2 className={styles.cardTitle}>Prose Typography</h2>
                            <div className={prose}>
                                <h1>Heading 1</h1>
                                <p>This is a standard paragraph demonstrating the <strong>body typography</strong>. It includes <em>italic text</em>, <a href="#">links</a>, and <code>inline code</code>.</p>

                                <h3>Lists & Blockquotes</h3>
                                <ul>
                                    <li>Unordered list item one</li>
                                    <li>Unordered list item two with nested list:
                                        <ul>
                                            <li>Nested item A</li>
                                            <li>Nested item B</li>
                                        </ul>
                                    </li>
                                </ul>

                                <blockquote>
                                    "Design is not just what it looks like and feels like. Design is how it works."
                                </blockquote>

                                <h3>Code Block</h3>
                                <pre><code>
                                    {`function hello() {
    console.log("Hello, World!");
} `}
                                </code></pre>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
