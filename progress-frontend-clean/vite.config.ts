import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { readdirSync } from "fs";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";

// Read theme.json
let themeConfig = { primary: "#0f172a", variant: "professional", appearance: "light", radius: 8 };
try {
  const themeContent = readdirSync(".").includes("theme.json") 
    ? JSON.parse(require("fs").readFileSync("theme.json", "utf8"))
    : {};
  themeConfig = { ...themeConfig, ...themeContent };
} catch (e) {
  console.warn("Could not read theme.json, using defaults");
}

export default defineConfig({
  plugins: [
    react(),
    themePlugin(themeConfig)
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: "0.0.0.0"
  }
});