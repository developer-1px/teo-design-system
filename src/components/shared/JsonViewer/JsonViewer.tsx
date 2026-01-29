import { ChevronRight } from 'lucide-react';
import { PList, PListRow, PListStyles as styles } from '../PList/PList';

interface JsonViewerProps {
    data: any;
    depth?: number;
    path?: string[];
    onRenderKey?: (key: string, value: any, depth: number, path: string[]) => React.ReactNode;
    onRenderType?: (key: string, value: any, depth: number, path: string[]) => React.ReactNode;
    onRenderValue?: (key: string, value: any, depth: number, path: string[]) => React.ReactNode;
}

/**
 * Logic Adapter: JsonViewer
 * Standard recursive renderer for arbitrary JSON data using PList primitives.
 */
export function JsonViewer({ data, depth = 0, path = [], onRenderKey, onRenderType, onRenderValue }: JsonViewerProps) {
    if (typeof data !== 'object' || data === null) {
        return <span className={styles.valueNull}>{String(data)}</span>;
    }

    const entries = Object.entries(data);

    return (
        <PList isRoot={depth === 0}>
            {entries.map(([key, value]) => {
                const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
                const isArray = Array.isArray(value);
                const valueType = typeof value;
                const currentPath = [...path, key];
                const metaLabel = isArray ? `ARRAY(${value.length})` : 'OBJECT';

                const renderKey = () => {
                    if (onRenderKey) return onRenderKey(key, value, depth, currentPath);
                    return (
                        <>
                            {(isObject || isArray) ?
                                <ChevronRight size={10} style={{ transform: 'rotate(90deg)', opacity: 0.5 }} />
                                : <div style={{ width: 10 }} />
                            }
                            <span title={key}>{key}</span>
                        </>
                    );
                };

                const renderValue = () => {
                    if (onRenderValue) return onRenderValue(key, value, depth, currentPath);
                    if (isObject || isArray) return <span className={styles.typeBadge}>{metaLabel}</span>;
                    if (value === null) return <span className={styles.valueNull}>null</span>;
                    if (valueType === 'number') return <span className={styles.valueNumber}>{String(value)}</span>;
                    if (valueType === 'boolean') return <span className={styles.valueBoolean}>{String(value)}</span>;
                    return <span className={styles.valueString}>"{String(value)}"</span>;
                };

                return (
                    <div key={key}>
                        <PListRow
                            depth={depth}
                            label={renderKey()}
                            typeSlot={onRenderType?.(key, value, depth, currentPath)}
                            value={renderValue()}
                        />
                        {isObject && (
                            <JsonViewer
                                data={value}
                                depth={depth + 1}
                                path={currentPath}
                                onRenderKey={onRenderKey}
                                onRenderType={onRenderType}
                                onRenderValue={onRenderValue}
                            />
                        )}
                        {isArray && (
                            <div>
                                {value.map((item: any, idx: number) => {
                                    const arrayItemPath = [...currentPath, String(idx)];
                                    return (
                                        <PListRow
                                            key={idx}
                                            depth={depth + 1}
                                            label={<><div style={{ width: 10 }} /><span style={{ opacity: 0.6 }}>{idx}</span></>}
                                            value={
                                                typeof item === 'object' && item !== null ? (
                                                    <JsonViewer data={item} depth={depth + 1} path={arrayItemPath} onRenderKey={onRenderKey} onRenderType={onRenderType} onRenderValue={onRenderValue} />
                                                ) : (
                                                    item === null ? <span className={styles.valueNull}>null</span> :
                                                        typeof item === 'number' ? <span className={styles.valueNumber}>{item}</span> :
                                                            typeof item === 'boolean' ? <span className={styles.valueBoolean}>{String(item)}</span> :
                                                                <span className={styles.valueString}>"{item}"</span>
                                                )
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </PList>
    );
}
