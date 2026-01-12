
import React from 'react';
import { Frame } from './Frame';
import { Text } from './Text';
import './tokens.css';

interface ActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
    children?: React.ReactNode;
    icon?: React.ReactNode | React.ElementType;
    label?: string;
    variant?: 'ghost' | 'surface' | 'primary';

    // Layout overrides
    padding?: 0 | 1 | 2 | 3 | 4;
    radius?: 'none' | 'pill' | 'round';

    // Layout Props Passthrough
    flex?: boolean | number;
    fill?: boolean;
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    width?: string | number;
    height?: string | number;

    // Shortcuts
    size?: number;     // Sets unique width & height (square)
    iconSize?: number; // Sets icon size if icon is a component
    iconRotation?: number; // Internalized rotation

    // Visual
    opacity?: number;
    surface?: 1 | 2 | 3 | 4; // Explicit surface control
    tooltip?: string;
}

export function Action({
    children,
    icon,
    label,
    variant,
    padding,
    radius = 'round',
    flex,
    fill,
    justify,
    width,
    height,
    size,
    iconSize = 16,
    iconRotation,
    opacity,
    surface,
    tooltip,
    className = '',
    style: styleOverride,
    ...props
}: ActionProps) {

    // Helper to render icon
    const renderIcon = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) return icon;

        const Icon = icon as React.ElementType;
        // @ts-ignore
        return <Icon size={iconSize} />;
    };

    // Logic: Actions with a label default to 'surface' if variant not specified.
    // This provides a professional "button" look for textual actions.
    const finalVariant = variant ?? (label ? 'surface' : 'ghost');

    // Dimension logic: If label is present, width should be auto to fit text.
    // size/width props can still override this if explicitly provided.
    const finalWidth = label ? (width ?? 'auto') : (size ?? width);
    const finalHeight = size ?? height;

    // Visual optimization: Actions with labels usually need horizontal padding
    const finalPadding = padding ?? (label ? 2 : (size ? 0 : 2));

    // Logic: If variant is 'surface', ensure radius defaults to 'round' (8px) if not overridden.
    // Although the prop default is 'round', this makes the intent explicit and robust vs future prop changes.
    const finalRadius = radius ?? (finalVariant === 'surface' ? 'round' : 'round');

    // Radius Logic
    let borderRadius;
    if (finalRadius === 'pill') borderRadius = 'var(--radius-pill)';
    else if (finalRadius === 'round') borderRadius = 'var(--radius-round-md)';
    else if (finalRadius === 'none') borderRadius = 'var(--radius-none)';

    return (
        <button
            className={`action-base action-${finalVariant} ${className}`}
            title={tooltip}
            style={{
                display: 'flex',
                alignItems: 'stretch',
                flex: typeof flex === 'number' ? flex : (flex ? 1 : undefined),
                width: finalWidth,
                minWidth: !label && size ? size : undefined, // Ensure square for icons
                height: fill ? '100%' : finalHeight,
                opacity: opacity,
                borderRadius: borderRadius, // Apply radius to button
                ...styleOverride
            }}
            {...props}
        >
            <Frame
                radius={finalRadius} // Keep for inner content clipping if needed, or remove if redundant. Let's keep consistency.
                padding={finalPadding}
                gap="6px"
                row
                align="center"
                justify={justify ?? 'center'}
                fill={fill}
                surface={surface} // Pass down explicit surface if provided
                className="action-content"
                width="100%"
                height="100%"
                style={{ borderRadius: 'inherit' }} // Inherit from button
            >
                {icon && (
                    <span
                        className="action-icon"
                        style={{
                            display: 'flex',
                            transform: iconRotation ? `rotate(${iconRotation}deg)` : undefined,
                            transition: 'transform 0.2s ease'
                        }}
                    >
                        {renderIcon()}
                    </span>
                )}
                {label && (
                    <Text
                        variant={4}
                        weight="medium"
                        style={{
                            fontSize: 10,
                            lineHeight: 1,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {label}
                    </Text>
                )}
                {children}
            </Frame>
        </button>
    );
}
