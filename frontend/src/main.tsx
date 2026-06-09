import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// StrictMode renders components twice in dev to surface side effects —
// this is intentional and disappears in production builds
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
