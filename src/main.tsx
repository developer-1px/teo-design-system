import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design-system/tokens.css";
import "./index.css"; // Keep for reset if needed, but tokens.css handles most
import App from "./App";
import { ThemeProvider } from "./design-system/theme";
import * as ReactDOM from "react-dom";

// Polyfill for legacy ReactDOM.render (required by some plugins like vite-plugin-react-inspector in React 19)
if (!(ReactDOM as any).render) {
  (ReactDOM as any).render = (element: React.ReactNode, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(element);
  };
}


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
