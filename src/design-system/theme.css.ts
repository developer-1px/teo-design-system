import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
    space: {
        n0: "0px",
        n1: "1px",
        n2: "2px",
        n4: "4px",
        n6: "6px",
        n8: "8px",
        n10: "10px",
        n12: "12px",
        n14: "14px",
        n16: "16px",
        n18: "18px",
        n20: "20px",
        n22: "22px",
        n24: "24px",
        n26: "26px",
        n28: "28px",
        n30: "30px",
        n32: "32px",
        n36: "36px",
        n40: "40px",
        n44: "44px",
        n48: "48px",
        n56: "56px",
        n64: "64px",
        n72: "72px",
        n80: "80px",
        n88: "88px",
        n96: "96px",
        n112: "112px",
        n128: "128px",
        n144: "144px",
        n160: "160px",
    },
    radius: {
        n0: "0px",
        n2: "2px",
        n4: "4px",
        n6: "6px",
        n8: "8px",
        n10: "10px",
        n12: "12px",
        n14: "14px",
        n16: "16px",
        n20: "20px",
        n24: "24px",
        n28: "28px",
        n32: "32px",
        full: "9999px",
    },
    color: {
        surface: {
            page: "#ffffff",
            panel: "#f9f9fb",
            card: "#ffffff",
            overlay: "#ffffff",
            base: "#ffffff",
            sunken: "#f9f9fb",
            raised: "#ffffff",
            selected: "rgba(99, 102, 241, 0.12)",
            primary: "#18181b",
        },
        text: {
            primary: "#18181b",
            body: "#3f3f46",
            secondary: "#3f3f46",
            tertiary: "#71717a", // Mapped from subtle
            subtle: "#71717a",
            muted: "#a1a1aa",
            dim: "#d4d4d8",
            inverse: "#ffffff",
        },
        border: {
            subtle: "rgba(0, 0, 0, 0.08)",
            default: "rgba(0, 0, 0, 0.08)",
            hover: "rgba(0, 0, 0, 0.12)",
            focus: "rgba(24, 24, 27, 0.4)",
        },
        tone: {
            warning: {
                bg: "#fef08a",
                border: "#facc15",
            },
            critical: {
                bg: "#fecaca",
                text: "#ef4444",
            }
        }
    },
    elevation: {
        n0: "none",
        n1: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        n2: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        n3: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
        n4: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)",
        n5: "0 25px 50px -12px rgba(0, 0, 0, 0.20)",
    },
    font: {
        family: {
            sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
        size: {
            n9: "9px",
            n10: "10px",
            n11: "11px",
            n12: "12px",
            n13: "13px",
            n14: "14px",
            n15: "15px",
            n16: "16px",
            n18: "18px",
            n20: "20px",
            n24: "24px",
            n32: "32px",
            n48: "48px",
        },
        weight: {
            regular: "400",
            medium: "500",
            bold: "700",
        },
        lineHeight: {
            none: "1",
            tight: "1.25",
            snug: "1.375",
            normal: "1.5",
            relaxed: "1.625",
            loose: "2",
        },
        letterSpacing: {
            tighter: "-0.05em",
            tight: "-0.025em",
            normal: "0em",
            wide: "0.025em",
            wider: "0.05em",
            widest: "0.1em",
        }
    },
    layer: {
        base: "0",
        elevated: "10",
        floating: "100",
        sticky: "500",
        modal: "1000",
        toast: "2000",
    },
    opacity: {
        human: "1",     // Fully visible
        ghost: "0.5",   // Disabled / Placeholder
        subtle: "0.7",  // Inactive
        hover: "0.9",   // Hover state
    },
    motion: {
        duration: {
            fast: "150ms",
            normal: "300ms",
            slow: "500ms",
        },
        timing: {
            easeOut: "cubic-bezier(0, 0, 0.2, 1)",
            easeIn: "cubic-bezier(0.4, 0, 1, 1)",
            easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
    },
    aspect: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
        portrait: "3 / 4",
        widescreen: "21 / 9",
    }
});
