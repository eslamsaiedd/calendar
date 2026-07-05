import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  async function getUserData() {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(data.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}