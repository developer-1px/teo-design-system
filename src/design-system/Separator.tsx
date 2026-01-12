
import React from 'react';
import { Frame } from './Frame';

interface SeparatorProps {
    orientation?: 'horizontal' | 'vertical';
    length?: string | number;
    style?: React.CSSProperties;
}

export function Separator({
    orientation = 'horizontal',
    length = '100%',
    style
}: SeparatorProps) {
    const isHorizontal = orientation === 'horizontal';

    return (
        <Frame
            surface={3}
            width={isHorizontal ? length : 1}
            height={isHorizontal ? 1 : length}
            style={style}
        />
    );
}
