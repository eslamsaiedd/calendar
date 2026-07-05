import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { Login } from "../pages/Login";
import Calendar from "../pages/Calendar";
import { Signup } from "../pages/Signup";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<App />}>
          <Route index element={<Calendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
