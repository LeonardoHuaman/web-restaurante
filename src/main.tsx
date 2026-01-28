// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/tailwind.css";
import "./styles/global.css";
import "./i18n";
import { AuthProvider } from "./providers/AuthProvider";
import { useThemeStore } from "./stores/themeStore";

useThemeStore
  .getState()
  .setColors("#000000ff", "#ffffffff", "#e21a1aff");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
