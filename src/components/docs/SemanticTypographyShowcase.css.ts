import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui } from '../../styles/utils.css';

// 1. Panel Container (The "Real World" Context)
export const panel = style([
    surface('card'),
    {
        display: 'flex',
        width: '100%',
        maxWidth: '600px',
        borderRadius: vars.borderRadius.lg,
        overflow: 'hidden',
        border: `1px solid ${vars.border.subtle}`,
    }
]);

// 2. Sidebar (Navigation context for ui.menu)
export const sidebar = style([
    surface('subtle'),
    {
        width: '160px',
        padding: vars.spacing[16],
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[4],
        borderRight: `1px solid ${vars.border.subtle}`,
        flexShrink: 0,
    }
]);

export const menuItem = style([
    ui.menu(),
    {
        padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
        borderRadius: vars.borderRadius.sm,
        cursor: 'pointer',
        color: vars.color.gray600,
        ':hover': {
            backgroundColor: vars.color.gray200,
            color: vars.color.gray900,
        }
    }
]);

export const activeMenuItem = style([
    menuItem,
    {
        backgroundColor: vars.color.white,
        color: vars.color.gray900,
        boxShadow: vars.shadow.raised,
        fontWeight: vars.weight.bold,
    }
]);

// 3. Main Content
export const content = style({
    flex: 1,
    padding: vars.spacing[24],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[24],
});

// 4. Usage of Semantic Typography

export const sectionTitle = style([
    ui.overline(),
    {
        color: vars.color.gray500,
        paddingBottom: vars.spacing[8],
        borderBottom: `1px solid ${vars.border.subtle}`,
        marginBottom: vars.spacing[16],
    }
]);

export const formGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
});

export const label = style([
    ui.label('sm'),
    {
        color: vars.color.gray800,
    }
]);

export const input = style([
    surface('input'),
    ui.caption(),
    {
        width: '100%',
        padding: '8px 12px',
        borderRadius: vars.borderRadius.sm,
        color: vars.color.gray900,
    }
]);

export const helperText = style([
    ui.caption(),
    {
        color: vars.color.gray500,
    }
]);

export const codeBlock = style([
    ui.code(),
    {
        backgroundColor: vars.color.gray100,
        padding: '2px 6px',
        borderRadius: '4px',
        color: vars.color.pink500, // Accent color for code
        border: `1px solid ${vars.color.gray200}`,
    }
]);
