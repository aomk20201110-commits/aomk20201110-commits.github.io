import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * A user site (`<owner>.github.io`) is served from the domain root, but a
 * project site is served from `/<repo>/`. The deployment workflow sets
 * BASE_PATH accordingly; local development and the user-site default use "/".
 */
function normalizeBase(value: string | undefined) {
  if (!value || value === "/") return "/";
  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
}

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
    chunkSizeWarningLimit: 1400,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
