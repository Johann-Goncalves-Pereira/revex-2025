import reactScan from "@react-scan/vite-plugin-react-scan";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const useCompiler =
  process.argv.includes("--compiler") ||
  process.argv.includes("-c") ||
  process.env.NODE_ENV === "production";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  server: {
    hmr: !useCompiler,
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: useCompiler
          ? [["babel-plugin-react-compiler", { target: "19" }]]
          : [],
      },
    }),
    reactScan({
      autoDisplayNames: true,
      scanOptions: {
        trackUnnecessaryRenders: true, // Enable tracking of unnecessary re-renders in React components
      },
    }),
  ],
});
