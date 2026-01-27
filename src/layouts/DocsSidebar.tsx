import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as styles from './DocsLayout.css';

// 1. Auto-import all MDX files to get metadata
const mdxFiles = import.meta.glob('/src/docs/*.mdx', { eager: true });

// 2. Extract routes and frontmatter
const files: RouteInfo[] = Object.keys(mdxFiles).map((path) => {
    // path: "/src/docs/prd.mdx" -> slug: "prd"
    const slug = path.split('/').pop()?.replace('.mdx', '') || '';
    const module = mdxFiles[path] as any;
    const title = module.frontmatter?.title || slug?.toUpperCase() || 'Untitled';
    const order = module.frontmatter?.order || 999;
    const category = module.frontmatter?.category || 'Others';

    return {
        path: `/docs/${slug}`,
        title,
        order,
        category,
        slug
    };
}).sort((a, b) => a.order - b.order);

interface RouteInfo {
    path: string;
    title: string;
    order: number;
    category: string;
    slug: string;
}

const groupedRoutes = files.reduce((acc, route) => {
    if (!acc[route.category]) {
        acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
}, {} as Record<string, RouteInfo[]>);

const CATEGORY_ORDER = ['Reading material', 'Design System', 'Others'];

export function DocsSidebar() {
    const location = useLocation();

    return (
        <aside className={styles.sidebar}>
            <nav>
                {CATEGORY_ORDER.map(category => {
                    const routes = groupedRoutes[category];
                    if (!routes || routes.length === 0) return null;

                    return (
                        <Fragment key={category}>
                            <div className={styles.sectionTitle}>
                                {category}
                            </div>
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
                        </Fragment>
                    );
                })}
            </nav>
        </aside>
    );
}
