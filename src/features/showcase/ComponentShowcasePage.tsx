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

import { Mail, Lock, Plus, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
                    <div className={`${styles.card} ${styles.spanTwo}`}>
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
                                <TextInput
                                    type="password"
                                    placeholder="With Right Icon"
                                    rightIcon={<Lock size={16} />}
                                />
                            </div>
                            <div className={styles.inputGrid}>
                                <TextInput size="dense" placeholder="Dense Input" />
                                <TextInput error placeholder="Error State" defaultValue="Invalid Value" />
                            </div>
                            <TextInput disabled placeholder="Disabled Input" />
                        </div>
                    </div>

                    {/* Search & Select Section */}
                    <div className={`${styles.card} ${styles.spanTwo}`}>
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
                        </div>
                    </div>

                </div>




                <h2 className={styles.sectionTitle}>Interactive Primitives</h2>
                <div className={styles.grid}>
                    <div className={`${styles.card} ${styles.spanTwo}`}>
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

                    <div className={`${styles.card} ${styles.spanTwo}`}>
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
                    <div className={`${styles.card} ${styles.spanTwo}`}>
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
        </div>
    );
}
