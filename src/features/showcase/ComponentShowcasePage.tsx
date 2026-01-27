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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '../../components/ui/Table';
import { prose } from '../../styles/prose.css';
import { Mail, Lock } from 'lucide-react';

export default function ComponentShowcasePage() {
    const [switchVal, setSwitchVal] = useState(false);
    const [checkVal, setCheckVal] = useState(false);
    const [radioVal, setRadioVal] = useState('option1');
    const [segVal, setSegVal] = useState('daily');
    const [textVal, setTextVal] = useState('');
    const [searchVal, setSearchVal] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Component Showcase</h1>
                    <p className={styles.subtitle}>
                        A collection of reusable form components built with Vanilla Extract.
                    </p>
                </header>

                <h2 className={styles.sectionTitle}>Form Elements</h2>
                <div className={styles.grid}>
                    {/* Switch Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Switch</h2>
                        <div className={styles.componentRow}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Switch checked={switchVal} onCheckedChange={setSwitchVal} />
                                    <span className={styles.label}>{switchVal ? 'On' : 'Off'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Switch disabled checked={true} />
                                    <span className={styles.label}>Disabled On</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Checkbox checked={checkVal} onCheckedChange={setCheckVal} />
                                    <span className={styles.label}>{checkVal ? 'Checked' : 'Unchecked'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <RadioGroupItem value="option1" id="r1" />
                                <label htmlFor="r1" className={styles.label}>Default</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <RadioGroupItem value="option2" id="r2" />
                                <label htmlFor="r2" className={styles.label}>Comfortable</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                    <div className={styles.card} style={{ gridColumn: 'span 2' }}>
                        <h2 className={styles.cardTitle}>Text Input</h2>
                        <div style={{ display: 'grid', gap: 16 }}>
                            <TextInput
                                placeholder="Standard Input"
                                value={textVal}
                                onChange={(e) => setTextVal(e.target.value)}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <TextInput
                                    placeholder="With Icon"
                                    leftIcon={<Mail size={16} />}
                                />
                                <TextInput
                                    type="password"
                                    placeholder="With Right Icon"
                                    rightIcon={<Lock size={16} />}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <TextInput size="dense" placeholder="Dense Input" />
                                <TextInput error placeholder="Error State" defaultValue="Invalid Value" />
                            </div>
                            <TextInput disabled placeholder="Disabled Input" />
                        </div>
                    </div>

                    {/* Search & Select Section */}
                    <div className={styles.card} style={{ gridColumn: 'span 2' }}>
                        <h2 className={styles.cardTitle}>Search & Select</h2>
                        <div style={{ display: 'grid', gap: 16 }}>
                            <SearchBar
                                placeholder="Search users..."
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onClear={() => setSearchVal('')}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                        </div>
                    </div>

                </div>

            </div>

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
                </div>

                <div className={styles.card} style={{ gridColumn: 'span 2' }}>
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

            <h2 className={styles.sectionTitle}>Typography</h2>
            <div className={styles.grid}>
                <div className={styles.card} style={{ gridColumn: 'span 2' }}>
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
}`}
                        </code></pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
