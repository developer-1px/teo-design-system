
import React from 'react';
import './tokens.css';

// Restricted Size Tokens
type SizeToken =
    | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 13 | 16  // Components
    | 50 | 55 | 60 | 65 | 70 | 80;           // Layout

interface FrameProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'title' | 'color'> {
    children?: React.ReactNode;
    as?: React.ElementType;
    style?: React.CSSProperties;
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    onClick?: () => void;

    // Layout
    padding?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    gap?: number | string;


    width?: SizeToken | string | number;
    height?: SizeToken | string | number;

    flex?: boolean | number;
    row?: boolean;
    fill?: boolean;

    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

    // Surface
    surface?: 1 | 2 | 3 | 4;
    border?: boolean | 'top' | 'bottom' | 'left' | 'right';
    radius?: 'none' | 'pill' | 'round';
    overflow?: 'hidden' | 'auto' | 'scroll' | 'visible';
    cursor?: 'pointer' | 'default' | 'text' | 'move' | 'not-allowed';

    // Visual
    shadow?: 'sm' | 'md' | 'lg';
    opacity?: number;
    ratio?: string;
    borderColor?: 'default' | 'text-4' | 'text-primary' | 'transparent';

    // Positioning
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    zIndex?: number;

    // Semantic
    title?: string;
}

export function Frame({
    children,
    as: Component = 'div',

    padding = 0,
    gap = 0,
    width,
    height,

    flex,
    row,
    fill,
    align,
    justify,

    surface,
    border,
    radius,
    overflow,
    cursor,

    shadow,
    opacity,
    ratio,
    borderColor,

    position,
    top,
    bottom,
    left,
    right,
    zIndex,

    title,
    className = '',
    style = {},
    ...props
}: FrameProps) {

    // Border Logic
    const computedBorder: React.CSSProperties = {};
    const colorStr = borderColor ? (borderColor === 'default' ? 'var(--border-color)' : `var(--${borderColor})`) : 'var(--border-color)';

    if (border === true) computedBorder.border = `1px solid ${colorStr}`;
    else if (typeof border === 'string') {
        const key = `border${border.charAt(0).toUpperCase() + border.slice(1)}` as keyof React.CSSProperties;
        // @ts-ignore
        computedBorder[key] = `1px solid ${colorStr}`;
    }

    // Radius Logic
    let borderRadius;
    if (radius === 'pill') borderRadius = 'var(--radius-pill)';
    else if (radius === 'round') borderRadius = 'var(--radius-round-md)';
    else if (radius === 'none') borderRadius = 'var(--radius-none)';

    const computedStyle: React.CSSProperties = {
        backgroundColor: surface ? `var(--surface-${surface})` : undefined,
        borderRadius,
        padding: padding > 0 ? `var(--space-${padding})` : undefined,
        gap: typeof gap === 'number' ? (gap > 0 && gap <= 6 ? `var(--space-${gap})` : `${gap}px`) : gap,

        display: 'flex',
        flexDirection: row ? 'row' : 'column',
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        justifyContent: justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify === 'between' ? 'space-between' : justify === 'around' ? 'space-around' : justify,

        width: (ratio && height && !width) ? undefined : (fill ? '100%' : (typeof width === 'number' ? `${width}px` : width)),
        height: (ratio && width) ? undefined : (fill ? '100%' : (typeof height === 'number' ? `${height}px` : height)),

        flex: fill ? 1 : (flex === true ? 1 : (typeof flex === 'number' ? flex : undefined)),
        flexShrink: (width !== undefined || height !== undefined || ratio !== undefined) ? 0 : 1,
        flexGrow: (fill || flex) ? 1 : 0,

        overflow,
        cursor,
        ...computedBorder,

        // Visual Props
        boxShadow: shadow ? `var(--shadow-${shadow})` : undefined,
        opacity,
        aspectRatio: ratio,

        // Positioning
        position,
        zIndex,
        top: typeof top === 'number' ? (top >= 0 && top <= 6 ? `var(--space-${top})` : `${top}px`) : top,
        bottom: typeof bottom === 'number' ? (bottom >= 0 && bottom <= 6 ? `var(--space-${bottom})` : `${bottom}px`) : bottom,
        left: typeof left === 'number' ? (left >= 0 && left <= 6 ? `var(--space-${left})` : `${left}px`) : left,
        right: typeof right === 'number' ? (right >= 0 && right <= 6 ? `var(--space-${right})` : `${right}px`) : right,

        color: 'inherit',

        ...style,
    };

    return (
        <Component
            className={className}
            style={computedStyle}
            onClick={props.onClick}
            title={title}
            {...props}
        >
            {children}
        </Component>
    );
}
