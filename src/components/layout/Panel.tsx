import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import * as styles from './Panel.css';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

// --- Panel Container ---
export interface PanelProps extends ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
    surface?: 'base' | 'subtle';
    side?: 'left' | 'right';
}
export function Panel({ children, className, surface = 'subtle', side = 'left', ...props }: PanelProps) {
    return (
        <div className={clsx(styles.container({ surface, side }), className)} {...props}>
            {children}
        </div>
    );
}

// --- Panel Header ---
export interface PanelHeaderProps extends ComponentPropsWithoutRef<'div'> {
    children?: ReactNode;
    title?: string;
}
export function PanelHeader({ children, title, className, ...props }: PanelHeaderProps) {
    return (
        <div className={clsx(styles.header, className)} {...props}>
            {title ? <span className={styles.title}>{title}</span> : null}
            {children}
        </div>
    );
}

// --- Panel Body ---
export interface PanelBodyProps extends ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
}
export function PanelBody({ children, className, ...props }: PanelBodyProps) {
    return (
        <div className={clsx(styles.body, className)} {...props}>
            {children}
        </div>
    );
}

// --- Panel Section ---
export interface PanelSectionProps extends ComponentPropsWithoutRef<'div'> {
    label?: string;
    children: ReactNode;
}
export function PanelSection({ label, children, className, ...props }: PanelSectionProps) {
    return (
        <div className={clsx(styles.section, className)} {...props}>
            {label && <div className={styles.sectionLabel}>{label}</div>}
            <div className={styles.sectionContent}>
                {children}
            </div>
        </div>
    );
}

// --- Panel Item (Polymorphic) ---
export interface PanelItemProps<T extends ElementType = 'button'> {
    as?: T;
    active?: boolean;
    disabled?: boolean;
    icon?: LucideIcon;
    children: ReactNode;
    className?: string;
    density?: 'compact' | 'standard' | 'loose';
}

type PolymorphicPanelItemProps<T extends ElementType> = PanelItemProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof PanelItemProps<T>>;

export function PanelItem<T extends ElementType = 'button'>({
    as,
    active,
    disabled,
    icon: Icon,
    children,
    className,
    density = 'standard',
    ...props
}: PolymorphicPanelItemProps<T>) {
    const Component = as || 'button';
    const recipeClass = styles.item({ active, density });

    return (
        <Component
            className={clsx(recipeClass, className)}
            disabled={disabled}
            data-active={active}
            {...props}
        >
            {Icon && <Icon size={16} />}
            {children}
        </Component>
    );
}

// Attach subcomponents for dot notation usage if preferred
Panel.Header = PanelHeader;
Panel.Body = PanelBody;
Panel.Section = PanelSection;
Panel.Item = PanelItem;
