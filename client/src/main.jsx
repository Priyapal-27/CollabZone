import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  console.log("CollabZone app starting...");
  createRoot(rootElement).render(<App />);
  console.log("CollabZone app rendered successfully");
} catch (error) {
  console.error("Error starting CollabZone app:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Error loading app: ${error}</div>`;
}