import { CheckSquare, Square, Star } from 'lucide-react';
import * as styles from './EmailRow.css';

interface EmailData {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    date: string;
    isRead: boolean;
    isStarred: boolean;
    selected?: boolean;
}

export function EmailRow({ data, onToggleSelect, onClick }: { data: EmailData, onToggleSelect: () => void, onClick?: () => void }) {
    const bgClass = data.selected ? styles.rowState.selected : (data.isRead ? styles.rowState.read : styles.rowState.unread);
    const weightClass = data.isRead ? styles.textWeight.normal : styles.textWeight.bold;

    return (
        <div className={`${styles.row} ${bgClass}`} onClick={onClick}>
            {/* 1. Checkbox */}
            <div className={styles.iconCell} onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}>
                {data.selected ? <CheckSquare size={20} /> : <Square size={20} />}
            </div>

            {/* 2. Star */}
            <div className={styles.iconCell} onClick={(e) => e.stopPropagation()}>
                {data.isStarred ? <Star size={20} fill="#fbbc04" stroke="#fbbc04" /> : <Star size={20} />}
            </div>

            {/* 3. Sender */}
            <div className={`${styles.sender} ${weightClass}`}>
                {data.sender}
            </div>

            {/* 4. Subject */}
            <div className={styles.subjectSection}>
                <span className={`${styles.subjectText} ${weightClass}`}>{data.subject}</span>
                <span className={styles.snippet}>- {data.snippet}</span>
            </div>

            {/* 5. Time */}
            <div className={`${styles.date} ${weightClass}`}>
                {data.date}
            </div>
        </div>
    );
}
