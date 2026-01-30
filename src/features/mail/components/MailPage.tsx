import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EmailList } from './EmailList';
import type { Email } from './EmailList';
import { EmailReader } from './EmailReader';
import * as styles from './MailPage.css';
import { Shell } from '../../../components/layout/Shell';
import { PanelGroup, Panel, PanelHandle } from '../../../components/ui/Resizable';

export function MailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter only emails from 'Inbox' for the count
    const inboxEmails = emails.filter(e => e.sender === 'Inbox');

    useEffect(() => {
        const loadEmails = async () => {
            const modules = import.meta.glob(['/docs/inbox/*.md', '/docs/prd/*.md']);
            const paths = Object.keys(modules);

            const loadedEmails = await Promise.all(paths.map(async (path) => {
                try {
                    const res = await fetch(path);
                    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
                    const text = await res.text();
                    const lastMod = res.headers.get('Last-Modified');
                    const dateObj = lastMod ? new Date(lastMod) : new Date();

                    const titleMatch = text.match(/^#\s+(.+)$/m);
                    const filename = path.split('/').pop()?.replace('.md', '') || 'Doc';
                    const subject = titleMatch ? titleMatch[1] : filename.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                    const rawBody = text.replace(/^#\s+.+$/m, '').trim();
                    const snippet = rawBody.replace(/[#*`]/g, '').slice(0, 120).replace(/\n/g, ' ') + '...';
                    const sender = path.includes('/prd/') ? 'Product Team' : 'Inbox';

                    return {
                        id: filename,
                        sender: sender,
                        subject: subject,
                        snippet: snippet || 'No preview available',
                        date: dateObj.toLocaleDateString(),
                        isRead: false,
                        isStarred: path.includes('benchmark'),
                        rawContent: text,
                        timestamp: dateObj.getTime()
                    } as Email;
                } catch (e) {
                    console.error('Loader error', e);
                    return null;
                }
            }));

            const validEmails = loadedEmails.filter((e): e is Email => e !== null);
            validEmails.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setEmails(validEmails);
            setLoading(false);
        };

        loadEmails();
    }, []);

    const selectedEmail = emails.find(e => e.id === id);

    const handleEmailSelect = (email: Email) => {
        navigate(`/mail/${email.id}`);
    };

    const handleBack = () => {
        navigate('/mail');
    };

    return (
        <Shell>
            <Shell.Navbar>
                <Header />
            </Shell.Navbar>

            <Shell.Main>
                <PanelGroup direction="horizontal">
                    <Panel id="mail-sidebar" defaultSize={20}>
                        <Sidebar inboxCount={inboxEmails.length} />
                    </Panel>

                    <PanelHandle id="handle-0" />

                    <Panel id="mail-content" defaultSize={80}>
                        <div className={styles.mailContent}>
                            {loading ? (
                                <div style={{ padding: '20px', color: '#888' }}>Loading...</div>
                            ) : selectedEmail ? (
                                <EmailReader
                                    email={selectedEmail}
                                    onBack={handleBack}
                                />
                            ) : (
                                <EmailList
                                    initialEmails={emails}
                                    onEmailSelect={handleEmailSelect}
                                />
                            )}
                        </div>
                    </Panel>
                </PanelGroup>
            </Shell.Main>
        </Shell>
    );
}
