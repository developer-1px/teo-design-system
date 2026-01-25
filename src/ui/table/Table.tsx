import React, { forwardRef } from "react";
import * as styles from "./Table.css";

// 1. Table Container
interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
    columnsTemplate: string; // e.g. "50px 1fr 1fr"
}

export const Table = forwardRef<HTMLDivElement, TableProps>(({
    children,
    columnsTemplate,
    style,
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`${styles.tableContainer} ${className || ""}`}
            style={{
                gridTemplateColumns: columnsTemplate,
                ...style
            }}
            role="grid"
            {...props}
        >
            {children}
        </div>
    );
});
Table.displayName = "Table";

// 2. Header
export const TableHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
    children,
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`${styles.tableHeader} ${className || ""}`}
            role="rowgroup"
            {...props}
        >
            {children}
        </div>
    );
});
TableHeader.displayName = "TableHeader";

export const HeaderCell = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
    children,
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`${styles.headerCell} ${className || ""}`}
            role="columnheader"
            {...props}
        >
            {children}
        </div>
    );
});
HeaderCell.displayName = "HeaderCell";

// 3. Row
interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
    selected?: boolean;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(({
    children,
    className,
    selected,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`${styles.tableRow({ selected })} ${className || ""}`}
            role="row"
            {...props}
        >
            {children}
        </div>
    );
});
TableRow.displayName = "TableRow";

// 4. Cell
interface TableCellProps extends React.HTMLAttributes<HTMLDivElement> {
    focused?: boolean;
    selected?: boolean;
    editing?: boolean;
    match?: boolean;
    activeMatch?: boolean;
    copied?: boolean;
}

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(({
    children,
    className,
    focused,
    selected,
    editing,
    match,
    activeMatch,
    copied,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`${styles.cell({ focused, selected, editing, match, activeMatch, copied })} ${className || ""}`}
            role="gridcell"
            {...props}
        >
            {children}
        </div>
    );
});
TableCell.displayName = "TableCell";

// 5. Editor Input
interface TableInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const TableInput = forwardRef<HTMLInputElement, TableInputProps>(({
    className,
    ...props
}, ref) => {
    return (
        <input
            ref={ref}
            className={`${styles.input} ${className || ""}`}
            {...props}
        />
    );
});
TableInput.displayName = "TableInput";
