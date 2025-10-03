import reactScan from "@react-scan/vite-plugin-react-scan";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
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
