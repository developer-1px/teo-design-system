import { css } from "@/lib/engine";

export const footer = css({
    borderTop: "1px solid var(--border-color)",
    borderBottom: "none",
});

export const content = css({
    flexDirection: "column",
    gap: "64px",
    padding: "64px 0",
});

export const topSection = css({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
});

export const brandColumn = css({
    width: "35%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
});

export const brandHeader = css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const commonIconWrapper = css({
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "var(--color-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

export const brandName = css({
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "-0.02em",
});

export const brandDesc = css({
    fontSize: "16px",
    lineHeight: "1.6",
    opacity: 0.7,
    color: "var(--text-secondary)",
});

export const socialIcons = css({
    display: "flex",
    gap: "16px",
});

export const socialIcon = css({
    opacity: 0.4,
});

export const linksSection = css({
    display: "flex",
    gap: "48px",
});

export const linkColumn = css({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
});

export const linkTitle = css({
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    color: "var(--text-tertiary)",
});

export const linkList = css({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

export const linkItem = css({
    fontSize: "14px",
    color: "var(--text-secondary)",
    opacity: 0.6,
    textDecoration: "none",
});

export const bottomBar = css({
    width: "100%",
    paddingTop: "32px",
    borderTop: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const copyright = css({
    fontSize: "13px",
    color: "var(--text-tertiary)",
});

export const legalLinks = css({
    display: "flex",
    gap: "16px",
});

export const legalLink = css({
    fontSize: "13px",
    color: "var(--text-tertiary)",
    textDecoration: "none",
});
