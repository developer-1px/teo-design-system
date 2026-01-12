import React from 'react';
import { Frame } from './Frame';
import { Text } from './Text';

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    width?: string | number;
    flex?: boolean | number;
}

export function Field({
    label,
    icon,
    rightIcon,
    width = '100%',
    flex,
    className = '',
    style,
    value,
    onChange,
    ...props
}: FieldProps) {
    return (
        <Frame
            flex={flex}
            row
            align="center"
            gap={4}
            padding={0}
            width={flex ? undefined : width}
            as="label"
            className={`field-base ${className}`}
            style={{
                cursor: 'text',
                paddingLeft: 6,
                paddingRight: rightIcon ? 4 : 6,
                ...style
            }}
        >
            {icon && (
                <Frame className="field-icon" style={{
                    display: 'flex',
                    flexShrink: 0
                }}>
                    {icon}
                </Frame>
            )}
            {label && (
                <Text
                    variant={4}
                    className="field-label"
                    style={{
                        width: 14,
                        marginRight: 2,
                        flexShrink: 0,
                        fontSize: 9,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                    }}
                >
                    {label}
                </Text>
            )}
            <input
                {...props}
                value={value}
                onChange={onChange}
                className="field-input"
                style={{
                    paddingLeft: 0,
                    minWidth: 0,
                    flex: 1,
                    cursor: 'text'
                }}
            />
            {rightIcon && (
                <Frame style={{
                    opacity: 0.4,
                    display: 'flex',
                    flexShrink: 0
                }}>
                    {rightIcon}
                </Frame>
            )}
        </Frame>
    );
}
