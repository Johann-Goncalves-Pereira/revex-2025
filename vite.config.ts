import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const compiler = [["babel-plugin-react-compiler", { target: "19" }]];

  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        isProduction ? "production" : "development"
      ),
      __DEV__: !isProduction,
    },
    server: {
      hmr: true, // Always enable HMR for development
    },
    plugins: [
      tailwindcss(),
      react({
        jsxRuntime: "automatic",
        babel: { plugins: isProduction ? compiler : [] },
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
