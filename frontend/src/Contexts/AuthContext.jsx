
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("token");
        return storedToken || null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem("token");
            console.log('Token en localStorage:', storedToken);

            if (storedToken) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });
                    console.log('Respuesta del perfil:', res.data);
                    setUser(res.data);
                    setToken(storedToken);
                } catch (err) {
                    console.error("Error en verifyToken:", err);
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            } else {
                console.log('No hay token en localStorage');
            }

            setLoading(false);
        };

        verifyToken();

        const checkTokenInterval = setInterval(verifyToken, 5 * 60 * 1000);
        return () => clearInterval(checkTokenInterval);
    }, []);

    const login = async ({ email, password }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password }
            );
            const { token, user } = res.data;

            console.log('Token recibido del login:', token);
            console.log('User recibido del login:', user);

            localStorage.setItem("token", token);
            setToken(token);
            setUser(user);

            await verifyToken();
        } catch (err) {
            console.error('Error en login:', err);
            throw err;
        }
    };

    const verifyToken = async () => {
        const storedToken = localStorage.getItem("token");
        console.log('Verificando token:', storedToken);

        if (storedToken) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                console.log('Perfil verificado:', res.data);
                setUser(res.data.user);
                setToken(storedToken);
            } catch (err) {
                console.error("Error verificando token:", err);
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }
        } else {
            console.log('No hay token en localStorage');
            setUser(null);
            setToken(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        verifyToken();
        const checkTokenInterval = setInterval(verifyToken, 5 * 60 * 1000);
        return () => clearInterval(checkTokenInterval);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);