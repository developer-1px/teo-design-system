import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EmailList } from './EmailList';
import type { Email } from './EmailList';
import { EmailReader } from './EmailReader';
import * as styles from './MailPage.css';

export function MailPage() {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

    return (
        <div className={styles.mailLayout}>
            <Header />
            <Sidebar />
            <main className={styles.mailContent}>
                {selectedEmail ? (
                    <EmailReader
                        email={selectedEmail}
                        onBack={() => setSelectedEmail(null)}
                    />
                ) : (
                    <EmailList onEmailSelect={setSelectedEmail} />
                )}
            </main>
        </div>
    );
}
