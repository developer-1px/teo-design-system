import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Container
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n64,
    paddingBottom: vars.space.n64,
}));

// 2. Header (Split layout: Title on left, FAQ list on right? Or just centered?)
// Let's do a centered layout for FAQ usually
export const header = style(utils.createFlex({
    ...utils.grid12.center(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: vars.space.n40,
    gap: vars.space.n16,
}));

export const title = style({
    fontSize: "32px",
    fontWeight: 700,
    color: vars.color.text,
});

// 3. FAQ List
export const faqList = style(utils.createFlex({
    ...utils.grid12.center(8), // Center 8 columns
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,

    "@container": {
        "viewport (max-width: 600px)": {
            ...utils.grid12.fullWidth,
            padding: `0 ${vars.space.n16}`,
        }
    }
}));

export const faqItem = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    padding: vars.space.n24,
    backgroundColor: vars.color.surface,
    borderRadius: vars.radius.n8,
    border: `1px solid ${vars.color.border}`,
}));

export const question = style({
    fontSize: "18px",
    fontWeight: 600,
    color: vars.color.text,
    marginBottom: vars.space.n8,
});

export const answer = style({
    fontSize: "16px",
    lineHeight: 1.6,
    color: vars.color.textSecondary,
});
