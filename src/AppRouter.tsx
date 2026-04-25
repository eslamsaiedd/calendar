import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { Login } from "./pages/Login";
import Calendar from "./components/Calendar";

export function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            {/* public routes */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<App/>}>
                <Route index element={<Calendar/>}/>
            </Route>

        </Routes>
    </BrowserRouter>
  );
}