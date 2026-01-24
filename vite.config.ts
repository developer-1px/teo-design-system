import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspector from "vite-plugin-react-inspector";
import AutoImport from "unplugin-auto-import/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspector(),
    AutoImport({
      imports: [
        "react",
        {
          "@/design-system/Frame/Frame": ["Frame"],
          "@/design-system/Frame/Layout/Layout": ["Layout"],
          "@/design-system/token": [
            "Space",
            "Radius",
            "Radius2",
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
            "ActionSize",
            "ButtonSize",
            "InputSize",
          ],
        },
      ],
      dts: "./auto-imports.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hooks": path.resolve(__dirname, "./src/design-system/hooks"),
      "@hooks/components": path.resolve(__dirname, "./src/design-system/hooks/components"),
      "@hooks/data": path.resolve(__dirname, "./src/design-system/hooks/data"),
      "@hooks/interaction": path.resolve(__dirname, "./src/design-system/hooks/interaction"),
      "@hooks/state": path.resolve(__dirname, "./src/design-system/hooks/state"),
      "@hooks/search": path.resolve(__dirname, "./src/design-system/hooks/search"),
      "@hooks/primitives": path.resolve(__dirname, "./src/design-system/hooks/primitives"),
      "@hooks/lib": path.resolve(__dirname, "./src/design-system/hooks/lib"),
    },
  },
});
