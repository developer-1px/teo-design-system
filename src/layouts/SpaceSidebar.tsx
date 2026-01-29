import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Box } from 'lucide-react';
import * as styles from './SpaceSidebar.css';
import { DOCS_SPACES, getSpaceForFolder } from '../config/docs-map';

export function SpaceSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const parts = location.pathname.split('/');
    const currentFolder = parts[2];
    const activeSpaceId = currentFolder ? getSpaceForFolder(currentFolder) : 'guide';

    const handleSpaceClick = (spaceId: string) => {
        if (spaceId === 'guide') {
            navigate('/docs/01-Overview/prd');
        } else if (spaceId === 'components') {
            navigate('/docs/05-Primitives/box');
        }
    };

    return (
        <aside className={styles.sidebar}>
            {DOCS_SPACES.map((space) => {
                const isActive = space.id === activeSpaceId;
                const Icon = space.id === 'guide' ? BookOpen : Box;

                return (
                    <div
                        key={space.id}
                        className={`${styles.item} ${isActive ? styles.activeItem : ''}`}
                        onClick={() => handleSpaceClick(space.id)}
                        title={space.label}
                    >
                        <Icon strokeWidth={isActive ? 2.5 : 2} className={styles.icon} />
                    </div>
                );
            })}
        </aside>
    );
}
