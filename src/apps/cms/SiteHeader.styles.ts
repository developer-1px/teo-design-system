import { css } from "@/lib/engine";

export const siteHeader = css({
    height: "64px",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    columnGap: "32px",
    borderBottom: "1px solid var(--border-color)",
    backgroundColor: "var(--surface-base)",
    position: "sticky",
    top: 0,
    zIndex: 10,
});

export const brandSection = css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const logoWrapper = css({
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "var(--color-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--elevation-n1)",
});

export const logoText = css({
    fontWeight: "bold",
    fontSize: "16px",
    color: "white",
});

export const brandName = css({
    fontWeight: "bold",
    fontSize: "18px",
});

export const navSection = css({
    display: "flex",
    alignItems: "center",
    gap: "32px",
});

export const navLinks = css({
    display: "flex",
    gap: "8px",
});

export const navLink = css({
    height: "32px",
    padding: "0 12px",
    background: "transparent",
    border: "none",
});

export const divider = css({
    width: "1px",
    height: "20px",
    backgroundColor: "var(--border-color)",
});

export const actionSection = css({
    display: "flex",
    gap: "12px",
});

export const loginBtn = css({
    height: "36px",
    padding: "0 16px",
    background: "transparent",
    border: "none",
});

export const ctaBtn = css({
    height: "36px",
    padding: "0 20px",
    fontSize: "13px",
});
