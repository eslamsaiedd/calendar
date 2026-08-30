// // components/ProtectedRoute.tsx
// import { Navigate, Outlet } from 'react-router-dom';

// export function ProtectedRoute() {
//   // Replace this check with your actual auth state (e.g., useAuth() hook or localStorage token)
//   const isAuthenticated = Boolean(localStorage.getItem('token')); 

//   if (!isAuthenticated) {
//     // Redirect unauthenticated users to login page
//     return <Navigate to="/login" replace />;
//   }

//   // Render child routes if authenticated
//   return <Outlet />;
// }

