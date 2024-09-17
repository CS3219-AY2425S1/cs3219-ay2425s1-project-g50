"use client";

import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserAuthType {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserAuthType | null;
  token: string | null;
  login: (email: string, password: string) => Promise<UserAuthType | undefined>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tokenKey = "jwtToken";
  const [user, setUser] = useState<UserAuthType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem(tokenKey));
  }, []);

  // Login using locally stored JWT token
  useEffect(() => {
    if (token) {
      fetch("http://localhost:3001/auth/verify-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          res.json().then((result) => {
            setUser(result.data);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [token]);

  // Login using email and password
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Not OK");
      }

      const resJson = await response.json();

      setUser({
        id: resJson.data.id,
        username: resJson.data.username,
        email: resJson.data.email,
        isAdmin: resJson.data.isAdmin,
      });

      const { accessToken } = resJson.data;
      setToken(accessToken);

      // Cache JWT token for future authentication without login
      localStorage.setItem(tokenKey, accessToken);

      return user as UserAuthType;
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
