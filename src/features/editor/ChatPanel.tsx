import { Bot, User, Send, MoreHorizontal } from 'lucide-react';
import * as styles from './ChatPanel.css';
import { vars } from '../../styles/vars.css';

export function ChatPanel() {
    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <span>AGENT CHAT</span>
                <MoreHorizontal size={16} />
            </div>

            <div className={styles.messageList}>
                <div className={styles.aiMessage}>
                    <div style={{ display: 'flex', gap: vars.spacing[8], alignItems: 'center', marginBottom: vars.spacing[4], opacity: 0.7, fontSize: vars.fontSize.xs }}>
                        <Bot size={12} /> Antigravity
                    </div>
                    Hello! I'm ready to help you specific with your coding task.
                </div>

                <div className={styles.userMessage}>
                    <div style={{ display: 'flex', gap: vars.spacing[8], alignItems: 'center', marginBottom: vars.spacing[4], opacity: 0.7, fontSize: vars.fontSize.xs, justifyContent: 'flex-end' }}>
                        User <User size={12} />
                    </div>
                    Can you explain how the surface system works?
                </div>

                <div className={styles.aiMessage}>
                    <div style={{ display: 'flex', gap: vars.spacing[8], alignItems: 'center', marginBottom: vars.spacing[4], opacity: 0.7, fontSize: vars.fontSize.xs }}>
                        <Bot size={12} /> Antigravity
                    </div>
                    The Surface System uses <code>vars.css.ts</code> to define semantic tokens for background, border, and shadow. It ensures consistent theming across light and dark modes.
                </div>
            </div>

            <div className={styles.inputArea}>
                <div style={{ position: 'relative' }}>
                    <textarea
                        className={styles.input}
                        placeholder="Ask a question or describe a task..."
                        rows={1}
                    />
                    <button style={{
                        position: 'absolute',
                        right: vars.spacing[8],
                        bottom: vars.spacing[8],
                        border: 'none',
                        background: 'transparent',
                        color: vars.border.interactive,
                        cursor: 'pointer'
                    }}>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
