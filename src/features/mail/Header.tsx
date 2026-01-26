import { vars } from '../../styles/vars.css';
import { Menu, Search, Settings, HelpCircle, Grip, User } from 'lucide-react';
import * as styles from './Header.css';
import { ThemeToggle } from '../../components/ThemeToggle';

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
                <button className={styles.iconBtn}>
                    <Menu size={24} />
                </button>
                <div className={styles.logo}>
                    {/* Simple logo text representation for replica */}
                    <span style={{ color: '#4285f4' }}>G</span>
                    <span style={{ color: '#ea4335' }}>m</span>
                    <span style={{ color: '#fbbc04' }}>a</span>
                    <span style={{ color: '#4285f4' }}>i</span>
                    <span style={{ color: '#34a853' }}>l</span>
                </div>
            </div>

            <div className={styles.searchSection}>
                <div className={styles.searchBar}>
                    <Search size={20} color={vars.color.gray600} />
                    <input className={styles.input} placeholder="Search mail" />
                    <div style={{ display: 'flex', gap: vars.spacing[8] }}>
                        {/* Tune icon placeholder */}
                    </div>
                </div>

                <div className={styles.actions}>
                    <ThemeToggle />
                    <button className={styles.iconBtn}><HelpCircle size={24} /></button>
                    <button className={styles.iconBtn}><Settings size={24} /></button>
                    <button className={styles.iconBtn}><Grip size={24} /></button>
                    <button className={styles.iconBtn}><User size={32} /></button>
                </div>
            </div>
        </header>
    );
}
