import { Outlet, NavLink } from 'react-router-dom';
import { Users, Hammer, Settings } from 'lucide-react';
import * as styles from './AdminLayout.css';


export function AdminLayout() {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <div className={styles.brand}>Admin Panel</div>
                </div>

                <nav className={styles.nav}>
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                        <Users size={16} />
                        <span>Users</span>
                    </NavLink>

                    <NavLink
                        to="/admin/builder"
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                        <Hammer size={16} />
                        <span>Builder</span>
                    </NavLink>



                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                        <Settings size={16} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className={styles.userSection}>
                    <div className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>Admin User</div>
                        <div className={styles.userRole}>Super Admin</div>
                    </div>
                </div>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
