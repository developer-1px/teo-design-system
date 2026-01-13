import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design-system/tokens.css";
import "./index.css"; // Keep for reset if needed, but tokens.css handles most
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
