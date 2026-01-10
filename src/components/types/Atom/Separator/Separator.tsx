import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig } from '@/components/types/Block/role-config';

const separatorVariants = cva('shrink-0 bg-border-default', {
    variants: {
        orientation: {
            horizontal: 'h-[1px] w-full',
            vertical: 'h-full w-[1px]',
        },
        role: {
            ToolbarDivider: 'bg-border-muted h-4 w-px self-center mx-1',
            Divider: '',
        }
    },
    defaultVariants: {
        orientation: 'horizontal',
    },
});

export interface SeparatorProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
    role?: 'Divider' | 'ToolbarDivider';
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}

export function Separator({
    className,
    orientation = 'horizontal',
    role = 'Divider',
    decorative = true,
    ...props
}: SeparatorProps) {
    // ToolbarDivider implies vertical orientation usually, but let's stick to defaults or overrides
    // Actually ToolbarDivider is specific.
    return (
        <div
            role={decorative ? 'none' : 'separator'}
            aria-orientation={decorative ? undefined : orientation}
            className={cn(
                separatorVariants({ orientation, role }),
                className
            )}
            data-role={role}
            {...props}
        />
    );
}
