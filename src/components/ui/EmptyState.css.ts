import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const container = recipe({
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: vars.spacing[32],
        textAlign: 'center',
        borderRadius: vars.borderRadius.md,
        border: `1px dashed ${vars.color.border}`,
        backgroundColor: vars.color.gray50,
        color: vars.color.mutedForeground,
    },
});

export const iconWrapper = recipe({
    base: {
        marginBottom: vars.spacing[16],
        color: vars.color.gray400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: vars.borderRadius.full,
        backgroundColor: vars.color.white,
        border: `1px solid ${vars.color.gray200}`,
    }
});

export const title = recipe({
    base: {
        color: vars.color.primary,
        fontWeight: vars.weight.medium,
        fontSize: vars.fontSize.lg,
        marginBottom: vars.spacing[8],
    }
});

export const description = recipe({
    base: {
        color: vars.color.mutedForeground,
        fontSize: vars.fontSize.sm,
        maxWidth: '400px',
        marginBottom: vars.spacing[24],
        lineHeight: vars.lineHeight.relaxed,
    }
});

export const actions = recipe({
    base: {
        display: 'flex',
        gap: vars.spacing[12],
    }
});
