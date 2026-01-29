import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as styles from './DocsLayout.css';
import { getSpaceForFolder } from '../config/docs-map';

// 1. Auto-import all MDX files recursively
const mdxFiles = import.meta.glob('/src/docs/**/*.mdx', { eager: true });

// 2. Extract routes and group by folder name
const files: RouteInfo[] = Object.keys(mdxFiles).map((path) => {
    // path: "/src/docs/01-Overview/00-prd.mdx"
    const parts = path.split('/');
    const filename = parts.pop() || '';
    const folder = parts.pop() || 'Uncategorized'; // e.g., "01-Overview"

    // slug: "00-prd" -> "prd"
    const slug = filename.replace('.mdx', '').replace(/^\d+-/, '');
    const module = mdxFiles[path] as any;
    const title = module.frontmatter?.title || slug?.toUpperCase();
    const order = module.frontmatter?.order ?? 999;

    return {
        path: `/docs/${folder}/${slug}`, // Use full path for now to match file structure
        title,
        order,
        category: folder, // Use folder name as category
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

// Group by category
const groupedRoutes = files.reduce((acc, route) => {
    if (!acc[route.category]) {
        acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
}, {} as Record<string, RouteInfo[]>);

// Sort categories (folders) naturally
const categories = Object.keys(groupedRoutes).sort();

export function DocsSidebar() {
    const location = useLocation();

    // Determine active space
    const parts = location.pathname.split('/');
    // parts[0] = ""
    // parts[1] = "docs"
    // parts[2] = "01-Overview" (or similar)
    const currentFolder = parts[2];
    const activeSpaceId = currentFolder ? getSpaceForFolder(currentFolder) : 'guide';

    return (
        <aside className={styles.sidebar}>
            <nav>
                {categories.map((category) => {
                    // Filter: Only show categories that belong to the current space
                    if (getSpaceForFolder(category) !== activeSpaceId) {
                        return null;
                    }

                    return (
                        <Fragment key={category}>
                            <div className={styles.sectionTitle}>
                                {category.replace(/^\d+-/, '') /* Optional: Remove prefix number for nicer title */}
                            </div>
                            <ul className={styles.navList}>
                                {groupedRoutes[category].map((route) => (
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
                    )
                })}
            </nav>
        </aside>
    );
}
