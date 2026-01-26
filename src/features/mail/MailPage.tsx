import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EmailList } from './EmailList';
import * as styles from './MailPage.css';

export function MailPage() {
    return (
        <div className={styles.mailLayout}>
            <Header />
            <Sidebar />
            <main className={styles.mailContent}>
                <EmailList />
            </main>
        </div>
    );
}
