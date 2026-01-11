import React from 'react';
import { cn } from '@/shared/lib/utils';
import { iddl } from '@/shared/iddl';

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    prominence?: 'primary' | 'secondary' | 'tertiary';
}

export function Content({ className, prominence = 'primary', ...props }: ContentProps) {
    // Map legacy prominence to IDDL
    const iddlProminence = prominence === 'primary' ? 'Hero' : prominence === 'secondary' ? 'Standard' : 'Subtle';

    return (
        <div
            className={iddl({
                role: 'Text',
                prominence: iddlProminence,
                className
            })}
            {...props}
        />
    );
}

export function ContentGroup({ gap, className, ...props }: any) {
    return <div className={cn("flex flex-col", gap && `gap-${gap}`, className)} {...props} />;
}
