import { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getUserData: () => Promise<void>;
}

const defaultUserContextValue: UserContextType = {
  user: null,
  setUser: () => undefined,
  getUserData: async () => undefined,
};

export const UserContext = createContext<UserContextType>(
  defaultUserContextValue,
);

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  async function getUserData(): Promise<void> {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const { data } = await axios.get("https://character-moist-kangaroo.abasthan.app/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.data.user);
      window.dispatchEvent(new Event("auth:changed"));
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      window.dispatchEvent(new Event("auth:changed"));
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
