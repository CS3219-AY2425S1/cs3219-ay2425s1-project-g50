"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface UserType {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: UserType | null;
    login: (email: string, password: string) => Promise<UserType | undefined>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const tokenKey = "jwtToken";
    const [user, setUser] = useState<UserType | null>(null);

    // Login using locally stored JWT token
    useEffect(() => {
        const token = localStorage.getItem(tokenKey);

        if (token) {
            fetch("http://localhost:3001/auth/verify-token", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }).then(res => {
                res.json().then(result => {
                    setUser(result.data);
                })
            }).catch(err => {
                console.error(err);
            })
        }
    }, []);

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

            // Cache JWT token for future authentication without login
            localStorage.setItem(tokenKey, resJson.data.accessToken);

            return user as UserType;
        } catch (err) {
            console.error(err);
        }
    }

    const logout = async () => {
        setUser(null);
        localStorage.removeItem("jwtToken");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
