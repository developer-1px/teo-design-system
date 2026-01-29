import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import * as styles from './EmailReader.css';
import type { Email } from './EmailList';

interface EmailReaderProps {
    email: Email;
    onBack: () => void;
}

export function EmailReader({ email, onBack }: EmailReaderProps) {
    return (
        <div className={styles.readerContainer}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <button className={styles.backButton} onClick={onBack}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ flex: 1 }}></div>
                {/* Actions could go here (Archive, Delete, Reply) */}
            </div>

            {/* Content Scroller */}
            <div className={styles.scrollArea}>
                {/* Email Header */}
                <h1 className={styles.title}>{email.subject}</h1>

                <div className={styles.metaInfo}>
                    <div style={{ fontWeight: 600 }}>{email.sender}</div>
                    <div style={{ color: '#aaa' }}>to me</div>
                    <div style={{ marginLeft: 'auto', fontSize: '13px' }}>{email.date}</div>
                </div>

                {/* Markdown Content */}
                <div className={styles.markdownBody}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {email.rawContent || email.snippet}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
