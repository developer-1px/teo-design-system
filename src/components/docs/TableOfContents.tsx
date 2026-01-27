import { useEffect, useState } from 'react';
import * as styles from './TableOfContents.css';

interface TocItem {
    id: string;
    text: string;
    depth: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Function to find headings
        const findHeadings = () => {
            const article = document.getElementById('docs-content');
            if (!article) return;

            const elements = Array.from(article.querySelectorAll('h2, h3'));
            const items: TocItem[] = elements.map((element) => {
                if (!element.id) {
                    element.id = element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
                }
                return {
                    id: element.id,
                    text: element.textContent || '',
                    depth: parseInt(element.tagName.substring(1)),
                };
            });
            setHeadings(items);
        };

        // MutationObserver to detect content changes (since MDX loads dynamically)
        const observer = new MutationObserver(findHeadings);
        const article = document.getElementById('docs-content');

        if (article) {
            findHeadings(); // Initial run
            observer.observe(article, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    // Helper to determine visibility
    const isVisible = (index: number) => {
        const item = headings[index];
        if (item.depth === 2) return true; // Always show H2

        // For H3, show if:
        // 1. It is the active item
        if (activeId === item.id) return true;

        // 2. Its parent H2 is the active item (or we are inside this section)
        // Find the closest preceding H2
        let parentH2Id = '';
        for (let i = index - 1; i >= 0; i--) {
            if (headings[i].depth === 2) {
                parentH2Id = headings[i].id;
                break;
            }
        }

        // If the parent H2 is active, show this H3
        if (parentH2Id === activeId) return true;

        // 3. A sibling H3 in the same section is active
        // (meaning we are somewhere in this H2 section)
        // Check if activeId belongs to any H3 within the same H2 block
        // Actually, cleaner logic: 
        // We are in a "H2 Section" if the last seen H2 is the one governing the Active ID.

        // Let's refine: Show H3 if the "Current Section" is the one containing this H3.
        // What defines the "Current Section"? The header corresponding to the activeId, OR the H2 parent of the activeId.

        // Find the "Active H2 Section"
        let activeH2SectionId = '';
        const activeIndex = headings.findIndex(h => h.id === activeId);
        if (activeIndex !== -1) {
            const activeItem = headings[activeIndex];
            if (activeItem.depth === 2) {
                activeH2SectionId = activeItem.id;
            } else {
                // Find parent of active item
                for (let i = activeIndex - 1; i >= 0; i--) {
                    if (headings[i].depth === 2) {
                        activeH2SectionId = headings[i].id;
                        break;
                    }
                }
            }
        }

        return parentH2Id === activeH2SectionId;
    };

    return (
        <nav className={styles.container}>
            <div className={styles.title}>On this page</div>
            <ul className={styles.list}>
                {headings.map((heading, index) => {
                    if (!isVisible(index)) return null;
                    return (
                        <li key={heading.id} className={styles.item} data-depth={heading.depth}>
                            <a
                                href={`#${heading.id}`}
                                className={styles.link}
                                data-active={activeId === heading.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
