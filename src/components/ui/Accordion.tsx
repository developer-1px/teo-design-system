import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import * as styles from './Accordion.css.ts';
import { clsx } from 'clsx';

interface AccordionItem {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpenIds?: string[];
    className?: string;
}

export function Accordion({ items, allowMultiple = false, defaultOpenIds = [], className }: AccordionProps) {
    const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

    const toggleItem = (id: string) => {
        setOpenIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }
            if (allowMultiple) {
                return [...prev, id];
            }
            return [id];
        });
    };

    return (
        <div className={clsx(styles.accordionRoot, className)}>
            {items.map(item => (
                <AccordionRow
                    key={item.id}
                    item={item}
                    isOpen={openIds.includes(item.id)}
                    onToggle={() => toggleItem(item.id)}
                />
            ))}
        </div>
    );
}

function AccordionRow({ item, isOpen, onToggle }: { item: AccordionItem, isOpen: boolean, onToggle: () => void }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<string | number>(0);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className={styles.item} data-state={isOpen ? 'open' : 'closed'}>
            <button
                className={styles.trigger}
                onClick={onToggle}
                disabled={item.disabled}
                aria-expanded={isOpen}
            >
                <span className={styles.title}>{item.title}</span>
                <ChevronDown className={styles.icon} size={16} />
            </button>
            <div
                className={styles.contentWrapper}
                style={{ height: isOpen ? height : 0 }}
            >
                <div ref={contentRef} className={styles.content}>
                    {item.content}
                </div>
            </div>
        </div>
    );
}
