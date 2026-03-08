import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { auth as authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("dl_access");
    if (!token) {
      // No access token — try refresh token before giving up
      const refresh = localStorage.getItem("dl_refresh");
      if (!refresh) {
        setLoading(false);
        return;
      }
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
        const { data } = await axios.post(`${baseURL}/auth/refresh/`, { refresh });
        localStorage.setItem("dl_access", data.access);
        if (data.refresh) localStorage.setItem("dl_refresh", data.refresh);
      } catch {
        localStorage.removeItem("dl_refresh");
        setLoading(false);
        return;
      }
    }
    try {
      const { data } = await authApi.profile();
      setUser(data);
    } catch (err) {
      // Only log out on explicit 401 — not on network errors or server hiccups
      if (err.response?.status === 401) {
        localStorage.removeItem("dl_access");
        localStorage.removeItem("dl_refresh");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const requestOTP = async (email) => {
    await authApi.requestOTP(email);
  };

  const verifyOTP = async (email, code) => {
    const { data } = await authApi.verifyOTP(email, code);
    localStorage.setItem("dl_access", data.access);
    localStorage.setItem("dl_refresh", data.refresh);
    localStorage.setItem("dl_email", email);
    await fetchProfile();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("dl_access");
    localStorage.removeItem("dl_refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, requestOTP, verifyOTP, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
