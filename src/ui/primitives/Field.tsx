import type React from "react";
import * as styles from "./Field.css";
import { vars } from "@/design-system/theme.css.ts";

interface FieldProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    w?: string | number;
    flex?: boolean | number;
    inputStyle?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

export function Field({
    label,
    icon,
    rightIcon,
    w,
    flex,
    style, // map to wrapperStyle?
    wrapperStyle,
    inputStyle,
    value,
    onChange,
    children,
    ...props
}: FieldProps) {

    const widthStyle = w ? { width: w } : (flex ? { flex: typeof flex === 'number' ? flex : 1 } : undefined);

    return (
        <label
            className={styles.fieldLabel()}
            style={{
                ...widthStyle,
                ...style,
                ...wrapperStyle,
            }}
        >
            {icon && (
                <div
                    style={{
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: vars.color.text.subtle,
                    }}
                >
                    {icon}
                </div>
            )}
            {label && (
                <span
                    style={{
                        fontSize: "9px",
                        fontWeight: "bold",
                        marginRight: "2px",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        color: vars.color.text.subtle,
                    }}
                >
                    {label}
                </span>
            )}
            <input
                {...props}
                value={value}
                onChange={onChange}
                className={styles.fieldInput()}
                style={inputStyle}
            />
            {rightIcon && (
                <div
                    style={{
                        opacity: 0.4,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {rightIcon}
                </div>
            )}
            {children}
        </label>
    );
}
