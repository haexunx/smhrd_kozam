import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/app/store/AuthProvider";
import { ModalProvider } from "@/app/store/ModalProvider";
import "@/app/styles/index.css";
import App from "@/app/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </AuthProvider>
  </StrictMode>,
);
