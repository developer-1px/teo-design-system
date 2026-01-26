import { Link, useLocation } from 'react-router-dom';
import * as styles from './DocsLayout.css';

// 1. Auto-import all MDX files to get metadata
const mdxFiles = import.meta.glob('/src/docs/*.mdx', { eager: true });

// 2. Extract routes and frontmatter
const routes = Object.keys(mdxFiles).map((path) => {
    // path: "/src/docs/prd.mdx" -> slug: "prd"
    const slug = path.split('/').pop()?.replace('.mdx', '');
    const module = mdxFiles[path] as any;
    const title = module.frontmatter?.title || slug?.toUpperCase() || 'Untitled';
    const order = module.frontmatter?.order || 999;

    return {
        path: `/docs/${slug}`,
        title,
        order,
        slug
    };
}).sort((a, b) => a.order - b.order);

export function DocsSidebar() {
    const location = useLocation();

    return (
        <aside className={styles.sidebar}>
            <nav>
                <div className={styles.sectionTitle}>Overview</div>
                <ul className={styles.navList}>
                    {routes.map((route) => (
                        <li key={route.path}>
                            <Link
                                to={route.path}
                                className={`${styles.navLink} ${location.pathname === route.path ? 'active' : ''}`}
                            >
                                {route.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
