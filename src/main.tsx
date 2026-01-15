import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./design-system/token/tokens.1tier.css";
import "./design-system/token/tokens.palette.css";
import "./design-system/token/tokens.typography.css";
import "./design-system/token/tokens.components.css";
import "./design-system/token/tokens.themes.css";
import "./design-system/token/tokens.experiences.css";
import App from "./App";
import { ThemeProvider } from "./design-system/theme";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
}
