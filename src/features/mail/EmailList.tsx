import { useState, useEffect } from 'react';
import { EmailRow } from './EmailRow';
import * as styles from './EmailList.css';

export interface Email {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    date: string;
    isRead: boolean;
    isStarred: boolean;
    selected?: boolean;
    rawContent?: string; // Full markdown content
}

export function EmailList({ onEmailSelect }: { onEmailSelect?: (email: Email) => void }) {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmails = async () => {
            // Get list of file paths only. 
            // We use standard glob without eager, or with eager + query: '?url' which often returns paths in Vite.
            // But standard lazy glob returns map of functions. Keys are paths.
            const modules = import.meta.glob('/docs/inbox/*.md');
            const paths = Object.keys(modules);

            const loadedEmails = await Promise.all(paths.map(async (path, index) => {
                try {
                    // Fetch raw content at runtime from the dev server
                    // This treats the file as a static asset, bypassing the import transformation pipeline
                    const res = await fetch(path);
                    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
                    const text = await res.text();

                    // Basic Runtime Parsing
                    // 1. Title: # Title
                    const titleMatch = text.match(/^#\s+(.+)$/m);
                    const filename = path.split('/').pop()?.replace('.md', '') || 'Doc';
                    const subject = titleMatch ? titleMatch[1] : filename.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');;

                    // 2. Snippet: Body text
                    const rawBody = text.replace(/^#\s+.+$/m, '').trim();
                    const snippet = rawBody.replace(/[#*`]/g, '').slice(0, 120).replace(/\n/g, ' ') + '...';

                    return {
                        id: `doc-${index}`,
                        sender: 'Docs Team',
                        subject: subject,
                        snippet: snippet || 'No preview available',
                        date: 'Today',
                        isRead: false,
                        isStarred: path.includes('benchmark'),
                        rawContent: text, // Store full content
                    } as Email;
                } catch (e) {
                    console.error('Failed to load', path, e);
                    return null;
                }
            }));

            setEmails(loadedEmails.filter((e): e is Email => e !== null));
            setLoading(false);
        };

        loadEmails();
    }, []);

    const toggleSelect = (id: string) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
    };

    if (loading) {
        return <div style={{ padding: '20px', color: '#888' }}>Loading inbox...</div>;
    }

    return (
        <div className={styles.listContainer}>
            {/* Header Row */}
            <div className={styles.headerRow}>
                <div className={styles.headerCell}></div>
                <div className={styles.headerCell}></div>
                <div className={styles.headerCell}>From</div>
                <div className={styles.headerCell}>Subject</div>
                <div className={styles.headerCell}>Date</div>
            </div>

            {emails.map(email => (
                <EmailRow
                    key={email.id}
                    data={email}
                    onToggleSelect={() => toggleSelect(email.id)}
                    onClick={() => onEmailSelect && onEmailSelect(email)}
                />
            ))}
        </div>
    );
}
