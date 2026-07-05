import { createContext, useContext, useState } from "react";

type SidebarCtx = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarCtx>({
  isOpen: true,
  toggle: () => {},
  close: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((p) => !p);
  const close = () => setIsOpen(false);
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);