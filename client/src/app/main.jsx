import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/app/store/AuthContext";
import { ModalProvider } from "@/app/store/ModalContext";
import "@/index.css";
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
