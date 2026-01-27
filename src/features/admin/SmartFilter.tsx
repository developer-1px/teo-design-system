import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import * as styles from './SmartFilter.css';

interface FilterTag {
    id: string;
    label: string;
    value: string;
}

export function SmartFilter() {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<FilterTag[]>([
        { id: '1', label: 'Status', value: 'Active' }, // Demo initial tag
    ]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            // Simple parsing logic: "key:value" or just "value"
            const parts = inputValue.split(':');
            let label = 'Search';
            let value = inputValue;

            if (parts.length > 1) {
                label = parts[0].trim();
                value = parts[1].trim();
            }

            const newTag = {
                id: Date.now().toString(), // Simple ID
                label: label.charAt(0).toUpperCase() + label.slice(1),
                value: value
            };

            setTags([...tags, newTag]);
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag on backspace
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (id: string) => {
        setTags(tags.filter(t => t.id !== id));
    };

    return (
        <div
            className={styles.filterBar}
            onClick={() => inputRef.current?.focus()}
        >
            <Search className={styles.icon} />

            {tags.map(tag => (
                <div key={tag.id} className={styles.tag}>
                    <span>{tag.label}:</span>
                    <span style={{ color: '#000' }}>{tag.value}</span>
                    <X
                        size={10}
                        className={styles.tagClose}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(tag.id);
                        }}
                    />
                </div>
            ))}

            <input
                ref={inputRef}
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Filter by status, assignee..." : ""}
            />
        </div>
    );
}
