import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./routes/AppRouter.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "./index.css";
import { ModalProvider } from "./context/ModalContext.tsx";
import UserContextProvider from "./context/UserContext.tsx";
import { CalendarProvider } from "./context/CalendarContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CalendarProvider>
      <UserContextProvider>
        <ThemeProvider>
          <ModalProvider>
            <AppRouter />
          </ModalProvider>
        </ThemeProvider>
      </UserContextProvider>
    </CalendarProvider> 
  </StrictMode>,
);
