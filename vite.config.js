import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

function copyAssetsPlugin() {
  return {
    name: "copy-assets",
    writeBundle() {
      const src = resolve("assets");
      const dest = resolve("dist/assets");
      if (!existsSync(src)) return;
      mkdirSync(dest, { recursive: true });
      cpSync(src, dest, { recursive: true });
    },
  };
}

export default defineConfig({
  base: "/react-portfolio-main/",
  plugins: [react(), copyAssetsPlugin()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});
