import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspector from "vite-plugin-react-inspector";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), Inspector()],
});
