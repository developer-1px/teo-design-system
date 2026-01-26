import { useState } from 'react';
import { EmailRow } from './EmailRow';
import * as styles from './EmailList.css';

interface Email {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    date: string;
    isRead: boolean;
    isStarred: boolean;
    selected?: boolean;
}

// Mock Data
const INITIAL_EMAILS: Email[] = [
    { id: '1', sender: 'Figma Team', subject: 'Figma Config 2025', snippet: 'Join us for the biggest design conference...', date: '9:41 AM', isRead: false, isStarred: true },
    { id: '2', sender: 'Linear', subject: 'Cycle 12 Summary', snippet: 'The team completed 45 issues this cycle.', date: 'Yesterday', isRead: true, isStarred: false },
    { id: '3', sender: 'Vercel', subject: 'Deployment Successful', snippet: 'project-fusion-hypernova has been deployed.', date: 'Jan 24', isRead: true, isStarred: false },
    { id: '4', sender: 'Gemini', subject: 'Your weekly insight', snippet: 'You have been more productive this week...', date: 'Jan 22', isRead: false, isStarred: false },
    { id: '5', sender: 'GitHub', subject: 'Security Alert', snippet: 'A new vulnerability was found in dependencies...', date: 'Jan 20', isRead: false, isStarred: true },
    // Fillers
    ...Array.from({ length: 15 }).map((_, i) => ({
        id: `f${i}`,
        sender: `Newsletter ${i}`,
        subject: `Weekly Update #${i}`,
        snippet: 'Lorem ipsum dolor sit amet...',
        date: 'Jan 10',
        isRead: true,
        isStarred: false
    }))
];

export function EmailList() {
    const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);

    const toggleSelect = (id: string) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
    };

    return (
        <div className={styles.listContainer}>
            {emails.map(email => (
                <EmailRow
                    key={email.id}
                    data={email}
                    onToggleSelect={() => toggleSelect(email.id)}
                />
            ))}
        </div>
    );
}
