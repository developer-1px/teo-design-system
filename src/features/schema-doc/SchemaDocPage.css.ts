import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: vars.color.white,
    fontFamily: vars.font.body,
    color: vars.color.gray900,
});

export const header = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${vars.spacing[20]} ${vars.spacing[40]}`,
    borderBottom: `1px solid ${vars.color.gray200}`,
    backgroundColor: vars.color.white,
    position: 'sticky',
    top: 0,
    zIndex: 10,
});

export const titleSection = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[4],
});

export const title = style({
    fontSize: vars.fontSize.xxl,
    fontWeight: vars.weight.bold,
    color: vars.color.gray900,
    margin: 0,
});

export const subtitle = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.gray500,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const badge = style({
    padding: `${vars.spacing[4]} ${vars.spacing[8]}`,
    borderRadius: vars.borderRadius.sm,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.medium,
});

export const badgeStable = style([badge, {
    backgroundColor: vars.color.green100,
    color: vars.color.green800,
}]);

export const mainLayout = style({
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    flex: 1,
    overflow: 'hidden',
});

export const contentArea = style({
    padding: `${vars.spacing[32]} ${vars.spacing[40]}`,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[32],
});

export const tabGroup = style({
    display: 'flex',
    gap: vars.spacing[24],
    borderBottom: `1px solid ${vars.color.gray200}`,
    marginBottom: vars.spacing[8],
});

export const tab = style({
    padding: `${vars.spacing[12]} 0`,
    fontSize: vars.fontSize.md,
    color: vars.color.gray500,
    cursor: 'pointer',
    position: 'relative',
    border: 'none',
    backgroundColor: 'transparent',
    fontWeight: vars.weight.medium,
    transition: 'color 0.2s',
    ':hover': {
        color: vars.color.gray900,
    },
});

export const tabActive = style({
    color: vars.color.gray900,
    fontWeight: vars.weight.bold,
    '::after': {
        content: '""',
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: vars.color.gray900,
    },
});

export const summaryContainer = style({
    display: 'flex',
    gap: vars.spacing[12],
});

export const summaryChip = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
    padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
    borderRadius: vars.borderRadius.md,
    fontSize: vars.fontSize.sm,
    backgroundColor: vars.color.gray100,
    border: `1px solid ${vars.color.gray200}`,
});

export const chipNew = style({
    color: vars.color.green700,
    borderColor: vars.color.green400,
    backgroundColor: vars.color.green50,
});

export const chipDel = style({
    color: vars.color.red700,
    borderColor: vars.color.red400,
    backgroundColor: vars.color.red50,
});

export const chipMod = style({
    color: vars.color.amber700,
    borderColor: vars.color.amber400,
    backgroundColor: vars.color.amber50,
});

export const tableContainer = style({
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
});

export const tableCell = style({
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    borderBottom: `1px solid ${vars.color.gray200}`,
    fontSize: vars.fontSize.sm,
    textAlign: 'left',
    verticalAlign: 'top',
});

export const tableHeader = style([tableCell, {
    backgroundColor: vars.color.gray50,
    fontWeight: vars.weight.medium,
    color: vars.color.gray600,
    borderTop: `1px solid ${vars.color.gray200}`,
}]);

export const rowNew = style({
    backgroundColor: vars.color.green50,
});

export const rowDel = style({
    backgroundColor: vars.color.red50,
    textDecoration: 'line-through !important',
    color: `${vars.color.gray400} !important`,
});

export const rowMod = style({
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
});

export const typeChange = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
    color: vars.color.gray500,
});

export const typeArrow = style({
    color: vars.color.gray400,
});

export const indent = style({
    display: 'inline-block',
    width: vars.spacing[24],
});

export const fieldNameContainer = style({
    display: 'flex',
    alignItems: 'center',
    fontFamily: vars.font.code,
    fontWeight: vars.weight.medium,
});

export const treeLine = style({
    color: vars.color.gray300,
    marginRight: vars.spacing[8],
});

export const sidePanel = style({
    borderLeft: `1px solid ${vars.color.gray200}`,
    backgroundColor: vars.color.gray50,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

export const panelHeader = style({
    padding: vars.spacing[20],
    borderBottom: `1px solid ${vars.color.gray200}`,
    fontWeight: vars.weight.bold,
    fontSize: vars.fontSize.md,
});

export const historyList = style({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
});

export const historyItem = style({
    padding: vars.spacing[16],
    borderBottom: `1px solid ${vars.color.gray200}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: vars.color.gray100,
    },
});

export const historyActive = style({
    backgroundColor: vars.color.white,
    borderLeft: `4px solid ${vars.color.primary}`,
});

export const historyTitle = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
    marginBottom: vars.spacing[4],
});

export const historyMeta = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.gray500,
});

export const impactSection = style({
    marginTop: vars.spacing[24],
    padding: vars.spacing[24],
    backgroundColor: vars.color.red50,
    borderRadius: vars.borderRadius.lg,
    border: `1px solid ${vars.color.red100}`,
});

export const impactTitle = style({
    fontSize: vars.fontSize.md,
    fontWeight: vars.weight.bold,
    color: vars.color.red800,
    marginBottom: vars.spacing[8],
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const impactContent = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.red700,
    lineHeight: vars.lineHeight.standard,
});
