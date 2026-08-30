import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { Login } from "../pages/Login";
import Calendar from "../pages/Calendar";
import { Signup } from "../pages/Signup";
import Profile from "../pages/Profile";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* protected routes */}      
        <Route path="/" element={<App />}>
          <Route index element={<Calendar />} />
          {/* Keep profile strictly protected or redirect if unauthenticated */}
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<h2>Page Not Found</h2>} />
      
      </Routes>
    </BrowserRouter>
  );
}
