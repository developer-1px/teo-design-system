import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design-system/tokens.css";
import "./index.css"; // Keep for reset if needed, but tokens.css handles most
import App from "./App.tsx";
import { ThemeProvider } from "./design-system/theme";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</StrictMode>,
);
