import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/react-portfolio-main/",
  plugins: [react()],
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
