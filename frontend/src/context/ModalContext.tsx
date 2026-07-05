import { createContext, useContext, useState, type ReactNode } from "react";

const ModalContext = createContext<{
  isOpen: boolean;
  type: "event" | "task" | null;
  openModal: (modalType: "event" | "task") => void;
  closeModal: () => void;
} | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"event" | "task" | null>(null);

  const openModal = (modalType: "event" | "task") => {
    setType(modalType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, type, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};