import React, { createContext, useContext } from 'react';
import * as styles from './Table.css';

// Context to share density preference
type TableContextValue = {
    density: 'standard' | 'compact';
};
const TableContext = createContext<TableContextValue>({ density: 'standard' });

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    density?: 'standard' | 'compact';
    className?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ density = 'standard', className, children, ...props }, ref) => {
        return (
            <TableContext.Provider value={{ density }}>
                <div className={styles.tableContainer}>
                    <table ref={ref} className={`${styles.table} ${className || ''}`} {...props}>
                        {children}
                    </table>
                </div>
            </TableContext.Provider>
        );
    }
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={`${styles.thead} ${className || ''}`} {...props} />
    )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={className} {...props} />
    )
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr ref={ref} className={`${styles.tr} ${className || ''}`} {...props} />
    )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => {
        const { density } = useContext(TableContext);
        return (
            <th
                ref={ref}
                className={`${styles.th({ density })} ${className || ''}`}
                {...props}
            />
        );
    }
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => {
        const { density } = useContext(TableContext);
        return (
            <td
                ref={ref}
                className={`${styles.td({ density })} ${className || ''}`}
                {...props}
            />
        );
    }
);
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className, ...props }, ref) => (
        <caption ref={ref} className={`${styles.caption} ${className || ''}`} {...props} />
    )
);
TableCaption.displayName = 'TableCaption';
