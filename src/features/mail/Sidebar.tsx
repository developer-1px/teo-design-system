import { Inbox, Star, Clock, Send, File, ChevronDown, Plus } from 'lucide-react';
import * as styles from './Sidebar.css';

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <button className={styles.composeBtn}>
                <Plus size={20} />
                Compose
            </button>

            {/* Navigation Group acting as the Grid Parent for Subgrid items */}
            <div className={styles.navGroup}>
                <NavItem icon={Inbox} label="Inbox" count="24" active />
                <NavItem icon={Star} label="Starred" />
                <NavItem icon={Clock} label="Snoozed" />
                <NavItem icon={Send} label="Sent" />
                <NavItem icon={File} label="Drafts" count="1" />
                <NavItem icon={ChevronDown} label="More" />
            </div>
        </aside>
    );
}

function NavItem({ icon: Icon, label, count, active }: { icon: any, label: string, count?: string, active?: boolean }) {
    const variantClass = active ? styles.itemState.active : styles.itemState.inactive;

    return (
        <a href="#" className={`${styles.navItemParent} ${variantClass}`} onClick={(e) => e.preventDefault()}>
            <Icon size={20} />
            <span style={{ flex: 1 }}>{label}</span>
            {count && <span style={{ fontSize: '12px', fontWeight: active ? 700 : 500 }}>{count}</span>}
        </a>
    )
}
