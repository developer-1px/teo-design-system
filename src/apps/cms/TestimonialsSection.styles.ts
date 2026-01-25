import { css } from "@/lib/engine";

export const header = css({
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
});

export const label = css({
    fontSize: "12px",
    fontWeight: "bold",
    color: "var(--color-primary)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
});

export const title = css({
    fontSize: "36px",
    fontWeight: "bold",
    lineHeight: "1.2",
});

export const grid = css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
});

export const card = css({
    padding: "32px",
    borderRadius: "24px",
    backgroundColor: "var(--surface-sunken)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    border: "1px solid var(--border-color)",
    height: "100%",
});

export const stars = css({
    display: "flex",
    gap: "4px",
});

export const quote = css({
    fontSize: "16px",
    lineHeight: "1.6",
    color: "var(--text-primary)",
    flex: 1,
});

export const author = css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const avatar = css({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--surface-raised)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
    border: "1px solid var(--border-color)",
});

export const authorInfo = css({
    display: "flex",
    flexDirection: "column",
    gap: "2px",
});

export const authorName = css({
    fontWeight: "bold",
    fontSize: "14px",
});

export const authorRole = css({
    fontSize: "12px",
    color: "var(--text-secondary)",
});
