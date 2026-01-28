import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// --- Animations ---
const fadeInUp = keyframes({
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
});

// --- Layout ---
export const container = style({
    height: '100%', // Fit parent (contentArea) which is 100vh
    width: '100%',
    backgroundColor: vars.color.white,
    color: vars.color.gray900,
    fontFamily: vars.font.body,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
});

export const contentWrapper = style({
    maxWidth: '1000px',
    margin: '0 auto',
    padding: `0 ${vars.spacing[32]}`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
});

// --- Header ---
export const header = style({
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vars.spacing[64],
});

export const logo = style({
    fontSize: vars.fontSize.lg, // Smaller, more minimal
    fontWeight: vars.weight.bold,
    letterSpacing: '-0.02em',
    color: vars.color.gray900,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const navLink = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.gray500,
    textDecoration: 'none',
    marginLeft: vars.spacing[24],
    transition: 'color 0.2s',
    ':hover': {
        color: vars.color.gray900
    }
});

// --- Hero Section ---
export const heroSection = style({
    padding: `${vars.spacing[64]} 0 ${vars.spacing[80]}`,
    animation: `${fadeInUp} 0.8s ease-out`,
});

export const heroTitle = style({
    fontSize: 'clamp(3rem, 6vw, 5rem)',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.04em',
    marginBottom: vars.spacing[32],
    color: vars.color.gray900,
});

export const heroSubtitle = style({
    fontSize: '1.5rem',
    color: vars.color.gray500,
    maxWidth: '680px',
    lineHeight: 1.5,
    fontWeight: 400,
    marginBottom: vars.spacing[64],
});

// --- Section General ---
export const section = style({
    padding: `${vars.spacing[80]} 0`,
    borderTop: `1px solid ${vars.color.gray100}`,
});

export const sectionTitle = style({
    fontSize: vars.fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: vars.color.gray400,
    fontWeight: 600,
    marginBottom: vars.spacing[40],
    display: 'block',
});

// --- Concept Grid ---
export const conceptGrid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: vars.spacing[64],
    '@media': {
        'screen and (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
        }
    }
});

export const conceptItem = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[16],
});

export const conceptTitle = style({
    fontSize: vars.fontSize.xxl,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: vars.color.gray900,
});

export const conceptText = style({
    fontSize: vars.fontSize.md,
    color: vars.color.gray600,
    lineHeight: 1.6,
});

// --- Philosophy Section ---
export const philosophyText = style({
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
    color: vars.color.gray800,
    maxWidth: '900px',
});

// --- Footer ---
export const footer = style({
    padding: `${vars.spacing[64]} 0 ${vars.spacing[32]}`,
    borderTop: `1px solid ${vars.color.gray100}`,
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: vars.color.gray400,
    fontSize: vars.fontSize.sm,
});
