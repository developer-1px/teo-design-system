import React, { useState, useRef, useEffect } from 'react';
import * as styles from './Combobox.css';
import { TextInput } from './TextInput';
import { Overlay, OverlayTrigger, OverlayContent } from '../overlay/Overlay';
import { Check, ChevronsUpDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface ComboboxItem {
    label: string;
    value: string;
}

export interface ComboboxProps {
    items: ComboboxItem[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const Combobox = ({
    items,
    value,
    onChange,
    placeholder = "Select item...",
    className,
    disabled
}: ComboboxProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // Filter items
    const filteredItems = query === ''
        ? items
        : items.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );

    // Update query when value changes externally (optional, maybe distinct reset?)
    // Actually, usually ComboBox input shows the selected label if closed.
    // If open, it shows the query.

    const selectedItem = items.find(i => i.value === value);

    useEffect(() => {
        if (!open && selectedItem) {
            setQuery(selectedItem.label);
        } else if (!open && !selectedItem) {
            setQuery('');
        }
    }, [open, selectedItem]);

    // Measure trigger width for popover
    useEffect(() => {
        if (open && triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [open]);

    return (
        <Overlay open={open} onOpenChange={setOpen}>
            <OverlayTrigger>
                <div ref={triggerRef} className={clsx(styles.triggerWrapper, className)}>
                    <TextInput
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (!open) setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        rightIcon={<ChevronsUpDown size={16} className="text-gray-400" />}
                        disabled={disabled}
                        // Prevent overlay toggle on click if we want to type
                        // Actually OverlayTrigger toggles on click. We might need to stop propagation on the input?
                        // But clicking input should open it.
                        // Let's rely on standard behavior, but if typing, we don't want to close.
                        // TextInput passes ...props, but we might have issues with OverlayTrigger wrapping it.
                        // OverlayTrigger uses onClick to toggle.
                        // If we click inside the input, we probably want to keep it open or open it.
                        onClick={(e) => {
                            // If it's already open, don't close it when clicking input to type
                            if (open) e.stopPropagation();
                        }}
                    />
                </div>
            </OverlayTrigger>
            <OverlayContent align="start" side="bottom" sideOffset={4}>
                <div
                    className={styles.popover}
                    style={triggerWidth ? { width: `${triggerWidth}px` } : undefined}
                >
                    {filteredItems.length === 0 ? (
                        <div className={styles.empty}>No item found.</div>
                    ) : (
                        filteredItems.map((item) => (
                            <div
                                key={item.value}
                                className={styles.item({ selected: value === item.value })}
                                onClick={() => {
                                    onChange?.(item.value);
                                    setQuery(item.label);
                                    setOpen(false);
                                }}
                            >
                                {item.label}
                                {value === item.value && <Check size={16} />}
                            </div>
                        ))
                    )}
                </div>
            </OverlayContent>
        </Overlay>
    );
};
