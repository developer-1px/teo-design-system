import { Outlet } from 'react-router-dom';
import * as styles from './DocsLayout.css';
import { prose } from '../components/docs/Markdown.css';
import { DocsSidebar } from './DocsSidebar';
import { SpaceSidebar } from './SpaceSidebar';
import { TableOfContents } from '../components/docs/TableOfContents';

export function DocsLayout() {
    return (
        <div className={styles.container}>
            <SpaceSidebar />
            <DocsSidebar />
            <main className={styles.content}>
                <div className={styles.contentInner}>
                    <div id="docs-content" className={`${styles.article} ${prose}`}>
                        <Outlet />
                    </div>
                    <aside className={styles.tocWrapper}>
                        <TableOfContents />
                    </aside>
                </div>
            </main>
        </div>
    );
}
