"use client";

import { AuthType, userServiceUri } from "@/lib/api/api-uri";
import { User, UserSchema } from "@/lib/schemas/user-schema";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null | undefined;
  token: string | null | undefined;
  login: (email: string, password: string) => Promise<User | undefined>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tokenKey = "jwtToken";
  const [user, setUser] = useState<User | null>();
  const [token, setToken] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem(tokenKey));
  }, []);

  // Login using locally stored JWT token
  useEffect(() => {
    if (token !== undefined) {
      setIsLoading(false);
    }
    if (token) {
      setIsLoading(true);
      fetch(
        `${userServiceUri(window.location.hostname, AuthType.Public)}/auth/verify-token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          res.json().then((result) => {
            setUser(result.data);
            setIsLoading(false);
          });
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [token]);

  // Login using email and password
  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch(
      `${userServiceUri(window.location.hostname, AuthType.Public)}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error("Email and/or password is missing.");
        case 401:
          throw new Error("Invalid email or password.");
        case 500:
          throw new Error("Internal server error. Please try again later.");
        default:
          throw new Error("Unexpected error occurred.");
      }
    }

    const resJson = await response.json();

    const loginUser = UserSchema.parse(resJson.data);
    setUser(loginUser);

    const { accessToken } = resJson.data;
    setToken(accessToken);

    // Cache JWT token for future authentication without login
    localStorage.setItem(tokenKey, accessToken);

    return loginUser;
  };

  const logout = async () => {
    router.push("/");
    localStorage.removeItem("jwtToken");
    setUser(undefined);
    setToken(undefined);
    setIsLoading(true);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
