import { css } from "@/lib/engine";

export const header = css({
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
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

export const description = css({
    fontSize: "16px",
    color: "var(--text-secondary)",
});

export const toggleWrapper = css({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px",
    backgroundColor: "var(--surface-sunken)",
    borderRadius: "99px",
    marginTop: "16px",
    border: "1px solid var(--border-color)",
});

export const toggleBtn = css({
    padding: "6px 16px",
    borderRadius: "99px",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "transparent",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
});

export const toggleBtnActive = css({
    backgroundColor: "var(--surface-raised)",
    color: "var(--text-primary)",
    boxShadow: "var(--elevation-n2)",
});

export const discountBadge = css({
    fontSize: "10px",
    color: "var(--color-success)",
    fontWeight: "bold",
});

export const cardGrid = css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
    alignItems: "start",
});

export const card = css({
    padding: "32px",
    borderRadius: "24px",
    backgroundColor: "var(--surface-base)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    border: "1px solid var(--border-color)",
    position: "relative",
});

export const cardFeatured = css({
    backgroundColor: "var(--surface-raised)",
    border: "1px solid var(--color-primary)",
    boxShadow: "0 0 0 1px var(--color-primary), var(--elevation-n5)",
    transform: "scale(1.02)",
});

export const popularBadge = css({
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "4px 12px",
    borderRadius: "99px",
    backgroundColor: "var(--color-primary)",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "var(--elevation-n3)",
});

export const cardHeader = css({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

export const cardTitle = css({
    fontSize: "18px",
    fontWeight: "bold",
});

export const cardDesc = css({
    fontSize: "14px",
    color: "var(--text-secondary)",
});

export const priceWrapper = css({
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
});

export const price = css({
    fontSize: "40px",
    fontWeight: "bold",
});

export const priceSuffix = css({
    fontSize: "14px",
    color: "var(--text-secondary)",
});

export const featuresList = css({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingTop: "12px",
});

export const featureItem = css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const checkIconWrapper = css({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "var(--surface-sunken)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
});

export const checkIconWrapperFeatured = css({
    backgroundColor: "var(--color-primary)",
});

export const featureText = css({
    fontSize: "14px",
});
