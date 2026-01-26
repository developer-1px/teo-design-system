import { Moon, Sun } from 'lucide-react';
import * as styles from './ThemeToggle.css';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className={styles.toggleBtn} onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
    );
}
