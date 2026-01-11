export type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';

export interface RoleConfig {
    gridArea: string;
    overflow: OverflowBehavior;
    htmlTag: string;
    ariaProps?: Record<string, string>;
    baseStyles: string;
    description?: string;
}
