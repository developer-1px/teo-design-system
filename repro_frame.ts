
import { frameToSettings } from "./src/design-system/lib/frameToSettings";
import { Space } from "./src/design-system/token/token.const.1tier";

const props = {
    p: "space.n24", // Space.n24
    rounded: "2xl",
    style: { border: "1px solid var(--border-color)" },
    gap: "space.n16", // Space.n16
    // other defaults passed by Frame might be relevant? 
    // Let's just test the overrides as if they were merged.
} as any;

const result = frameToSettings(props);
console.log("Input Props:", props);
console.log("Result Style:", JSON.stringify(result.style, null, 2));

if (!result.style.padding) {
    console.error("FAIL: Padding is missing!");
} else {
    console.log("PASS: Padding is present.");
}
