import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const readerContainer = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: vars.surface.base.bg,
});

export const toolbar = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[16],
    padding: `${vars.spacing[12]} ${vars.spacing[24]}`,
    borderBottom: `1px solid ${vars.color.gray100}`,
});

export const backButton = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.spacing[8],
    borderRadius: '50%',
    cursor: 'pointer',
    color: vars.color.gray600,
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color 0.1s',
    ':hover': {
        backgroundColor: vars.color.gray100,
        color: vars.color.gray800,
    }
});

export const scrollArea = style({
    flex: 1,
    overflowY: 'auto',
    padding: `${vars.spacing[32]} ${vars.spacing[48]}`, // Paper-like padding
});

export const title = style({
    fontSize: '24px',
    fontWeight: vars.weight.bold,
    marginBottom: vars.spacing[24],
    color: vars.color.gray900,
    lineHeight: 1.3,
});

export const metaInfo = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[12],
    marginBottom: vars.spacing[32],
    color: vars.color.gray600,
    fontSize: vars.fontSize.md,
    paddingBottom: vars.spacing[24],
    borderBottom: `1px solid ${vars.color.gray100}`,
});

export const markdownBody = style({
    fontSize: '15px', // Readable size
    lineHeight: 1.6,
    color: vars.color.gray800,
    maxWidth: '800px', // Readable line length
});

// Markdown Styles
globalStyle(`${markdownBody} h1`, {
    fontSize: '2em',
    fontWeight: '700',
    marginTop: '1.5em',
    marginBottom: '0.8em',
});

globalStyle(`${markdownBody} h2`, {
    fontSize: '1.5em',
    fontWeight: '600',
    marginTop: '1.5em',
    marginBottom: '0.8em',
    borderBottom: `1px solid ${vars.color.gray100}`,
    paddingBottom: '0.3em',
});

globalStyle(`${markdownBody} h3`, {
    fontSize: '1.25em',
    fontWeight: '600',
    marginTop: '1.2em',
    marginBottom: '0.5em',
});

globalStyle(`${markdownBody} p`, {
    marginTop: '0',
    marginBottom: '1em',
});

globalStyle(`${markdownBody} ul, ${markdownBody} ol`, {
    paddingLeft: '1.5em',
    marginBottom: '1em',
});

globalStyle(`${markdownBody} blockquote`, {
    borderLeft: `4px solid ${vars.color.gray200}`,
    margin: '1em 0',
    paddingLeft: '1em',
    color: vars.color.gray600,
    fontStyle: 'italic',
});

globalStyle(`${markdownBody} code`, {
    backgroundColor: vars.color.gray100,
    padding: '0.2em 0.4em',
    borderRadius: '4px',
    fontSize: '0.9em',
    fontFamily: 'monospace',
    color: vars.color.primary,
});

globalStyle(`${markdownBody} pre`, {
    backgroundColor: '#f6f8fa', // GitHub-like
    padding: '16px',
    overflow: 'auto',
    borderRadius: '6px',
    marginBottom: '1em',
});

globalStyle(`${markdownBody} pre code`, {
    backgroundColor: 'transparent',
    padding: 0,
    color: 'inherit',
});

globalStyle(`${markdownBody} table`, {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1em',
});

globalStyle(`${markdownBody} th, ${markdownBody} td`, {
    border: `1px solid ${vars.color.gray200}`,
    padding: '8px 12px',
    textAlign: 'left',
});

globalStyle(`${markdownBody} th`, {
    backgroundColor: vars.color.gray50,
    fontWeight: '600',
});
