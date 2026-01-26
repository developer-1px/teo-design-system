import { Outlet } from 'react-router-dom';
import { GlobalNav } from '../components/layout/GlobalNav';
import * as styles from './RootLayout.css';

export function RootLayout() {
    return (
        <div className={styles.layout}>
            <GlobalNav />
            <div className={styles.contentArea}>
                <Outlet />
            </div>
        </div>
    );
}
