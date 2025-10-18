import { scan } from "react-scan";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "./main.css";

if (import.meta.env.DEV) {
  scan({
    enabled: true,
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
