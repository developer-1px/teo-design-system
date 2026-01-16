/**
 * Constants and token mapping tables for design-lint
 */

/**
 * File patterns to analyze
 */
export const TARGET_PATTERNS = [
  "src/App.tsx",
  "src/apps/**/*.tsx",
  "src/components/**/*.tsx",
  "src/inspector/**/*.tsx",
  "src/design-system/**/*.tsx",
];

/**
 * Space token mapping: CSS pixel value → Space token name
 */
export const SPACE_VALUES_TO_TOKENS: Record<string, string> = {
  "0px": "Space.n0",
  "2px": "Space.n2",
  "4px": "Space.n4",
  "6px": "Space.n6",
  "8px": "Space.n8",
  "10px": "Space.n10",
  "12px": "Space.n12",
  "14px": "Space.n14",
  "16px": "Space.n16",
  "18px": "Space.n18",
  "20px": "Space.n20",
  "22px": "Space.n22",
  "24px": "Space.n24",
  "26px": "Space.n26",
  "28px": "Space.n28",
  "30px": "Space.n30",
  "32px": "Space.n32",
  "36px": "Space.n36",
  "40px": "Space.n40",
  "44px": "Space.n44",
  "48px": "Space.n48",
  "56px": "Space.n56",
  "64px": "Space.n64",
  "72px": "Space.n72",
  "80px": "Space.n80",
  "88px": "Space.n88",
  "96px": "Space.n96",
  "112px": "Space.n112",
  "128px": "Space.n128",
  "144px": "Space.n144",
  "160px": "Space.n160",
};

/**
 * Size token mapping: CSS value → Size token name
 */
export const SIZE_VALUES_TO_TOKENS: Record<string, string> = {
  "100%": "Size.fill",
  "100vh": "Size.screen",
  "100vw": "Size.screen",
  "0px": "Size.n0",
  "12px": "Size.n12",
  "16px": "Size.n16",
  "20px": "Size.n20",
  "24px": "Size.n24",
  "28px": "Size.n28",
  "32px": "Size.n32",
  "36px": "Size.n36",
  "40px": "Size.n40",
  "44px": "Size.n44",
  "48px": "Size.n48",
  "56px": "Size.n56",
  "64px": "Size.n64",
  "80px": "Size.n80",
  "96px": "Size.n96",
  "128px": "Size.n128",
  "160px": "Size.n160",
  "192px": "Size.n192",
  "224px": "Size.n224",
  "240px": "Size.n240",
  "256px": "Size.n256",
  "320px": "Size.n320",
  "384px": "Size.n384",
  "448px": "Size.n448",
  "512px": "Size.n512",
  "640px": "Size.n640",
  "768px": "Size.n768",
  "896px": "Size.n896",
  "1024px": "Size.n1024",
  "1200px": "Size.n1200",
};

/**
 * Opacity token mapping: CSS opacity value → Opacity token name
 */
export const OPACITY_VALUES_TO_TOKENS: Record<string, string> = {
  "0": "Opacity.n0",
  "0.05": "Opacity.n5",
  "0.1": "Opacity.n10",
  "0.15": "Opacity.n15",
  "0.2": "Opacity.n20",
  "0.25": "Opacity.n25",
  "0.3": "Opacity.n30",
  "0.35": "Opacity.n35",
  "0.4": "Opacity.n40",
  "0.45": "Opacity.n45",
  "0.5": "Opacity.n50",
  "0.55": "Opacity.n55",
  "0.6": "Opacity.n60",
  "0.65": "Opacity.n65",
  "0.7": "Opacity.n70",
  "0.75": "Opacity.n75",
  "0.8": "Opacity.n80",
  "0.85": "Opacity.n85",
  "0.9": "Opacity.n90",
  "0.95": "Opacity.n95",
  "1": "Opacity.n100",
};

/**
 * ZIndex token mapping: CSS z-index value → ZIndex token name
 */
export const ZINDEX_VALUES_TO_TOKENS: Record<string, string> = {
  "0": "ZIndex.n0",
  "1": "ZIndex.n1",
  "2": "ZIndex.n2",
  "3": "ZIndex.n3",
  "5": "ZIndex.n5",
  "10": "ZIndex.n10",
  "20": "ZIndex.n20",
  "30": "ZIndex.n30",
  "40": "ZIndex.n40",
  "50": "ZIndex.n50",
  "75": "ZIndex.n75",
  "100": "ZIndex.n100",
  "200": "ZIndex.n200",
  // Common large values mapped to closest token
  "999": "ZIndex.n200",
  "9999": "ZIndex.n200",
  "99999": "ZIndex.n200",
};

/**
 * CSS property → Override prop mapping
 * Maps CSS property names to Frame override prop names
 */
export const CSS_TO_OVERRIDE_PROP: Record<string, string> = {
  padding: "p",
  paddingTop: "pt",
  paddingBottom: "pb",
  paddingLeft: "pl",
  paddingRight: "pr",
  paddingInline: "px",
  paddingBlock: "py",
  gap: "gap",
  width: "w",
  height: "h",
  minWidth: "minWidth",
  minHeight: "minHeight",
  maxWidth: "maxWidth",
  maxHeight: "maxHeight",
  opacity: "opacity",
  zIndex: "zIndex",
};
