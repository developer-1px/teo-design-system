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
    timestamp?: number;
}

export function EmailList({
    initialEmails = [],
    onEmailSelect
}: {
    initialEmails?: Email[],
    onEmailSelect?: (email: Email) => void
}) {
    const [emails, setEmails] = useState<Email[]>(initialEmails);

    useEffect(() => {
        setEmails(initialEmails);
    }, [initialEmails]);

    const toggleSelect = (id: string) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
    };

    return (
        <div className={styles.listContainer}>
            {/* Header Row */}
            <div className={styles.headerRow}>
                <div className={styles.headerCell}></div>
                <div className={styles.headerCell}></div>
                <div className={styles.headerCell}>From</div>
                <div className={styles.headerCell}>Subject</div>
                <div className={styles.dateHeaderCell}>Date</div>
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
