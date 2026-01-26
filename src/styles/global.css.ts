import { globalStyle } from '@vanilla-extract/css';
import { vars } from './vars.css';

globalStyle('body, html', {
    margin: 0,
    padding: 0,
    fontFamily: vars.font.body,
    backgroundColor: vars.color.white,
    color: vars.color.gray800,
    height: '100%',
    overflow: 'hidden', // App-like behavior
});

globalStyle('*', {
    boxSizing: 'border-box',
});
