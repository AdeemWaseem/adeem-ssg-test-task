import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  username: string;
  full_name: string;
  // Add other user fields as needed
};

type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setLoginStatus: (status: boolean, userData?: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const setLoginStatus = (status: boolean, userData: User | null = null) => {
    setIsLogin(status);
    setUser(userData);

    if (typeof window !== "undefined") {
      localStorage.setItem("isLogin", status.toString());
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
    }
  };

  // Sync with localStorage only on the client side after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLoginStatus = localStorage.getItem("isLogin") === "true";
      const storedUser = localStorage.getItem("user");

      setIsLogin(storedLoginStatus);
      setUser(storedUser ? JSON.parse(storedUser) : null); // Retrieve user data from localStorage
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Prevent rendering until after mount to avoid hydration errors
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLogin, user, setLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
