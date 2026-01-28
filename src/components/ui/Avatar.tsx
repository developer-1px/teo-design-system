import { useState } from 'react';
import * as styles from './Avatar.css';
import { clsx } from 'clsx';
import { User } from 'lucide-react';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy';
    className?: string;
}

export function Avatar({
    src,
    alt,
    fallback,
    size = 'md',
    status,
    className
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);

    const hasImage = src && !imageError;

    // Fallback logic: "AB" (initials) -> Icon -> null
    const renderFallback = () => {
        if (fallback) {
            return <div className={styles.fallback}>{fallback.slice(0, 2)}</div>;
        }
        return (
            <div className={styles.fallback}>
                <User size={size === 'xs' ? 12 : size === 'sm' ? 14 : 18} />
            </div>
        );
    };

    return (
        <div className={clsx(styles.avatarRoot({ size }), className)}>
            {hasImage ? (
                <img
                    src={src}
                    alt={alt || 'Avatar'}
                    className={styles.image}
                    onError={() => setImageError(true)}
                />
            ) : (
                renderFallback()
            )}

            {status && (
                <div className={styles.statusIndicator({ status, size })} />
            )}
        </div>
    );
}
