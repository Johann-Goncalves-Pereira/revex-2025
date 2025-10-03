import reactScan from "@react-scan/vite-plugin-react-scan";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const useCompiler = mode === "compiler" || mode === "production";

  return {
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
    resolve: {
      alias: {
        // Path aliases for better imports throughout the application
        // Instead of relative imports like '../../../components', you can use '@components/...'
        "@components": path.resolve(__dirname, "./src/components"), // Component directory alias
        "@hooks": path.resolve(__dirname, "./src/hooks"), // Custom hooks directory alias
        "@layout": path.resolve(__dirname, "./src/layout"), // Layout components directory alias
        "@utils": path.resolve(__dirname, "./src/utils"), // Utility functions directory alias
        "@pages": path.resolve(__dirname, "./src/pages"), // Page components directory alias
        "@routes": path.resolve(__dirname, "./src/routes"), // Application routes directory alias
        "@shared": path.resolve(__dirname, "./src/shared"), // Shared resources directory alias
        "@": path.resolve(__dirname, "./src"), // Root source directory alias
      },
    },
  };
});
