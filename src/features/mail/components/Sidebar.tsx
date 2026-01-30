import { useState } from 'react';
import { Inbox, Star, Clock, Send, File, ChevronDown, Plus } from 'lucide-react';
import * as styles from './Sidebar.css';
import { Tree, type TreeNode } from '../../../components/composites/Tree';

export function Sidebar({ inboxCount = 0 }: { inboxCount?: number }) {
    const [selectedId, setSelectedId] = useState('inbox');

    const navData: TreeNode[] = [
        {
            id: 'inbox',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>Inbox</span>
                    {inboxCount > 0 && <span style={{ fontWeight: 600, fontSize: '12px' }}>{inboxCount}</span>}
                </div>
            ),
            icon: <Inbox size={16} />
        },
        { id: 'starred', label: 'Starred', icon: <Star size={16} /> },
        { id: 'snoozed', label: 'Snoozed', icon: <Clock size={16} /> },
        { id: 'sent', label: 'Sent', icon: <Send size={16} /> },
        {
            id: 'drafts',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>Drafts</span>
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>1</span>
                </div>
            ),
            icon: <File size={16} />
        },
        { id: 'more', label: 'More', icon: <ChevronDown size={16} /> },
    ];

    return (
        <aside className={styles.sidebar}>
            <button className={styles.composeBtn}>
                <Plus size={20} />
                Compose
            </button>

            <Tree
                data={navData}
                selectedId={selectedId}
                onNodeClick={(node) => setSelectedId(node.id)}
            />
        </aside>
    );
}
