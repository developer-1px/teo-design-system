import { Menu, Search, Settings, HelpCircle, Grip, SlidersHorizontal, Mail } from 'lucide-react';
import * as styles from './Header.css';
import { ThemeToggle } from '../../components/ThemeToggle';

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
                <button className={styles.menuBtn}>
                    <Menu size={24} />
                </button>
                <div className={styles.logo}>
                    <Mail size={24} className={styles.mailIcon} />
                    <span className={styles.logoText}>Mail</span>
                </div>
            </div>

            <div className={styles.headerRightArea}>
                <div className={styles.searchBarContainer}>
                    <div className={styles.searchBar}>
                        <button className={styles.searchIconBtn}>
                            <Search size={20} />
                        </button>
                        <input className={styles.input} placeholder="Search in mail" />
                        <button className={styles.tuneIconBtn}>
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>

                <div className={styles.actions}>
                    {/* Status Indicator (Offline/Online) could go here */}
                    <div className={styles.actionGroup}>
                        <ThemeToggle />
                    </div>

                    <div className={styles.actionGroup}>
                        <button className={styles.iconBtn} title="Support">
                            <HelpCircle size={22} />
                        </button>
                        <button className={styles.iconBtn} title="Settings">
                            <Settings size={22} />
                        </button>
                    </div>

                    <div className={styles.actionGroup}>
                        <button className={styles.iconBtn} title="Google Apps">
                            <Grip size={22} />
                        </button>
                        <button className={styles.avatarBtn} title="Google Account">
                            <div className={styles.avatarFallback}>U</div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
