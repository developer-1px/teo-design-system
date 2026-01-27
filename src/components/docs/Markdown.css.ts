import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// 2025 "Editorial Tech" Design System
// Concept: High Contrast, Tight Letter Spacing, Elegant Details

export const prose = style({
    fontFamily: vars.font.body,
    fontSize: '15px', // Ideally 15px for modern docs (between 14 and 16)
    lineHeight: '1.65', // Relaxed reading flow
    color: '#333', // Softer black for body text
    letterSpacing: '-0.01em', // Modern sans-serif feel

    // Grid Layout: Left-Aligned Asymmetric
    // [Text Column (Fixed 680px)] [Expansion Space (Flex)]
    display: 'grid',
    gridTemplateColumns: 'min(680px, 100%) 1fr',
    gridAutoFlow: 'row', // Force row breaking
    columnGap: '64px', // Airy gap
    rowGap: '0', // Vertical rhythm handled by explicit margins
    alignItems: 'start',
    width: '100%',
});

// Default Placement
globalStyle(`${prose} > *`, {
    gridColumn: '1',
    minWidth: 0,
    maxWidth: '100%',
});

// Breakout Elements (Expand Right)
globalStyle(`${prose} > table, ${prose} > .wide, ${prose} > div`, {
    gridColumn: '1 / -1',
    width: '100%',
});

// Text Selection (Premium feel)
globalStyle(`${prose} ::selection`, {
    backgroundColor: '#Cce5ff', // Soft Blue matches tech vibe
    color: '#000',
});

// Headings - "Editorial"
// Strict hierarchy, tighter spacing, very dark colors
globalStyle(`${prose} h1`, {
    fontSize: '2.25rem', // 36px
    fontWeight: '750', // Heavy but not Black
    letterSpacing: '-0.03em', // Tight
    lineHeight: '1.15',
    color: '#111', // Almost black
    marginBottom: '1rem',
    marginTop: 0,
});

globalStyle(`${prose} h2`, {
    fontSize: '1.5rem', // 24px (Reduced from 1.75 to match Pro vibe)
    fontWeight: '650', // SemiBold+
    letterSpacing: '-0.02em',
    color: '#111',
    marginTop: '2.5rem',
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px dashed ${vars.border.default}`, // Dashed line for technical feel
    gridColumn: '1 / -1', // H2 spans full width
    display: 'flex',
    alignItems: 'center',
});

globalStyle(`${prose} h3`, {
    fontSize: '1.25rem', // 20px
    fontWeight: '600',
    letterSpacing: '-0.015em',
    color: '#222',
    marginTop: '2rem',
    marginBottom: '0.5rem',
});

globalStyle(`${prose} h4`, {
    fontWeight: '600',
    color: '#444',
    marginTop: '1.5rem',
    marginBottom: '0.25rem',
    textTransform: 'uppercase', // Section-like feel
    letterSpacing: '0.04em',
    fontSize: '0.85rem',
});

// Paragraphs
globalStyle(`${prose} p`, {
    marginBottom: '1.25rem', // Restore vertical rhythm
    marginTop: 0,
    maxWidth: '100%',
});

// Links - "Elegant"
globalStyle(`${prose} a`, {
    color: vars.color.gray800,
    textDecoration: 'none',
    borderBottom: `1px solid ${vars.color.gray300}`,
    transition: 'border-color 0.2s, color 0.2s',
    fontWeight: '500',
    paddingBottom: '1px',
});

globalStyle(`${prose} a:hover`, {
    color: '#000',
    borderBottomColor: '#000',
});

// Strong
globalStyle(`${prose} strong, ${prose} b`, {
    fontWeight: '700',
    color: '#000',
});

// Lists - "Custom Markers"
globalStyle(`${prose} ul`, {
    paddingLeft: '1.25rem',
    margin: 0,
    marginBottom: '1.25rem',
    listStyle: 'none', // Remove default bullets
});

globalStyle(`${prose} ul li`, {
    position: 'relative',
    paddingLeft: '0.5rem',
    marginBottom: '0.5rem',
});

globalStyle(`${prose} ul li::before`, {
    content: '""',
    position: 'absolute',
    left: '-1rem',
    top: '0.65em', // optical center
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: vars.color.gray300, // Subtle dot (Fixed gray400->gray300)
});

globalStyle(`${prose} ol`, {
    paddingLeft: '1.25rem',
    margin: 0,
    marginBottom: '1.25rem',
    color: vars.color.gray600,
});

globalStyle(`${prose} ol li`, {
    paddingLeft: '0.5rem',
    marginBottom: '0.5rem',
    fontVariantNumeric: 'tabular-nums',
});

// Blockquote - "Callout Style"
globalStyle(`${prose} blockquote`, {
    // No border-left, but a full background style
    backgroundColor: '#F7F7F8', // Very subtle gray
    borderRadius: '12px',
    padding: '1.25rem 1.75rem',
    color: '#444',
    fontStyle: 'normal',
    border: '1px solid rgba(0,0,0,0.03)',
    margin: '1.5rem 0',
});

// Blockquote content usually wrapped in P, so let's style that
globalStyle(`${prose} blockquote p`, {
    margin: 0,
});

// Tables - "Data Sheet"
globalStyle(`${prose} table`, {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '0.9rem',
    margin: '2rem 0',
    fontVariantNumeric: 'tabular-nums',
});

globalStyle(`${prose} th`, {
    textAlign: 'left',
    padding: '12px 0',
    paddingRight: '20px',
    borderBottom: `2px solid ${vars.color.gray200}`,
    color: '#000',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
});

globalStyle(`${prose} td`, {
    padding: '14px 0',
    paddingRight: '20px',
    borderBottom: `1px solid ${vars.color.gray200}`,
    color: '#555',
    verticalAlign: 'top',
});

globalStyle(`${prose} tr:last-child td`, {
    borderBottom: 'none',
});

// Code Blocks - "Terminal"
globalStyle(`${prose} pre`, {
    gridColumn: '1', // Keep inside text column
    backgroundColor: '#18181b', // Zinc 900
    color: '#f4f4f5',
    padding: '1.25rem',
    borderRadius: '12px',
    overflowX: 'auto',
    fontSize: '13px',
    lineHeight: '1.6',
    border: `1px solid rgba(0,0,0,0.1)`,
    margin: '1.5rem 0',
    fontFamily: vars.font.code,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', // Subtle drop shadow
});

globalStyle(`${prose} code`, {
    fontFamily: vars.font.code,
    fontSize: '0.875em',
    color: 'inherit', // Inherit from pre
});

// Inline Code - "Badge"
globalStyle(`${prose} :not(pre) > code`, {
    backgroundColor: 'rgba(0,0,0,0.04)', // Transparent mix
    border: `1px solid rgba(0,0,0,0.06)`,
    padding: '0.1rem 0.3rem',
    borderRadius: '6px',
    color: '#C02040', // Slightly muted red, popular in tech docs
    fontWeight: '500',
    fontSize: '0.9em',
    fontFamily: vars.font.code,
});

export const wideContainer = style({
    gridColumn: '1 / -1',
    width: '100%',
});
