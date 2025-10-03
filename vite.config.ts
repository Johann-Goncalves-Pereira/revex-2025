import reactScan from "@react-scan/vite-plugin-react-scan";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// @ts-expect-error - Plugin type compatibility issues with rolldown-vite
export default defineConfig(({ mode }) => {
  const useCompiler = mode === "compiler" || mode === "production";

  return {
    server: {
      hmr: !useCompiler,
    },
    plugins: [
      tailwindcss(),
      tanstackRouter({
        autoCodeSplitting: true,
      }),
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
          trackUnnecessaryRenders: true,
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
        "@shared": path.resolve(__dirname, "./src/shared"), // Shared resources directory alias
        "@": path.resolve(__dirname, "./src"), // Root source directory alias
      },
    },
  };
});
