import { useState } from 'react';
import * as styles from './ApiDocsLayout.css.ts';
import { Play, ChevronDown } from 'lucide-react';

export const InteractionConsole = () => {
    const [method] = useState('POST');
    const [url, setUrl] = useState('https://api.example.com/v1/users/create');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1200); // Fake network delay
    };

    return (
        <div className={styles.consoleContainer}>
            <div className={styles.consoleHeader}>
                <div className={styles.methodSelector}>
                    <span className={styles.methodBadge} data-method={method}>{method}</span>
                    <ChevronDown size={14} />
                </div>
                <input
                    className={styles.urlInput}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button className={styles.sendButton} onClick={handleSend} disabled={isLoading}>
                    {isLoading ? (
                        <div className={styles.spinner} />
                    ) : (
                        <Play size={14} fill="currentColor" />
                    )}
                    <span>{isLoading ? 'Sending...' : 'Send'}</span>
                </button>
            </div>

            <div className={styles.consoleTabs}>
                <div className={styles.tabItem} data-active="true">Body</div>
                <div className={styles.tabItem}>Params</div>
                <div className={styles.tabItem}>Headers</div>
                <div className={styles.tabItem}>Auth</div>
            </div>

            <div className={styles.consoleBody}>
                <div className={styles.editorArea}>
                    <pre className={styles.codeBlock}>
                        {`{
  "username": "johndoe",
  "email": "john@example.com",
  "role": "editor"
}`}
                    </pre>
                </div>
            </div>

            <div className={styles.responseArea}>
                {isLoading ? (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner} style={{ width: '24px', height: '24px', borderColor: '#e4e4e7', borderTopColor: '#000' }} />
                        <span style={{ fontSize: '12px', marginTop: '8px', color: '#71717a' }}>Waiting for response...</span>
                    </div>
                ) : (
                    <>
                        <div className={styles.responseHeader}>
                            <div className={styles.statusBadge} data-status="200">200 OK</div>
                            <div className={styles.timeBadge}>45ms</div>
                        </div>
                        <div className={styles.responseBody}>
                            <pre className={styles.codeBlock}>
                                {`{
  "id": "usr_123456789",
  "created_at": "2023-10-27T10:00:00Z",
  "status": "active"
}`}
                            </pre>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
