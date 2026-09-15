import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ["VITE_", "EXPO_PUBLIC_"],
  build: {
    chunkSizeWarningLimit: 2000,
    rolldownOptions: {
      onLog(level, log, handler) {
        if (log.code === "INVALID_ANNOTATION" || log.code === "PLUGIN_TIMINGS") {
          return;
        }
        handler(level, log);
      },
    },
  },
  resolve: {
    alias: {
      "@/src": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
