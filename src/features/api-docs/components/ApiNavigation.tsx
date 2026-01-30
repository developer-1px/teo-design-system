import React, { useState } from 'react';
import * as styles from './ApiDocsLayout.css.ts';
import { Box } from 'lucide-react';
import { Tree, type TreeNode } from '../../../components/composites/Tree';
import { SearchFilterBar } from '../../../components/composites/SearchFilterBar';

export const ApiNavigation = () => {
    const [selectedId, setSelectedId] = useState('users-post');

    const navData: TreeNode[] = [
        {
            id: 'user-management',
            label: 'User Management',
            isExpanded: true,
            children: [
                {
                    id: 'users-post',
                    label: '/users',
                    icon: <span className={styles.navMethodBadge} data-method="POST">POST</span>
                },
                {
                    id: 'users-get',
                    label: '/users',
                    icon: <span className={styles.navMethodBadge} data-method="GET">GET</span>
                },
                {
                    id: 'users-id-get',
                    label: '/users/{id}',
                    icon: <span className={styles.navMethodBadge} data-method="GET">GET</span>
                }
            ]
        },
        {
            id: 'auth',
            label: 'Auth',
            isExpanded: true,
            children: [
                {
                    id: 'auth-login',
                    label: '/auth/login',
                    icon: <span className={styles.navMethodBadge} data-method="POST">POST</span>
                },
                {
                    id: 'auth-refresh',
                    label: '/auth/refresh',
                    icon: <span className={styles.navMethodBadge} data-method="POST">POST</span>
                }
            ]
        }
    ];

    return (
        <div className={styles.navContainer}>
            <div className={styles.navHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Box size={16} />
                    <span className={styles.navTitle}>Core API v1</span>
                </div>
                <SearchFilterBar
                    placeholder="Filter endpoints..."
                    className={styles.searchFilterOverride} // We might need to override styles if wrapper logic was specific
                />
            </div>

            <Tree
                data={navData}
                selectedId={selectedId}
                onNodeClick={(node) => !node.children && setSelectedId(node.id)}
            />
        </div>
    );
};
