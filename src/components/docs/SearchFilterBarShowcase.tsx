import { useState } from 'react';
import { SearchFilterBar, type FilterTag } from '../ui/SearchFilterBar';
import * as styles from './SearchFilterBarShowcase.css';
import { Circle, User, Shield } from 'lucide-react';
import type { CascadingMenuItem } from '../overlay/CascadingMenu';

export function SearchFilterBarShowcase() {
    const [tags, setTags] = useState<FilterTag[]>([
        { id: '1', key: 'status', value: 'active' }
    ]);
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (msg: string) => {
        setEvents(prev => [msg, ...prev].slice(0, 5));
    };

    const filterMenu: CascadingMenuItem[] = [
        {
            id: 'status',
            label: 'Status',
            icon: Circle,
            children: [
                { id: 'status-active', label: 'Active', icon: Circle },
                { id: 'status-pending', label: 'Pending', icon: Circle },
            ]
        },
        {
            id: 'role',
            label: 'Role',
            icon: Shield,
            children: [
                { id: 'role-admin', label: 'Admin', icon: User },
                { id: 'role-user', label: 'User', icon: User },
            ]
        }
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.showcaseItem}>
                <div className={styles.label}>Interactive Search & Filter</div>
                <div className={styles.container}>
                    <SearchFilterBar
                        tags={tags}
                        onTagsChange={(newTags) => {
                            setTags(newTags);
                            addEvent(`Tags updated: ${newTags.length} active`);
                        }}
                        onSearch={(q) => {
                            if (q) addEvent(`Searching: ${q}`);
                        }}
                        filterMenu={filterMenu}
                        placeholder="Type 'key:value' and Enter..."
                    />
                </div>

                <div className={styles.eventLog}>
                    {events.length === 0 ? '> Waiting for interaction...' : events.map((e, i) => (
                        <div key={i}>&gt; {e}</div>
                    ))}
                </div>
            </div>

            <div className={styles.showcaseItem}>
                <div className={styles.label}>Empty State</div>
                <div className={styles.container}>
                    <SearchFilterBar
                        tags={[]}
                        placeholder="Search users, roles, or status..."
                        filterMenu={filterMenu}
                    />
                </div>
            </div>
        </div>
    );
}
