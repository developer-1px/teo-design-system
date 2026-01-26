import { Outlet } from 'react-router-dom';
import * as styles from './DocsLayout.css';
import { prose } from '../components/docs/Markdown.css';
import { DocsSidebar } from './DocsSidebar';

export function DocsLayout() {
    return (
        <div className={styles.container}>
            <DocsSidebar />
            <main className={styles.content}>
                <div className={`${styles.article} ${prose}`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
