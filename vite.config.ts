import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import Inspector from "vite-plugin-react-inspector";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    // Inspector(),
    AutoImport({
      imports: [
        "react",
        {
          "@/design-system/Frame/Frame": ["Frame"],
          "@/design-system/Frame/Layout/Layout": ["Layout"],
          // Keep legacy imports working for now
          "@/legacy-design-system/token": [
            "Space",
            "Radius",
            "IconSize",
            "Size",
            "ContainerSize",
            "BorderWidth",
            "FontSize",
            "LineHeight",
            "AspectRatio",
            "Elevation",
            "Opacity",
            "ZIndex",
          ],
        },
      ],
      dts: "./auto-imports.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@/design-system": path.resolve(__dirname, "./src/legacy-design-system"),
      "@": path.resolve(__dirname, "./src"),
      // New Alias
      "@ui": path.resolve(__dirname, "./src/ui"),
      // Legacy Alias redirection
      "@design-system": path.resolve(__dirname, "./src/legacy-design-system"),
      "@hooks": path.resolve(__dirname, "./src/legacy-design-system/hooks"),
    },
  },
  server: {
    port: 5555,
    strictPort: true,
  },
});
