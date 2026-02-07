import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@surface/tokens';

// 1. HARD RESET
globalStyle('*, *:before, *:after', {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
});

// 2. BASE HTML/BODY
globalStyle('body, html', {
    height: '100%',
    overflow: 'hidden',
    fontFamily: vars.font.body,
    fontSize: vars.fontSize.md,
    backgroundColor: vars.color.white,
    color: vars.color.gray800,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
});

// 3. TYPOGRAPHY RESET
globalStyle('h1, h2, h3, h4, h5, h6', {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
});

globalStyle('p, blockquote, dl, dd, ol, ul, figure, hr', {
    margin: 0,
});

globalStyle('ol, ul', {
    listStyle: 'none',
});

// 4. INTERACTIVE RESET
globalStyle('button, input, optgroup, select, textarea', {
    fontFamily: 'inherit',
    fontSize: '100%',
    lineHeight: '1.15',
    margin: 0,
    border: 'none',
    background: 'none',
    outline: 'none',
});

globalStyle('button', {
    cursor: 'pointer',
    textTransform: 'none',
});

globalStyle('a', {
    textDecoration: 'none',
    color: 'inherit',
});

globalStyle('img, svg, video, canvas, audio, iframe, embed, object', {
    display: 'block',
    verticalAlign: 'middle',
    maxWidth: '100%',
});
