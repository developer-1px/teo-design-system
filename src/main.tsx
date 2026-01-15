import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./style/tokens.1tier.css";
import "./style/tokens.palette.css";
import "./style/tokens.typography.css";
import "./style/tokens.components.css";
import "./style/tokens.themes.css";
import "./style/tokens.experiences.css";
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
