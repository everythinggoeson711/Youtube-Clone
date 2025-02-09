import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import QueryProvider from "./contexts/query-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <Toaster />
      <App />
    </QueryProvider>
  </StrictMode>,
);
