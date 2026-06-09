import { createContext, useContext } from "react";

export const ModalContext = createContext(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("ModalProvider 내에서만 사용 가능");
  }
  return context;
}
